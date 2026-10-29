import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const userNameParam = searchParams.get("userName");

    const limit = limitParam ? Math.min(1000, Math.max(1, parseInt(limitParam, 10))) : 1000;
    const leaderboard = getLeaderboard(limit, userNameParam || undefined);

    return NextResponse.json({
      success: true,
      topUsers: leaderboard.topUsers,
      currentUser: leaderboard.currentUser,
      totalUsers: leaderboard.totalUsers,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

