/**
 * teamDirectory.ts — reads the "Our Team" directory from Google Sheets + Google Drive (SERVER-SIDE ONLY).
 *
 * WHERE THE DATA COMES FROM
 *   - Google Sheet (tab "Sheet1" by default): name, designation, section, photo_filename, display_order, is_active
 *   - Google Drive: the "Photos" folder inside the team folder. The photos may sit one level deeper
 *     (Photos / Photos / <images>); the reader detects that and reads the inner folder.
 *
 * PHOTOS
 *   getTeamPhoto() (used by /api/team-photo/[fileId]/[version]) streams one photo, but only if it is an allowed image
 *   inside that same Photos folder and the requested version matches the file's current content fingerprint.
 *   The photo-folder listing and the photo bytes are kept in Next.js's shared Data Cache (last-good listing; bytes
 *   stored once per file ID + fingerprint), so visitors do not cause repeated Google Drive requests.
 *
 * LAST-GOOD SNAPSHOT AND FALLBACK
 *   Every successful, complete Google read is stored in Next.js's shared Data Cache. If a later read fails, that
 *   last successful snapshot keeps being served. The built-in data in src/data/teamData.ts is used only when no
 *   successful snapshot has ever been stored (or Google is not configured). A failed, partial or empty read is
 *   never stored. The website keeps working and retries on the next refresh.
 *
 * SECURITY
 *   - Import this file only from server code (server components, route handlers). Never from a "use client" file.
 *   - The service-account key is read from an environment variable only. It is never logged or returned.
 *   - Only read-only Google scopes are requested.
 *   - Logs contain failure categories and counts only: never credentials, names or other personal data.
 *
 * ENVIRONMENT VARIABLES (all server-only; none start with NEXT_PUBLIC_)
 *   GOOGLE_TEAM_SERVICE_ACCOUNT_KEY   service-account JSON text
 *   GOOGLE_TEAM_SHEET_ID              ID of the Google Sheet
 *   GOOGLE_TEAM_DRIVE_FOLDER_ID       ID of the team folder that contains the "Photos" folder
 *   GOOGLE_TEAM_SHEET_TAB             optional tab name (default: the first tab)
 */
import { createHash } from "crypto";
import { unstable_cache } from "next/cache";
import { GoogleAuth } from "google-auth-library";
import {
    board,
    coreTeam,
    foundingTeam,
    advisoryBoard,
    doctors,
    onGroundTeam,
    doctorGroups as staticDoctorGroups,
    OTHER_SPECIALISTS,
    type DoctorGroup,
    type TeamMember,
} from "@/data/teamData";

/* ------------------------------------------------------------------ */
/* Public types                                                       */
/* ------------------------------------------------------------------ */

export type TeamSectionKey = "board" | "coreTeam" | "foundingTeam" | "advisoryBoard" | "doctors" | "onGroundTeam";

/** The six sections, in the order the Our Team page shows them. `title` must match the Sheet's `section` values. */
export const TEAM_SECTIONS: ReadonlyArray<{ key: TeamSectionKey; title: string }> = [
    { key: "board", title: "Board of Directors" },
    { key: "coreTeam", title: "Core Team" },
    { key: "foundingTeam", title: "Founding Team" },
    { key: "advisoryBoard", title: "Advisory Board" },
    { key: "doctors", title: "Doctors Onboard" },
    { key: "onGroundTeam", title: "On-Ground Team" },
];

/** Photos from Drive are served by a server route (added in a later step): /api/team-photo/<fileId>/<version> */
export const TEAM_PHOTO_ROUTE_PREFIX = "/api/team-photo";

export interface TeamDirectoryDiagnostics {
    /** Why the built-in data is being used (only when source is "fallback"). A category, never an error body. */
    fallbackReason?: string;
    rowsRead: number;
    rowsShown: number;
    skipped: { incomplete: number; unknownSection: number; tooLong: number; inactive: number };
    photos: {
        /** "drive" = matched against the Drive folder; "static" = Drive was unreachable, built-in photo files used. */
        source: "drive" | "static" | "none";
        matched: number;
        /** Rows that name a photo that could not be found (they show the initial letter). */
        missing: number;
        blank: number;
        /** Category of the Drive problem, if photos could not be read. */
        issue?: string;
    };
    /**
     * How old the Google snapshot is, in seconds (only for source "google"). A value above the refresh interval
     * means Google could not be re-read and the last successful snapshot is being served.
     */
    snapshotAgeSeconds?: number;
}

