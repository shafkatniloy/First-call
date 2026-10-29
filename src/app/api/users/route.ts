import { NextRequest, NextResponse } from "next/server";
import { findUser, findUserById, createUser } from "@/lib/db/database";
import { validateUsername } from "@/lib/validation/username";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const id = searchParams.get("id");

  if (!name && !id) {
    return NextResponse.json({ error: "Name or Id query parameter required" }, { status: 400 });
  }

  const user = id ? await findUserById(id) : await findUser(name!);
  return NextResponse.json({
    exists: !!user,
    user: user
      ? {
          id: user.id,
          name: user.name,
          totalBurnt: user.totalBurnt,
          createdAt: user.createdAt,
        }
      : null,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body?.name;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ success: false, error: "নাম দেওয়া বাধ্যতামূলক" }, { status: 400 });
    }

    const validation = validateUsername(name);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const result = await createUser(name);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      isReturning: result.isReturning ?? false,
      message: result.message,
      user: {
        id: result.user!.id,
        name: result.user!.name,
        totalBurnt: result.user!.totalBurnt,
        createdAt: result.user!.createdAt,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

