import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!process.env.NEXTAUTH_URL) {
    console.error(
      "NEXTAUTH_URL environment variable is not set. Defaulting to http://localhost:3000"
    );
  }

  // Public pages (no login required)
  const publicPaths = ["/login", "/register"];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Allow Next.js internals (static files, _next, favicon)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Logged in users visiting public pages → redirect to dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Unauthenticated users visiting protected pages → redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
