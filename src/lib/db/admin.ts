import { auth } from "@/lib/auth.server";
import { db }   from "@/lib/db.server";
import { eq }   from "drizzle-orm";

export async function requireAdmin(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return false;

  const u = await db.query.users.findFirst({
    where: (u) => eq(u.id, session.user.id),
  });
  return u?.role === "admin";
}