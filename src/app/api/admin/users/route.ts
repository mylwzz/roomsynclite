// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db.server";
import { auth } from "@/lib/auth.server";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: new Headers(req.headers) });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // fetch real role
  const me = await db.query.users.findFirst({
    where: (u) => eq(u.id, session.user.id),
  });
  if (me?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const users = await db
      .select({
        userId:   schema.users.id,
        email:    schema.users.email,
        name:     schema.profiles.name,
        age:      schema.profiles.age,
        gender:   schema.profiles.gender,
        role:     schema.profiles.role,
        location: schema.profiles.location,
      })
      .from(schema.users)
      .leftJoin(schema.profiles, eq(schema.profiles.userId, schema.users.id));

    return NextResponse.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}