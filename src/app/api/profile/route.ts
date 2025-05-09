// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db.server";
import { auth } from "@/lib/auth.server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // prevent double‑submit
  const existing = await db.query.profiles.findFirst({
    where: (p) => eq(p.userId, session.user.id),
  });
  if (existing) {
    return NextResponse.json({ error: "Profile already exists" }, { status: 409 });
  }

  const body = await req.json();
  await db.insert(schema.profiles).values({
    userId:           session.user.id,
    name:             body.name,
    age:              Number(body.age),
    gender:           body.gender,
    lookingFor:       body.lookingFor,
    role:             body.role,
    interests:        body.interests,
    cleanlinessLevel: Number(body.cleanlinessLevel),
    noiseTolerance:   Number(body.noiseTolerance),
    sleepTime:        body.sleepTime,
    wakeTime:         body.wakeTime,
    hasPets:          body.hasPets === "true",
    bio:              body.bio,
    location:         body.location,
  });

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await db.query.profiles.findFirst({
    where: (p) => eq(p.userId, session.user.id),
  });
  // strip Dates / converter issues
  const profile = raw ? JSON.parse(JSON.stringify(raw)) : null;
  return NextResponse.json(profile);
}