export interface TeamDirectory {
    source: "google" | "fallback";
    fetchedAt: string;
    board: TeamMember[];
    coreTeam: TeamMember[];
    foundingTeam: TeamMember[];
    advisoryBoard: TeamMember[];
    doctors: TeamMember[];
    /** Doctors grouped by speciality (alphabetical, "Other Specialists" last): same shape as teamData.doctorGroups. */
    doctorGroups: DoctorGroup[];
    onGroundTeam: TeamMember[];
    diagnostics: TeamDirectoryDiagnostics;
}

/* ------------------------------------------------------------------ */
/* Internal helpers                                                   */
/* ------------------------------------------------------------------ */

class TeamDirectoryError extends Error {
    constructor(public readonly reason: string) {
        super(reason);
    }
}

const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/drive.readonly",
];
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_SHEET_ROWS = 2000;
const MAX_TEXT_LENGTH = 200;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_DRIVE_PAGES = 5;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const FOLDER_TYPE = "application/vnd.google-apps.folder";
const PHOTOS_FOLDER_NAME = "photos";
const ID_PATTERN = /^[A-Za-z0-9_-]{10,}$/;

/* ---- Last-good snapshot cache (Next.js shared Data Cache) ---- */
/**
 * After this many seconds the stored snapshot counts as "stale". It must stay BELOW the page's own `revalidate`
 * (300 s) so that every time the page is rebuilt it re-reads Google first; the stale entry is kept only as the
 * last-good copy to fall back on if that read fails.
 */
const SNAPSHOT_REVALIDATE_SECONDS = 60;
/** Bump when the shape of TeamDirectory changes, so an older stored snapshot is never reused. */
const SNAPSHOT_SCHEMA_VERSION = "v1";
/** Tag for the stored snapshot (lets a later phase refresh it on demand). */
export const TEAM_SNAPSHOT_TAG = "team-directory";
/**
 * A read where the Sheet works but the Drive photo list fails counts as a failed refresh, so the previous complete
 * snapshot (with its Drive photos) stays in place. Set to false to restore the older "Sheet data + built-in photo
 * files" behaviour.
 */
const SNAPSHOT_REQUIRES_DRIVE_PHOTOS = true;
/** Only an explicit TRUE (a ticked checkbox is read as TRUE) shows a person. Blank, FALSE or anything else hides them. */
const isActiveValue = (value: string) => value.trim().toLowerCase() === "true";

const warned = new Set<string>();
function warnOnce(message: string) {
    if (warned.has(message)) return;
    warned.add(message);
    console.warn(`[teamDirectory] ${message}`);
}

interface Config {
    keyText: string;
    sheetId: string;
    folderId: string;
    tab: string;
}

function readConfig(): Config | null {
    const keyText = process.env.GOOGLE_TEAM_SERVICE_ACCOUNT_KEY;
    const sheetId = process.env.GOOGLE_TEAM_SHEET_ID?.trim();
    const folderId = process.env.GOOGLE_TEAM_DRIVE_FOLDER_ID?.trim();
    if (!keyText || !sheetId || !folderId) return null;
    if (!ID_PATTERN.test(sheetId) || !ID_PATTERN.test(folderId)) throw new TeamDirectoryError("invalid-config-ids");
    return { keyText, sheetId, folderId, tab: process.env.GOOGLE_TEAM_SHEET_TAB?.trim() ?? "" };
}

/* ---- Google authentication (server-side, read-only scopes) ---- */

let cachedAuth: { fingerprint: string; auth: GoogleAuth } | null = null;

function getAuth(keyText: string): GoogleAuth {
    let parsed: unknown;
    try {
        parsed = JSON.parse(keyText);
    } catch {
        throw new TeamDirectoryError("invalid-key-json");
    }
    const key = parsed as { client_email?: unknown; private_key?: unknown };
    if (typeof key?.client_email !== "string" || typeof key?.private_key !== "string") {
        throw new TeamDirectoryError("invalid-key-fields");
    }
    // Reuse one client per key so Google's short-lived access token is cached between refreshes.
    const fingerprint = `${key.client_email}:${key.private_key.length}`;
    if (cachedAuth && cachedAuth.fingerprint === fingerprint) return cachedAuth.auth;
    const auth = new GoogleAuth({
        credentials: { client_email: key.client_email, private_key: key.private_key.replace(/\\n/g, "\n") },
        scopes: SCOPES,
    });
    cachedAuth = { fingerprint, auth };
    return auth;
}

