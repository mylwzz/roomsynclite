// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse }     from "next/server";
import { auth }             from "@/lib/auth.server";
import { db }               from "@/lib/db.server";
import { users }            from "@/lib/db/schema";
import { eq }               from "drizzle-orm";

const protectedPaths = ["/onboarding", "/browse", "/contacts"];
const adminPaths     = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth  = protectedPaths.some((p) => pathname.startsWith(p));
  const needsAdmin = adminPaths.some((p)     => pathname.startsWith(p));
  let session = null;
  if (needsAuth || needsAdmin) {
    session = await auth.api.getSession({ headers: req.headers });
  }

  if (needsAuth && !session?.user?.id) {
    const login = new URL("/", req.url);
    login.searchParams.set("redirect", pathname);
    return NextResponse.redirect(login);
  }

  if (pathname === "/" && session?.user?.id) {
    return NextResponse.redirect(new URL("/browse", req.url));
  }

  if (needsAdmin) {
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/browse", req.url));
    }
    const me = await db.query.users.findFirst({
      where: (u) => eq(u.id, session.user.id),
    });
    if (me?.role !== "admin") {
      return NextResponse.redirect(new URL("/browse", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|assets|images).*)"],
};