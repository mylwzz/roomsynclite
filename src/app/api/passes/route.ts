// src/app/api/passes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db.server";
import { auth } from "@/lib/auth.server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = session.user.id;
  const { passedId } = await req.json();
  if (!passedId || passedId === me) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  await db
    .insert(schema.passes)
    .values({ passerId: me, passedId })
    .onConflictDoNothing();

  return NextResponse.json({ success: true });
}