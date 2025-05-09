// src/app/api/passes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db }                        from "@/lib/db";
import { passes }                    from "@/lib/db/schema";
import { auth }                      from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const passerId = session.user.id;
  const { passedId } = await req.json();

  if (!passedId || passedId === passerId) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  await db
    .insert(passes)
    .values({ passerId, passedId })
    .onConflictDoNothing();

  return NextResponse.json({ success: true });
}