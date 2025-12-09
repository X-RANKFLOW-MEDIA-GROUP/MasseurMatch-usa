// middleware.ts - SEO & Security Control
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ====================================
  // NOINDEX ROUTES (Private/User Areas)
  // ====================================
  const noindexRoutes = [
    "/login",
    "/join/form",
    "/recuperar",
    "/dashboard",
    "/edit-profile",
    "/pending",
    "/checkout",
    "/admin"
  ];

  if (noindexRoutes.some(route => pathname.startsWith(route))) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  // ====================================
  // FORCE WWW (SEO Best Practice)
  // ====================================
  const host = req.headers.get("host");

  if (host && !host.startsWith("www.") && !host.includes("localhost") && !host.includes("vercel.app")) {
    const newUrl = new URL(req.url);
    newUrl.host = `www.${host}`;
    return NextResponse.redirect(newUrl, 301); // Permanent redirect
  }

  // ====================================
  // SECURITY HEADERS
  // ====================================
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // XSS Protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

// ====================================
// MATCHER - Routes to apply middleware
// ====================================
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
