// src/app/api/admin/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db.server";
import { auth } from "@/lib/auth.server";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await auth.api.getSession({ headers: req.headers });
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

  const { userId } = params;
  const body = await req.json();

  try {
    await db
      .update(schema.profiles)
      .set({
        name:     body.name,
        age:      Number(body.age),
        role:     body.role,
        location: body.location,
      })
      .where(eq(schema.profiles.userId, userId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`Error updating ${userId}`, err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await auth.api.getSession({ headers: req.headers });
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
    await db.delete(schema.users).where(eq(schema.users.id, params.userId));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`Error deleting ${params.userId}`, err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}