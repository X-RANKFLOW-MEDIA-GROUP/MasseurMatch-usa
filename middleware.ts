// middleware.ts - SEO & Security Control
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ====================================
// BLOCKED COUNTRIES (ISO 3166-1 alpha-2)
// ====================================
// Reasons: Anti-LGBTQ+ laws, US sanctions, high fraud/trafficking risk
const BLOCKED_COUNTRIES = new Set([
  // Severe anti-LGBTQ+ laws (death penalty or life imprisonment)
  "IR", // Iran
  "SA", // Saudi Arabia
  "AF", // Afghanistan
  "BN", // Brunei
  "NG", // Nigeria (northern states)
  "MR", // Mauritania
  "YE", // Yemen
  "SO", // Somalia
  "SD", // Sudan
  "UG", // Uganda
  // US Sanctions
  "RU", // Russia
  "KP", // North Korea
  "CU", // Cuba
  "SY", // Syria
  // High trafficking/fraud risk
  "MM", // Myanmar
]);

const NOINDEX_ROUTES = [
  "/login",
  "/join/form",
  "/recuperar",
  "/dashboard",
  "/edit-profile",
  "/pending",
  "/checkout",
  "/admin",
];

const LEGAL_REDIRECTS: Record<string, string> = {
  "/terms": "/legal/terms",
  "/privacy-policy": "/legal/privacy-policy",
  "/community-guidelines": "/legal/community-guidelines",
  "/cookie-policy": "/legal/cookie-policy",
  "/professional-standards": "/legal/professional-standards",
  "/anti-trafficking": "/legal/anti-trafficking",
};

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

export function middleware(req: NextRequest) {
  const pathname = normalizePath(req.nextUrl.pathname);

  // ====================================
  // GEO-BLOCKING (Country Restriction)
  // ====================================
  // Skip geo-blocking for the blocked page itself to avoid redirect loop
  if (pathname !== "/blocked") {
    // Vercel automatically provides country code via x-vercel-ip-country header
    const country = req.headers.get("x-vercel-ip-country") || req.geo?.country;

    if (country && BLOCKED_COUNTRIES.has(country)) {
      const blockedUrl = req.nextUrl.clone();
      blockedUrl.pathname = "/blocked";
      return NextResponse.rewrite(blockedUrl);
    }
  }

  // ====================================
  // BYPASS WAITLIST (Vercel rewrites)
  // ====================================
  // IMPORTANT: This must be before any redirects/headers logic
  if (pathname === "/waitlist" || pathname.startsWith("/waitlist/")) {
    return NextResponse.next();
  }

  // ====================================
  // 301 REDIRECTS - Legal Pages Migration
  // ====================================
  const legalTarget = LEGAL_REDIRECTS[pathname];
  if (legalTarget) {
    const newUrl = req.nextUrl.clone();
    newUrl.pathname = legalTarget;
    return NextResponse.redirect(newUrl, 301);
  }

  // ====================================
  // FORCE WWW (SEO Best Practice) - proxy-safe
  // ====================================
  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = forwardedHost ?? req.headers.get("host");

  if (
    host &&
    !host.startsWith("www.") &&
    !host.includes("localhost") &&
    !host.includes("vercel.app")
  ) {
    const newUrl = req.nextUrl.clone();
    newUrl.host = `www.${host}`;
    return NextResponse.redirect(newUrl, 301);
  }

  // ====================================
  // RESPONSE (headers)
  // ====================================
  const res = NextResponse.next();

  // ====================================
  // NOINDEX ROUTES (Private/User Areas)
  // ====================================
  if (NOINDEX_ROUTES.some((route) => pathname.startsWith(route))) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // ====================================
  // SECURITY HEADERS
  // ====================================
  // Prevent clickjacking
  res.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.headers.set("X-Content-Type-Options", "nosniff");

  // Referrer Policy
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // HSTS (only meaningful on HTTPS; safe to set in production)
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Permissions Policy (hardening)
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  // Basic CSP (adjust if you use external scripts like Stripe/GTM etc.)
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "img-src 'self' data: https:",
      "font-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self' https:",
      "upgrade-insecure-requests",
    ].join("; ")
  );

  return res;
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
     * - robots.txt / sitemap.xml (SEO files)
     * - common static assets
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
