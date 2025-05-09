// src/app/api/contacts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db }                      from "@/lib/db";
import { likes, profiles, users }  from "@/lib/db/schema";
import { auth }          from "@/lib/auth";
import { eq }            from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = session.user.id;

  const mine = db
    .select({ id: likes.likedId })
    .from(likes)
    .where(eq(likes.likerId, me))
    .as("mine");

  const mutual = await db
    .select({
      id:      profiles.id,
      name:    profiles.name,
      email:   users.email,
      age:     profiles.age,
      gender:  profiles.gender,
      role:    profiles.role,
      cleanlinessLevel: profiles.cleanlinessLevel,
      sleepTime:        profiles.sleepTime,
      noiseTolerance:   profiles.noiseTolerance,
      location:         profiles.location,
    })
    .from(likes)
    .innerJoin(mine,       eq(likes.likerId, mine.id))
    .innerJoin(profiles,   eq(profiles.userId, likes.likedId))
    .innerJoin(users,      eq(users.id, profiles.userId))
    .where(eq(likes.likedId, me));

  return NextResponse.json(mutual);
}
