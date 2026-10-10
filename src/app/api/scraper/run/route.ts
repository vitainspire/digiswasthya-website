import { NextResponse } from "next/server";
import { execFile } from "child_process";
import { timingSafeEqual } from "crypto";
import path from "path";
import util from "util";

const execFilePromise = util.promisify(execFile);

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // The report URL comes only from server config, never from the request.
  const reportUrl = process.env.DIGISWASTHYA_PORTAL_URL || "public/sample-report.html";
  const scriptPath = path.join(process.cwd(), "src", "scripts", "agents", "pipeline.py");

  try {
    const { stdout, stderr } = await execFilePromise("python", [scriptPath, reportUrl], { cwd: process.cwd() });
    return NextResponse.json({
      success: true,
      message: "Agent Scraper Pipeline executed successfully!",
      logs: stdout,
      errors: stderr || null
    });
  } catch (error) {
    console.error("[Agent Pipeline API Error]:", error);
    return NextResponse.json({ success: false, message: "Failed to execute Agent Scraper Pipeline" }, { status: 500 });
  }
}
