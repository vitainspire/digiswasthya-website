import { createHash, timingSafeEqual } from "crypto";
import { after, NextRequest, NextResponse } from "next/server";
import { rateLimited } from "@/lib/rateLimit";
import {
    abandonTeamRefreshRun,
    markTeamCachesStale,
    queueTeamRefresh,
    runTeamRefreshWorker,
    type TeamRefreshScope,
} from "@/lib/teamRefresh";

/**
 * POST /api/team-refresh
 *
 * Webhook called by the Google Apps Script bound to the team Google Sheet (see docs/team-apps-script/).
 * It is only a SIGNAL that "something changed": nothing in the request is ever used as team data. After the caller is
 * authenticated, the stored team data is marked stale and the page is rebuilt from the real Google data by the same
 * code that normally builds it (src/lib/teamDirectory.ts). An invalid or incomplete Sheet, or a Google outage, can
 * therefore never replace the last good snapshot.
 *
 * Security:
 *   - POST only (Next.js answers every other method with 405).
 *   - `Authorization: Bearer <TEAM_REFRESH_SECRET>`, compared in constant time. If the secret is missing or shorter
 *     than 24 characters, EVERY request is rejected (fail closed). The secret is never logged or returned.
 *   - Request bodies are limited to 2 KB, and only a "scope" of "team" or "all" is read from them.
 *   - Responses never contain Google data, credentials or internal error details.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Upper limit for this function, including the background work started with after(). The refresh worker stops itself
// after 20 seconds (src/lib/teamRefresh.ts), so 30 leaves a margin. Vercel's documented limits are above this for
// every plan; Next.js App Router routes set it with this named export.
export const maxDuration = 30;

const MIN_SECRET_LENGTH = 24;
const MAX_BODY_BYTES = 2048;
const SCOPES: ReadonlySet<string> = new Set(["team", "all"]);
const MAX_FAILED_ATTEMPTS = 30; // per server instance per 10 minutes; only reduces noise, it never blocks a valid caller

let warnedAboutSecret = false;
let warnedAboutScheduling = false;

function reply(status: number, body: Record<string, unknown>) {
    return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const sha256 = (value: string) => createHash("sha256").update(value).digest();

function isAuthorized(req: Request, secret: string): boolean {
    const match = /^Bearer (.+)$/.exec(req.headers.get("authorization") ?? "");
    if (!match) return false;
    // Hashing first makes both values the same length, so the comparison leaks nothing about the secret's length.
    return timingSafeEqual(sha256(match[1]), sha256(secret));
}

export async function POST(req: NextRequest) {
    // 1. Authenticate. A missing or weak secret rejects everything.
    const secret = process.env.TEAM_REFRESH_SECRET;
    const configured = typeof secret === "string" && secret.length >= MIN_SECRET_LENGTH;
    if (!configured && !warnedAboutSecret) {
        warnedAboutSecret = true;
        console.warn(`[team-refresh] TEAM_REFRESH_SECRET is missing or shorter than ${MIN_SECRET_LENGTH} characters: all requests are rejected.`);
    }
    if (!configured || !isAuthorized(req, secret)) {
        if (rateLimited("team-refresh-failed-auth", MAX_FAILED_ATTEMPTS)) return reply(429, { ok: false, error: "too-many-attempts" });
        return reply(401, { ok: false, error: "unauthorized" });
    }

    // 2. Read and validate the (tiny) body. It may be empty.
    if (Number(req.headers.get("content-length") ?? "0") > MAX_BODY_BYTES) return reply(413, { ok: false, error: "payload-too-large" });
    let text: string;
    try {
        text = await req.text();
    } catch {
        return reply(400, { ok: false, error: "invalid-request" });
    }
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return reply(413, { ok: false, error: "payload-too-large" });

    let scope: TeamRefreshScope = "team";
    if (text.trim() !== "") {
        let parsed: unknown;
        try {
            parsed = JSON.parse(text);
        } catch {
            return reply(400, { ok: false, error: "invalid-request" });
        }
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return reply(400, { ok: false, error: "invalid-request" });
        const requested = (parsed as Record<string, unknown>).scope;
        if (requested !== undefined) {
            if (typeof requested !== "string" || !SCOPES.has(requested)) return reply(400, { ok: false, error: "invalid-request" });
            scope = requested as TeamRefreshScope;
        }
    }

    // 3. Mark the stored Google data stale (the last good copy is kept) ...
    try {
        markTeamCachesStale(scope);
    } catch {
        return reply(500, { ok: false, error: "refresh-failed" });
    }

    // 4. ... and have the page rebuilt right away, after this response has been sent. Bursts are merged.
    const { startWorker, runId } = queueTeamRefresh();
    if (startWorker) {
        const origin = req.nextUrl.origin;
        try {
            after(() => runTeamRefreshWorker(origin, runId));
        } catch {
            // The cache is already marked stale, so the next visitor rebuilds the page anyway. Free the slot so later
            // notifications can start a worker, and still report success: the notification itself was handled.
            abandonTeamRefreshRun(runId);
            if (!warnedAboutScheduling) {
                warnedAboutScheduling = true;
                console.warn("[team-refresh] The background refresh could not be scheduled. The next visit will rebuild the page.");
            }
            return reply(202, { ok: true, status: "accepted", scope });
        }
    }
    return reply(202, { ok: true, status: startWorker ? "accepted" : "merged", scope });
}