/** Authenticated GET to a Google API. Throws a TeamDirectoryError (a safe category) on any problem. */
async function googleFetch(auth: GoogleAuth, url: string): Promise<Response> {
    let token: string | null | undefined;
    try {
        token = await auth.getAccessToken();
    } catch {
        throw new TeamDirectoryError("auth-failed");
    }
    if (!token) throw new TeamDirectoryError("auth-failed");
    let res: Response;
    try {
        res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    } catch {
        throw new TeamDirectoryError("network-error");
    }
    if (!res.ok) throw new TeamDirectoryError(`http-${res.status}`);
    return res;
}

async function googleGet(auth: GoogleAuth, url: string): Promise<unknown> {
    const res = await googleFetch(auth, url);
    try {
        return await res.json();
    } catch {
        throw new TeamDirectoryError("invalid-response");
    }
}

/* ---- Google Sheet ---- */

async function readSheetRows(auth: GoogleAuth, sheetId: string, tab: string): Promise<string[][]> {
    // Without a tab name, "A:Z" refers to the first tab.
    const range = tab ? `'${tab.replace(/'/g, "''")}'!A:Z` : "A:Z";
    const url =
        `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${encodeURIComponent(range)}` +
        `?valueRenderOption=FORMATTED_VALUE&majorDimension=ROWS`;
    const data = (await googleGet(auth, url)) as { values?: unknown };
    const values = Array.isArray(data?.values) ? data.values : [];
    return values.slice(0, MAX_SHEET_ROWS + 1).map((row: unknown) =>
        Array.isArray(row) ? row.map((cell) => (cell === null || cell === undefined ? "" : String(cell))) : []
    );
}

interface ParsedEntry {
    rowIndex: number;
    name: string;
    designation: string;
    section: TeamSectionKey;
    photoFilename: string;
    order: number;
}

