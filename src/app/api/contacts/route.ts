// src/app/api/contacts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db }                       from "@/lib/db.server";
import { likes, profiles, users }   from "@/lib/db/schema";
import { auth }                     from "@/lib/auth.server";
import { eq, inArray }              from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = session.user.id;

  // 1) IDs I have liked
  const likedByMe = (await db
    .select({ id: likes.likedId })
    .from(likes)
    .where(eq(likes.likerId, me))
  ).map((row) => row.id);

  // 2) IDs who have liked me
  const likedMe = (await db
    .select({ id: likes.likerId })
    .from(likes)
    .where(eq(likes.likedId, me))
  ).map((row) => row.id);

  // 3) intersection = mutual likes
  const mutualIds = likedByMe.filter((id) => likedMe.includes(id));
  if (mutualIds.length === 0) {
    return NextResponse.json([]);
  }

  // 4) fetch those users’ profiles + emails
  const mutual = await db
    .select({
      id:                profiles.id,
      name:              profiles.name,
      email:             users.email,
      age:               profiles.age,
      gender:            profiles.gender,
      role:              profiles.role,
      cleanlinessLevel:  profiles.cleanlinessLevel,
      sleepTime:         profiles.sleepTime,
      noiseTolerance:    profiles.noiseTolerance,
      location:          profiles.location,
    })
    .from(profiles)
    .innerJoin(users, eq(users.id, profiles.userId))
    .where(inArray(profiles.userId, mutualIds));

  return NextResponse.json(mutual);
}