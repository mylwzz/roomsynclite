import { auth } from "@/lib/auth";
import { db }   from "@/lib/db";
import { eq }   from "drizzle-orm";

export async function requireAdmin(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return false;

  const u = await db.query.users.findFirst({
    where: (u) => eq(u.id, session.user.id),
  });
  return u?.role === "admin";
}