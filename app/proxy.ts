import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "www.masseurmatch.com";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const wrongHosts = [
    "masseurmatch.com",
    "masseurmatch.vercel.app"
  ];

  if (wrongHosts.includes(url.hostname) || url.protocol === "http:") {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  const res = NextResponse.next();

  // canonical header
  res.headers.set("x-canonical-url", `https://${CANONICAL_HOST}${url.pathname}`);

  // AI-blockers
  res.headers.set("X-Robots-Tag", "noai, noimageai");

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
