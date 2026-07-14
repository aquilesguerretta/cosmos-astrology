import { NextResponse, type NextRequest } from "next/server";

// Edge-safe gate: no DB/NextAuth imports here. Demo mode (no AUTH_SECRET +
// DATABASE_URL) leaves all routes open so the app is fully navigable.
const AUTH_ENABLED = Boolean(process.env.AUTH_SECRET && process.env.DATABASE_URL);

export function middleware(req: NextRequest) {
  if (!AUTH_ENABLED) return NextResponse.next();

  const hasSession =
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token");

  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sanctum/:path*",
    "/chart/:path*",
    "/reading/:path*",
    "/tarot/:path*",
    "/synastry/:path*",
    "/library/:path*",
    "/learn/:path*",
    "/profile/:path*",
  ],
};
