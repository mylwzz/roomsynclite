// src/app/api/matches/route.ts
import { NextResponse }               from "next/server";
import { headers }                    from "next/headers";
import { db, schema }                 from "@/lib/db.server";
import { auth }                       from "@/lib/auth.server";
import { eq, ne, and, isNull, sql }   from "drizzle-orm";
import { calculateCompatibilityScore } from "@/lib/utils";

export async function GET() {
  const cookie  = (await headers()).get("cookie") ?? "";
  const session = await auth.api.getSession({
    headers: new Headers([["cookie", cookie]]),
  });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = session.user.id;

  const my = await db.query.profiles.findFirst({
    where: (p) => eq(p.userId, me),
  });
  if (!my) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const wantRole =
    my.role === "looking"  ? "offering" :
    my.role === "offering" ? "looking"  :
    undefined;

  const rows = await db
    .select({
      profile: schema.profiles,
      userId:  schema.profiles.userId,      // <-- grab the actual user.id here
    })
    .from(schema.profiles)
    .leftJoin(schema.likes, and(
      eq(schema.likes.likerId, me),
      eq(schema.likes.likedId, schema.profiles.userId),
    ))
    .leftJoin(schema.passes, and(
      eq(schema.passes.passerId, me),
      eq(schema.passes.passedId, schema.profiles.userId),
    ))
    .where(and(
      ne(schema.profiles.userId, me),
      wantRole ? eq(schema.profiles.role, wantRole) : sql`TRUE`,
      isNull(schema.likes.id),
      isNull(schema.passes.id),
    ));

  const out = rows.map(({ profile, userId }) => ({
    // spread in all profile fields,
    // but critically _use_ userId as the record's id for liking/passing
    id:                 userId,
    name:               profile.name,
    age:                profile.age,
    gender:             profile.gender,
    role:               profile.role,
    interests:          profile.interests,
    cleanlinessLevel:   profile.cleanlinessLevel,
    noiseTolerance:     profile.noiseTolerance,
    sleepTime:          profile.sleepTime,
    wakeTime:           profile.wakeTime,
    hasPets:            profile.hasPets,
    bio:                profile.bio,
    location:           profile.location,
    compatibilityScore: calculateCompatibilityScore(my, profile),
  }));

  return NextResponse.json(out);
}