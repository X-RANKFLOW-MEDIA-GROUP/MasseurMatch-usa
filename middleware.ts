import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "www.masseurmatch.com";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const isWrongHost =
    url.hostname === "masseurmatch.com" || url.hostname === "masseurmatch.vercel.app";

  const isHttp = url.protocol === "http:";

  if (isWrongHost || isHttp) {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  const res = NextResponse.next();
  res.headers.set("x-canonical-url", `https://${CANONICAL_HOST}${url.pathname}`);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"]
};
