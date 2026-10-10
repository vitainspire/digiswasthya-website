const WINDOW_MS = 10 * 60 * 1000;

// Best-effort only: each serverless instance keeps its own counters.
const hits = new Map<string, number[]>();

export function clientIp(req: Request): string {
    return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

export function rateLimited(key: string, limit = 5): boolean {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
    recent.push(now);
    hits.set(key, recent);
    return recent.length > limit;
}
