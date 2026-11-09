/**
 * teamRefresh.ts — shared refresh logic for the Our Team page (SERVER-SIDE ONLY).
 *
 * Called by the protected webhook (src/app/api/team-refresh/route.ts) when Google Apps Script reports that the
 * Google Sheet changed. A notification is only a SIGNAL: nothing from the request is used as team data. The real data
 * is always re-read from Google by the same code that normally builds the page (teamDirectory.ts).
 *
 * HOW A REFRESH WORKS
 *   1. markTeamCachesStale() marks the stored team snapshot (tag "team-directory") as STALE, and for scope "all"
 *      also the stored photo-folder listing (tag "team-photos"). Stale is not deleted: the previous snapshot stays
 *      stored as the last-good copy.
 *   2. The cached Our Team page depends on that tag, so the next request rebuilds it. The rebuild re-reads the Sheet
 *      and Drive through teamDirectory.ts, which applies the existing validation rules and replaces the stored
 *      snapshot ONLY after a complete, valid read. If Google fails, or the Sheet is invalid or incomplete, the
 *      previous snapshot keeps being served.
 *   3. runTeamRefreshWorker() asks for the page once, so the rebuild happens right away instead of waiting for the
 *      next visitor. Bursts of notifications are merged: at most one request is in flight per server instance, plus
 *      one follow-up if more notifications arrived meanwhile.
 *
 * WHY THERE IS NO revalidatePath("/our-team")
 *   revalidatePath expires the page's implicit tag HARD. Stored data that is read while that page is rebuilt then
 *   counts as missing, so a Google failure would fall back to the static list and lose the last-good snapshot. Soft
 *   tag invalidation (revalidateTag with the "max" profile) only marks entries stale and keeps them.
 */
import { revalidateTag } from "next/cache";
import { TEAM_PHOTOS_TAG, TEAM_SNAPSHOT_TAG } from "@/lib/teamDirectory";

/** "team": the Sheet changed. "all": also refresh the stored photo-folder listing (photo changes, manual refresh). */
export type TeamRefreshScope = "team" | "all";

const PRIME_PATH = "/our-team";
const PRIME_TIMEOUT_MS = 10_000;
/** The whole background run (all passes together) stops starting new work after this long. */
const WORKER_TIME_BUDGET_MS = 20_000;
/** A worker still marked as running after this long is treated as dead (killed or stuck), so it cannot block new ones. */
const RUNNING_WATCHDOG_MS = 30_000;

const warned = new Set<string>();
function warnOnce(message: string) {
    if (warned.has(message)) return;
    warned.add(message);
    console.warn(`[teamRefresh] ${message}`);
}

/**
 * Marks the stored Google data as stale (soft invalidation: the last good copy is kept). Synchronous and cheap, so it
 * is safe to call for every notification. Must be called while handling a request (for example in a route handler).
 */
export function markTeamCachesStale(scope: TeamRefreshScope): void {
    revalidateTag(TEAM_SNAPSHOT_TAG, "max"); // the snapshot also holds the photo links, so it is always refreshed
    if (scope === "all") revalidateTag(TEAM_PHOTOS_TAG, "max");
}

/* ---- Merging bursts of notifications (per server instance) ---- */

let running = false;
let runningSince = 0; // when the current worker was started (for the watchdog)
let currentRunId = 0; // identifies the current worker, so a late or dead worker can never clear a newer one's flag
let pending = false;

/**
 * Records that a refresh is wanted. Returns `startWorker: true` if no worker is running on this instance, in which
 * case the caller must start `runTeamRefreshWorker(origin, runId)` (for example with `after()`); otherwise the
 * running worker will do one more pass for this notification.
 * Watchdog: a worker that has been "running" for longer than RUNNING_WATCHDOG_MS (for example because the function
 * was cut off before it could finish) is treated as dead, and a new worker is started.
 */
export function queueTeamRefresh(): { startWorker: boolean; runId: number } {
    pending = true;
    if (running && Date.now() - runningSince < RUNNING_WATCHDOG_MS) return { startWorker: false, runId: currentRunId };
    running = true;
    runningSince = Date.now();
    currentRunId += 1;
    return { startWorker: true, runId: currentRunId };
}

/** Frees the "running" slot if a worker was queued but could not be scheduled. Only affects that same worker. */
export function abandonTeamRefreshRun(runId: number): void {
    if (runId === currentRunId) {
        running = false;
        runningSince = 0;
    }
}

/** Requests the page once so that it is rebuilt now. The response is discarded. Never throws. */
async function primePage(origin: string, timeoutMs: number): Promise<void> {
    try {
        const res = await fetch(new URL(PRIME_PATH, origin), {
            cache: "no-store",
            headers: { "user-agent": "digiswasthya-team-refresh" },
            signal: AbortSignal.timeout(timeoutMs),
        });
        await res.body?.cancel();
        if (!res.ok) warnOnce(`The page request after a notification returned HTTP ${res.status}.`);
    } catch (e) {
        // A timeout only means the page took long to render. The request reached the server, so the rebuild is under way.
        if (e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError")) return;
        warnOnce("The page request after a notification could not be sent. The next visitor will rebuild the page instead.");
    }
}

/**
 * Runs queued refreshes one after another until none are pending or the time budget is used up. Never throws.
 * `origin` is the address the notification arrived on (so the same deployment's cache is the one that gets rebuilt).
 * If the budget runs out while a notification is still pending, nothing is lost: the stored data is already marked
 * stale, so the next notification (or the next visitor) rebuilds the page.
 */
export async function runTeamRefreshWorker(origin: string, runId: number): Promise<void> {
    const deadline = Date.now() + WORKER_TIME_BUDGET_MS;
    try {
        while (pending) {
            const remaining = deadline - Date.now();
            if (remaining <= 0) {
                warnOnce("The background refresh used its time budget. The next notification or visit will rebuild the page.");
                break; // `pending` stays set, so a later worker picks it up
            }
            pending = false;
            await primePage(origin, Math.min(PRIME_TIMEOUT_MS, remaining));
        }
    } finally {
        // Only clear the flag if this worker is still the current one (a later worker may have replaced it).
        if (runId === currentRunId) {
            running = false;
            runningSince = 0;
        }
    }
}
