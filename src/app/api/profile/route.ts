// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { auth }       from "@/lib/auth";
import { eq }         from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await db.query.profiles.findFirst({
    where: (p) => eq(p.userId, session.user.id),
  });
  if (existing) {
    return NextResponse.json({ error: "Profile already exists" }, { status: 409 });
  }

  const body = await req.json();
  await db.insert(schema.profiles).values({
    userId: session.user.id,
    ...body,
    age:              Number(body.age),
    cleanlinessLevel: Number(body.cleanlinessLevel),
    noiseTolerance:   Number(body.noiseTolerance),
    hasPets:          body.hasPets === "true",
  });

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.profiles.findFirst({
    where: (p) => eq(p.userId, session.user.id),
  });

  return NextResponse.json(profile);
}
