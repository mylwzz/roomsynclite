// src/app/api/signout/route.ts
import { auth } from "@/lib/auth.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await auth.api.signOut({ headers: req.headers }); 
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}