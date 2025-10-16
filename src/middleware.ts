import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Define paths that are public and don't require authentication
  const publicPaths = ["/login", "/register", "/"];

  // Check if the current path is a public path
  const isPublicPath = publicPaths.includes(pathname);

  // If the user is logged in (has a token)
  if (token) {
    // If they are on a public path, redirect to the home page
    if (isPublicPath) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
  // If the user is NOT logged in (no token)
  else {
    // And they are trying to access a non-public (protected) path
    if (!isPublicPath) {
      // Redirect them to the login page
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // If none of the above conditions are met, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
