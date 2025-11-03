import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected and auth routes
const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

// middleware function to protect routes
export function middleware(request: NextRequest) {
  const { pathname } = request?.nextUrl;

  // get the auth token from cookie
  const token = request?.cookies?.get("auth-token")?.value;
  const isAuthenticated = !!token;

  // check whether the current route is protected
  const isProtectedRoute = protectedRoutes?.some((route) =>
    pathname?.startsWith(route)
  );

  // redirect to login page
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request?.url));
  }

  // if not protected route, then check whether the current route is an auth route (login/register)
  const isAuthRoute = authRoutes?.some((route) => pathname?.startsWith(route));

  // redirect to dashboard page
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request?.url));
  }

  return NextResponse.next();
}

// configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
