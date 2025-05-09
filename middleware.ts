// src/middleware.ts         
import type { NextRequest } from "next/server";
import { NextResponse }     from "next/server";

import { auth }             from "@/lib/auth";
import { db }               from "@/lib/db";
import { users }            from "@/lib/db/schema";
import { eq }               from "drizzle-orm";

const SESSION_COOKIE = "better-auth.session_token";

/* pages that require a signed-in user */
const protectedPaths = ["/onboarding", "/browse", "/contacts"];
/* pages that require an *admin* */
const adminPaths     = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* quick checks that don’t need a DB hit */
  const needsAuth  = protectedPaths.some((p) => pathname.startsWith(p));
  const needsAdmin = adminPaths.some((p)     => pathname.startsWith(p));
  const hasCookie  = Boolean(req.cookies.get(SESSION_COOKIE));

  /* ── 1. private page while NOT logged-in ───────────────── */
  if (needsAuth && !hasCookie) {
    const login = new URL("/", req.url);
    login.searchParams.set("redirect", pathname);
    return NextResponse.redirect(login);
  }

  /* ── 2. hitting “/” while already logged-in ────────────── */
  if (pathname === "/" && hasCookie) {
    return NextResponse.redirect(new URL("/browse", req.url));
  }


  if (needsAdmin) {
    const session = await auth.api.getSession({ headers: req.headers });
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
  /* run on every request except static assets */
  matcher: ["/((?!_next|favicon.ico|assets|images).*)"],
};