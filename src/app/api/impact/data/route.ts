import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { impactData } from "@/data/impactData";

import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    // 1. Attempt to fetch live metrics from Firebase Firestore
    try {
      const docSnap = await getFirebaseAdminDb().collection("impact_store").doc("latest").get();
      if (docSnap.exists) {
        return NextResponse.json({
          success: true,
          source: "firebase_firestore",
          data: docSnap.data()
        });
      }
    } catch (fbError) {
      console.warn("[Firebase API Warning] Firestore lookup fallback to local store:", fbError);
    }

    // 2. Fallback to local JSON file store
    const storePath = path.join(process.cwd(), "src", "data", "liveImpactStore.json");
    if (fs.existsSync(storePath)) {
      const raw = fs.readFileSync(storePath, "utf-8");
      const liveData = JSON.parse(raw);
      return NextResponse.json({
        success: true,
        source: "live_agent_pipeline",
        data: liveData
      });
    }

    return NextResponse.json({
      success: true,
      source: "fallback_static",
      data: impactData
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch impact data"
    }, { status: 500 });
  }
}