function clean(value: string | undefined): string {
    // eslint-disable-next-line no-control-regex
    return (value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeSection(value: string): string {
    return clean(value).toLowerCase();
}

const SECTION_BY_NORMALIZED_TITLE = new Map<string, TeamSectionKey>(
    TEAM_SECTIONS.map((s) => [normalizeSection(s.title), s.key])
);

function parseRows(rows: string[][]) {
    if (rows.length === 0) throw new TeamDirectoryError("sheet-empty");
    const header = rows[0].map((h) => clean(h).toLowerCase());
    const col = (name: string) => header.indexOf(name);
    const iName = col("name");
    const iRole = col("designation");
    const iSection = col("section");
    if (iName < 0 || iRole < 0 || iSection < 0) throw new TeamDirectoryError("missing-columns");
    const iPhoto = col("photo_filename");
    const iOrder = col("display_order");
    const iActive = col("is_active");

    const skipped = { incomplete: 0, unknownSection: 0, tooLong: 0, inactive: 0 };
    const entries: ParsedEntry[] = [];
    let rowsRead = 0;

    rows.slice(1).forEach((row, i) => {
        const cell = (idx: number) => (idx >= 0 ? row[idx] : undefined);
        const name = clean(cell(iName));
        const designation = clean(cell(iRole));
        const sectionText = clean(cell(iSection));
        const photoFilename = clean(cell(iPhoto));
        const orderText = clean(cell(iOrder));
        const activeText = clean(cell(iActive));
        if (!name && !designation && !sectionText && !photoFilename && !orderText && !activeText) return; // empty row
        rowsRead++;
        if (!name || !designation || !sectionText) { skipped.incomplete++; return; }
        if (name.length > MAX_TEXT_LENGTH || designation.length > MAX_TEXT_LENGTH || photoFilename.length > MAX_TEXT_LENGTH) { skipped.tooLong++; return; }
        const section = SECTION_BY_NORMALIZED_TITLE.get(normalizeSection(sectionText));
        if (!section) { skipped.unknownSection++; return; }
        if (!isActiveValue(activeText)) { skipped.inactive++; return; }
        const order = orderText === "" ? Number.NaN : Number(orderText);
        entries.push({
            rowIndex: i,
            name,
            designation,
            section,
            photoFilename,
            order: Number.isFinite(order) ? order : Number.POSITIVE_INFINITY, // missing/invalid order sorts last, in sheet order
        });
    });
    return { entries, rowsRead, skipped };
}

/* ---- Google Drive photos ---- */

interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    md5Checksum?: string;
    modifiedTime?: string;
    size?: string;
}

async function listChildren(auth: GoogleAuth, folderId: string): Promise<DriveFile[]> {
    const files: DriveFile[] = [];
    let pageToken = "";
    for (let page = 0; page < MAX_DRIVE_PAGES; page++) {
        const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
        const fields = encodeURIComponent("nextPageToken,files(id,name,mimeType,md5Checksum,modifiedTime,size)");
        const url =
            `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&pageSize=1000` +
            `&supportsAllDrives=true&includeItemsFromAllDrives=true` +
            (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "");
        const data = (await googleGet(auth, url)) as { files?: unknown; nextPageToken?: unknown };
        if (Array.isArray(data?.files)) {
            for (const f of data.files as Array<Record<string, unknown>>) {
                if (typeof f?.id === "string" && typeof f?.name === "string" && typeof f?.mimeType === "string") {
                    files.push({
                        id: f.id,
                        name: f.name,
                        mimeType: f.mimeType,
                        md5Checksum: typeof f.md5Checksum === "string" ? f.md5Checksum : undefined,
                        modifiedTime: typeof f.modifiedTime === "string" ? f.modifiedTime : undefined,
                        size: typeof f.size === "string" ? f.size : undefined,
                    });
                }
            }
        }
        pageToken = typeof data?.nextPageToken === "string" ? data.nextPageToken : "";
        if (!pageToken) break;
    }
    return files;
}

const isPhotosFolder = (f: DriveFile) => f.mimeType === FOLDER_TYPE && f.name.trim().toLowerCase() === PHOTOS_FOLDER_NAME;
const isUsableImage = (f: DriveFile) =>
    IMAGE_TYPES.has(f.mimeType) && (f.size === undefined || Number(f.size) <= MAX_PHOTO_BYTES);

/**
 * Finds the "Photos" folder inside the team folder and returns its image files.
 * Handles the nested layout Photos / Photos / <images>: while a folder holds no images and has exactly one
 * sub-folder also named "Photos", the reader descends into it (at most two levels).
 */
async function readPhotoFiles(auth: GoogleAuth, parentFolderId: string): Promise<DriveFile[]> {
    const topLevel = await listChildren(auth, parentFolderId);
    const photosFolders = topLevel.filter(isPhotosFolder);
    if (photosFolders.length === 0) throw new TeamDirectoryError("photos-folder-not-found");
    let folder = photosFolders[0];
    for (let depth = 0; depth < 3; depth++) {
        const children = await listChildren(auth, folder.id);
        const images = children.filter(isUsableImage);
        if (images.length > 0) return images; // images found at this level
        const nested = children.filter(isPhotosFolder);
        if (nested.length !== 1) return images; // nothing more to descend into
        folder = nested[0];
    }
    return [];
}

function photoVersion(file: DriveFile): string {
    // Changes whenever the photo is replaced, so browsers and CDNs never show an old picture.
    const raw = file.md5Checksum || (file.modifiedTime ?? "").replace(/[^0-9A-Za-z]/g, "") || "0";
    return raw.slice(0, 64);
}

function photoUrl(file: DriveFile): string {
    return `${TEAM_PHOTO_ROUTE_PREFIX}/${encodeURIComponent(file.id)}/${encodeURIComponent(photoVersion(file))}`;
}

/** Case-insensitive name lookup; if a name appears twice, the most recently modified file wins. */
function buildPhotoIndex(files: DriveFile[]): Map<string, DriveFile> {
    const index = new Map<string, DriveFile>();
    for (const f of files) {
        const key = f.name.trim().toLowerCase();
        const existing = index.get(key);
        if (!existing || (f.modifiedTime ?? "") > (existing.modifiedTime ?? "")) index.set(key, f);
    }
    return index;
}

/* ---- Built-in data (fallback, and the source for static photo paths) ---- */

const STATIC_SECTIONS: Record<TeamSectionKey, TeamMember[]> = {
    board,
    coreTeam,
    foundingTeam,
    advisoryBoard,
    doctors,
    onGroundTeam,
};

const basename = (path: string) => path.split("/").pop()?.toLowerCase() ?? "";

/** photo file name -> built-in image path, used only when Drive photos cannot be read. */
const STATIC_PHOTO_BY_FILENAME = new Map<string, string>(
    Object.values(STATIC_SECTIONS)
        .flat()
        .filter((m) => m.image)
        .map((m) => [basename(m.image as string), m.image as string])
);

/** role -> speciality, derived from the exported doctorGroups (which are built with the real lookup table). */
const SPECIALITY_BY_ROLE = new Map<string, string>();
for (const group of staticDoctorGroups) {
    if (group.speciality === OTHER_SPECIALISTS) continue;
    for (const member of group.members) SPECIALITY_BY_ROLE.set(member.role, group.speciality);
}

/** Same grouping rules as teamData.doctorGroups: alphabetical, "Other Specialists" last, unknown roles go there. */
function groupDoctors(list: TeamMember[]): DoctorGroup[] {
    const groups = new Map<string, TeamMember[]>();
    for (const doctor of list) {
        const speciality = SPECIALITY_BY_ROLE.get(doctor.role) ?? OTHER_SPECIALISTS;
        groups.set(speciality, [...(groups.get(speciality) ?? []), doctor]);
    }
    return [...groups.entries()]
        .map(([speciality, members]) => ({ speciality, members }))
        .sort((a, b) =>
            a.speciality === OTHER_SPECIALISTS ? 1 : b.speciality === OTHER_SPECIALISTS ? -1 : a.speciality.localeCompare(b.speciality)
        );
}

function buildFallback(reason: string): TeamDirectory {
    warnOnce(`Using the built-in team data. Reason: ${reason}`);
    const total = Object.values(STATIC_SECTIONS).reduce((n, list) => n + list.length, 0);
    const withPhoto = Object.values(STATIC_SECTIONS).flat().filter((m) => m.image).length;
    return {
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        board,
        coreTeam,
        foundingTeam,
        advisoryBoard,
        doctors,
        doctorGroups: staticDoctorGroups,
        onGroundTeam,
        diagnostics: {
            fallbackReason: reason,
            rowsRead: total,
            rowsShown: total,
            skipped: { incomplete: 0, unknownSection: 0, tooLong: 0, inactive: 0 },
            photos: { source: "static", matched: withPhoto, missing: 0, blank: total - withPhoto },
        },
    };
}

/* ------------------------------------------------------------------ */
/* Main entry point                                                   */
/* ------------------------------------------------------------------ */

async function loadFromGoogle(config: Config): Promise<TeamDirectory> {
    const auth = getAuth(config.keyText);

    // The Sheet and the Drive listing are read in parallel. A Drive problem does not stop the Sheet from being used.
    const [rows, drive] = await Promise.all([
        readSheetRows(auth, config.sheetId, config.tab),
        readPhotoFiles(auth, config.folderId).then(
            (files) => ({ ok: true as const, files }),
            (e: unknown) => ({ ok: false as const, issue: e instanceof TeamDirectoryError ? e.reason : "unexpected-error" })
        ),
    ]);

    const { entries, rowsRead, skipped } = parseRows(rows);
    if (entries.length === 0) throw new TeamDirectoryError("no-valid-records");

    // An incomplete or implausible read must never become the stored "last good" snapshot.
    if (!drive.ok && SNAPSHOT_REQUIRES_DRIVE_PHOTOS) throw new TeamDirectoryError(`photos-unavailable-${drive.issue}`);
    if (drive.ok && drive.files.length === 0 && entries.some((e) => e.photoFilename)) {
        throw new TeamDirectoryError("photos-folder-empty"); // rows name photos but Drive lists none: treat as a bad read
    }

    const photoIndex = drive.ok ? buildPhotoIndex(drive.files) : null;
    if (!drive.ok) warnOnce(`Drive photos unavailable (${drive.issue}); using the built-in photo files where names match.`);

    let matched = 0;
    let missing = 0;
    let blank = 0;
    const bySection: Record<TeamSectionKey, ParsedEntry[]> = {
        board: [], coreTeam: [], foundingTeam: [], advisoryBoard: [], doctors: [], onGroundTeam: [],
    };
    for (const e of entries) bySection[e.section].push(e);

    const toMembers = (list: ParsedEntry[]): TeamMember[] =>
        [...list]
            .sort((a, b) => (a.order === b.order ? a.rowIndex - b.rowIndex : a.order < b.order ? -1 : 1))
            .map((e) => {
                const member: TeamMember = { name: e.name, role: e.designation };
                if (!e.photoFilename) {
                    blank++;
                    return member;
                }
                if (photoIndex) {
                    const file = photoIndex.get(e.photoFilename.toLowerCase());
                    if (file) { member.image = photoUrl(file); matched++; } else { missing++; } // missing: initial letter
                } else {
                    const path = STATIC_PHOTO_BY_FILENAME.get(e.photoFilename.toLowerCase());
                    if (path) { member.image = path; matched++; } else { missing++; }
                }
                return member;
            });

    const result = {
        board: toMembers(bySection.board),
        coreTeam: toMembers(bySection.coreTeam),
        foundingTeam: toMembers(bySection.foundingTeam),
        advisoryBoard: toMembers(bySection.advisoryBoard),
        doctors: toMembers(bySection.doctors),
        onGroundTeam: toMembers(bySection.onGroundTeam),
    };

    return {
        source: "google",
        fetchedAt: new Date().toISOString(),
        ...result,
        doctorGroups: groupDoctors(result.doctors),
        diagnostics: {
            rowsRead,
            rowsShown: entries.length,
            skipped,
            photos: {
                source: drive.ok ? "drive" : "static",
                matched,
                missing,
                blank,
                issue: drive.ok ? undefined : drive.issue,
            },
        },
    };
}

/** Identifies WHICH Sheet / folder / tab a snapshot belongs to (never the key), so a changed setup can't reuse old data. */
function configFingerprint(config: Config): string {
    return createHash("sha256").update(`${config.sheetId}|${config.folderId}|${config.tab}`).digest("hex").slice(0, 16);
}

/**
 * The stored snapshot. Next.js keeps the result of this function in its shared Data Cache and only ever stores a
 * result when the function RETURNS one, so a failed or invalid read is never stored. When the entry is stale and
 * the page is being rebuilt, Next re-runs the function; if that throws, Next serves the previous stored snapshot
 * (the last good one) instead of failing.
 * The key includes only a hash of the Sheet/folder IDs: the credentials are never an argument or part of the key.
 */
const getCachedSnapshot = unstable_cache(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (fingerprint: string): Promise<TeamDirectory> => {
        try {
            const config = readConfig();
            if (!config) throw new TeamDirectoryError("not-configured");
            return await loadFromGoogle(config);
        } catch (e) {
            const reason = e instanceof TeamDirectoryError ? e.reason : "unexpected-error";
            warnOnce(`Google refresh failed (${reason}). The last successful snapshot is kept, if there is one.`);
            throw new TeamDirectoryError(reason); // a fresh error carrying the category only, so Next logs nothing sensitive
        }
    },
    ["our-team-directory-snapshot", SNAPSHOT_SCHEMA_VERSION],
    { revalidate: SNAPSHOT_REVALIDATE_SECONDS, tags: [TEAM_SNAPSHOT_TAG] }
);

function isUsableSnapshot(s: unknown): s is TeamDirectory {
    const t = s as Partial<TeamDirectory> | null | undefined;
    if (!t || t.source !== "google" || typeof t.fetchedAt !== "string" || !t.diagnostics) return false;
    const lists = [t.board, t.coreTeam, t.foundingTeam, t.advisoryBoard, t.doctors, t.onGroundTeam];
    if (!lists.every(Array.isArray) || !Array.isArray(t.doctorGroups)) return false;
    return lists.reduce((n, l) => n + (l as TeamMember[]).length, 0) > 0;
}

/**
 * Returns the Our Team directory. Never throws.
 *   1. Normally: the latest successful Google snapshot (re-read at most once per page rebuild).
 *   2. If Google cannot be read: the LAST SUCCESSFUL snapshot, kept in Next.js's shared Data Cache.
 *   3. Only if no successful snapshot has ever been stored: the built-in data from teamData.ts (source: "fallback").
 * Call it from server code only; combine with `export const revalidate = 300` on the page.
 */
export async function getTeamDirectory(): Promise<TeamDirectory> {
    let config: Config | null;
    try {
        config = readConfig();
    } catch (e) {
        return buildFallback(e instanceof TeamDirectoryError ? e.reason : "unexpected-error");
    }
    if (!config) return buildFallback("not-configured");

    try {
        const snapshot = await getCachedSnapshot(configFingerprint(config));
        if (!isUsableSnapshot(snapshot)) return buildFallback("invalid-snapshot");
        const ageSeconds = Math.max(0, Math.round((Date.now() - Date.parse(snapshot.fetchedAt)) / 1000));
        return { ...snapshot, diagnostics: { ...snapshot.diagnostics, snapshotAgeSeconds: ageSeconds } };
    } catch (e) {
        // No successful snapshot exists (first ever load, or it was evicted) and Google could not be read.
        return buildFallback(e instanceof TeamDirectoryError ? e.reason : "unexpected-error");
    }
}

/* ------------------------------------------------------------------ */
/* Team photos (used by the /api/team-photo/[fileId]/[version] route)  */
/* ------------------------------------------------------------------ */

export type TeamPhotoResult =
    | { status: "ok"; body: ReadableStream<Uint8Array> | Uint8Array<ArrayBuffer>; contentType: string }
    | { status: "not-found" }
    | { status: "unavailable" };

/** Tags of the shared caches below, so a later phase can refresh them on demand. */
export const TEAM_PHOTOS_TAG = "team-photos"; // the photo-folder listing
export const TEAM_PHOTO_BYTES_TAG = "team-photo-bytes"; // photo files (never change for a given file ID + fingerprint)

/** After this long the stored listing counts as stale and is re-read; the stale copy stays as the last good one. */
const PHOTO_LISTING_REVALIDATE_SECONDS = 60;
/** Bump when the shape of what is stored changes, so older stored entries are never reused. */
const PHOTO_CACHE_SCHEMA_VERSION = "v1";
/** A photo or version missing from the stored listing triggers at most one live re-listing per this many ms per instance. */
const PHOTO_RECHECK_MIN_INTERVAL_MS = 10_000;
/**
 * The Data Cache does not store entries over 2 MB and photos are stored as base64 (+33%), so only photos up to this
 * size are cached. Larger photos (up to the 5 MB limit) are streamed straight from Drive and not cached.
 */
const MAX_CACHEABLE_PHOTO_BYTES = 1_400_000;

const reasonOf = (e: unknown): string => (e instanceof TeamDirectoryError ? e.reason : "unexpected-error");
const driveMediaUrl = (fileId: string) =>
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media&supportsAllDrives=true`;

/** Passes the bytes through, but errors the stream if Drive sends more than the allowed size. */
function limitBytes(source: ReadableStream<Uint8Array>, maxBytes: number): ReadableStream<Uint8Array> {
    let total = 0;
    return source.pipeThrough(
        new TransformStream<Uint8Array, Uint8Array>({
            transform(chunk, controller) {
                total += chunk.byteLength;
                if (total > maxBytes) {
                    controller.error(new TeamDirectoryError("photo-too-large"));
                    return;
                }
                controller.enqueue(chunk);
            },
        })
    );
}

/* ---- Shared photo-folder listing ---- */

/**
 * The images in the configured Photos folder (nested Photos folder included), stored in Next.js's shared Data Cache.
 * Same last-good behaviour as the team snapshot: only a successful result is stored; when the entry is stale and
 * Google cannot be read, Next keeps serving the previous stored listing. An EMPTY listing is treated as a failed read,
 * so a glitch can never replace a good listing with nothing.
 * The key holds only the folder ID; credentials are read inside the function and are never an argument.
 */
const getCachedPhotoListing = unstable_cache(
    async (parentFolderId: string): Promise<DriveFile[]> => {
        try {
            const config = readConfig();
            if (!config || config.folderId !== parentFolderId) throw new TeamDirectoryError("not-configured");
            const files = await readPhotoFiles(getAuth(config.keyText), parentFolderId);
            if (files.length === 0) throw new TeamDirectoryError("photos-folder-empty");
            return files;
        } catch (e) {
            const reason = reasonOf(e);
            warnOnce(`Photo listing refresh failed (${reason}). The last successful listing is kept, if there is one.`);
            throw new TeamDirectoryError(reason); // category only
        }
    },
    ["team-photo-listing", PHOTO_CACHE_SCHEMA_VERSION],
    { revalidate: PHOTO_LISTING_REVALIDATE_SECONDS, tags: [TEAM_PHOTOS_TAG] }
);

/** A recent live listing, shared for a few seconds (also while it is still being fetched). Never stored in the Data Cache. */
let recentRecheck: { at: number; promise: Promise<DriveFile[] | null> } | null = null;

function liveRecheck(config: Config): Promise<DriveFile[] | null> {
    const now = Date.now();
    if (recentRecheck && now - recentRecheck.at < PHOTO_RECHECK_MIN_INTERVAL_MS) return recentRecheck.promise;
    const promise = readPhotoFiles(getAuth(config.keyText), config.folderId).then(
        (files) => files,
        () => null
    );
    recentRecheck = { at: now, promise };
    return promise;
}

/** Finds the file only if it is in the configured folder's listing AND `version` is its current fingerprint. */
async function findPhotoFile(config: Config, fileId: string, version: string): Promise<DriveFile | null> {
    const matches = (f: DriveFile) => f.id === fileId && photoVersion(f) === version;

    let listing: DriveFile[] | null = null;
    try {
        listing = await getCachedPhotoListing(config.folderId);
    } catch {
        listing = null; // Google unreadable and no stored listing yet
    }
    const hit = listing?.find(matches);
    if (hit) return hit;

    // Not in the stored listing: it may be a photo added or replaced after the listing was taken. Look live, rate-limited.
    const live = await liveRecheck(config);
    const liveHit = live?.find(matches);
    if (liveHit) return liveHit;
    if (listing === null && live === null) throw new TeamDirectoryError("listing-unavailable");
    return null;
}

/* ---- Shared photo bytes ---- */

/**
 * One photo's bytes, stored in the shared Data Cache under (file ID + fingerprint), with no expiry: a given
 * fingerprint always means the same content, so an unchanged photo is downloaded from Drive once and then reused.
 * A replaced photo has a new fingerprint, hence a new key and a fresh download. Only called after the file has been
 * confirmed to be in the configured folder, so arbitrary IDs can never fill the cache.
 * A failed, oversized or inconsistent download throws and is therefore never stored.
 */
const getCachedPhotoBytes = unstable_cache(
    async (fileId: string, version: string): Promise<{ data: string }> => {
        try {
            const config = readConfig();
            if (!config) throw new TeamDirectoryError("not-configured");
            const res = await googleFetch(getAuth(config.keyText), driveMediaUrl(fileId));
            const declared = Number(res.headers.get("content-length"));
            if (Number.isFinite(declared) && declared > MAX_CACHEABLE_PHOTO_BYTES) throw new TeamDirectoryError("photo-too-large");
            if (!res.body) throw new TeamDirectoryError("invalid-response");
            const bytes = new Uint8Array(await new Response(limitBytes(res.body, MAX_CACHEABLE_PHOTO_BYTES)).arrayBuffer());
            // The version is the file's md5. If the downloaded bytes do not match it, the photo changed after it was
            // listed: never store them under the old key.
            if (/^[0-9a-f]{32}$/.test(version) && createHash("md5").update(bytes).digest("hex") !== version) {
                throw new TeamDirectoryError("photo-changed");
            }
            return { data: Buffer.from(bytes).toString("base64") };
        } catch (e) {
            throw new TeamDirectoryError(reasonOf(e)); // category only
        }
    },
    ["team-photo-bytes", PHOTO_CACHE_SCHEMA_VERSION],
    { revalidate: false, tags: [TEAM_PHOTO_BYTES_TAG] }
);

/** Concurrent requests for the same photo on one instance share a single lookup/download. */
const photoLookups = new Map<string, Promise<Uint8Array<ArrayBuffer>>>();

function getSharedPhotoBytes(fileId: string, version: string): Promise<Uint8Array<ArrayBuffer>> {
    const key = `${fileId}:${version}`;
    const existing = photoLookups.get(key);
    if (existing) return existing;
    const promise = getCachedPhotoBytes(fileId, version)
        .then((r) => new Uint8Array(Buffer.from(r.data, "base64")))
        .finally(() => photoLookups.delete(key));
    photoLookups.set(key, promise);
    return promise;
}

/**
 * Opens one team photo for the photo route. The file is served ONLY if it is currently an image (JPEG, PNG or WebP,
 * at most 5 MB) inside the configured Photos folder AND `version` equals its current content fingerprint.
 * Anything else is "not-found". Problems with Google are "unavailable". No detail is ever returned to the caller.
 */
export async function getTeamPhoto(fileId: string, version: string): Promise<TeamPhotoResult> {
    try {
        const config = readConfig();
        if (!config) return { status: "unavailable" };

        const file = await findPhotoFile(config, fileId, version);
        if (!file) return { status: "not-found" };

        // Defence in depth: the listing already keeps only these.
        if (!IMAGE_TYPES.has(file.mimeType)) return { status: "not-found" };
        if (file.size !== undefined && Number(file.size) > MAX_PHOTO_BYTES) return { status: "not-found" };

        // Normal case: small photos come from (and go into) the shared photo cache.
        if (file.size !== undefined && Number(file.size) <= MAX_CACHEABLE_PHOTO_BYTES) {
            const body = await getSharedPhotoBytes(file.id, photoVersion(file));
            return { status: "ok", body, contentType: file.mimeType };
        }

        // Larger photos (up to 5 MB) are streamed straight from Drive and not cached.
        const res = await googleFetch(getAuth(config.keyText), driveMediaUrl(file.id));
        const declared = Number(res.headers.get("content-length"));
        if (Number.isFinite(declared) && declared > MAX_PHOTO_BYTES) return { status: "unavailable" };
        if (!res.body) return { status: "unavailable" };
        return { status: "ok", body: limitBytes(res.body, MAX_PHOTO_BYTES), contentType: file.mimeType };
    } catch (e) {
        const reason = reasonOf(e);
        if (reason === "http-404") return { status: "not-found" };
        warnOnce(`Team photo unavailable (${reason}).`);
        return { status: "unavailable" };
    }
}
