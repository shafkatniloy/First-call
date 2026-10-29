import { NextRequest, NextResponse } from "next/server";
import { recordBurn } from "@/lib/db/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, brandId, brandName, draws, durationSeconds } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ success: false, error: "Username is required" }, { status: 400 });
    }

    const result = await recordBurn({
      name,
      brandId: brandId || "unknown",
      brandName: brandName || "Cigarette",
      draws: typeof draws === "number" ? draws : 6,
      durationSeconds: typeof durationSeconds === "number" ? durationSeconds : 0,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

