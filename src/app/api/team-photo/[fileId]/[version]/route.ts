import { getTeamPhoto } from "@/lib/teamDirectory";

/**
 * GET /api/team-photo/<fileId>/<version>
 *
 * Streams one Our Team photo from Google Drive. The address is produced by src/lib/teamDirectory.ts:
 *   fileId  = the Drive file ID
 *   version = the file's content fingerprint (md5), so a replaced photo gets a new address.
 *
 * The photo is served only if it is an allowed image in the configured team Photos folder and `version`
 * matches its current fingerprint (checked in getTeamPhoto). Nothing else in Drive can be reached through
 * this route, and no Drive metadata, credentials or error details are ever sent to the browser.
 */
export const runtime = "nodejs";

// Drive file IDs use letters, digits, "_" and "-". The version is an md5 hex string or a short alphanumeric stamp.
const FILE_ID_PATTERN = /^[A-Za-z0-9_-]{10,128}$/;
const VERSION_PATTERN = /^[A-Za-z0-9]{1,64}$/;

const NO_STORE = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

function notFound() {
    return new Response("Not found", { status: 404, headers: { ...NO_STORE, "Content-Type": "text/plain; charset=utf-8" } });
}

export async function GET(_req: Request, context: { params: Promise<{ fileId: string; version: string }> }) {
    const { fileId, version } = await context.params;
    if (!FILE_ID_PATTERN.test(fileId) || !VERSION_PATTERN.test(version)) return notFound();

    const photo = await getTeamPhoto(fileId, version);

    if (photo.status === "not-found") return notFound();

    if (photo.status === "unavailable") {
        // Temporary problem (for example Google is unreachable). Never cached, so the next request tries again.
        return new Response("Temporarily unavailable", {
            status: 503,
            headers: { ...NO_STORE, "Content-Type": "text/plain; charset=utf-8", "Retry-After": "60" },
        });
    }

    return new Response(photo.body, {
        status: 200,
        headers: {
            "Content-Type": photo.contentType,
            // The version is part of the address, so this exact URL always means this exact picture.
            // Browsers keep it for a year ("immutable"). Shared caches such as Vercel's CDN may keep it for a day
            // (s-maxage) and then re-check with this route, which answers from the shared photo cache without
            // calling Google, and returns 404 if the photo has since been replaced or deleted.
            "Cache-Control": "public, max-age=31536000, s-maxage=86400, immutable",
            "X-Content-Type-Options": "nosniff",
            "Content-Disposition": "inline",
        },
    });
}
