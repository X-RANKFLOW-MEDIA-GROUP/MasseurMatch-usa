import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "www.masseurmatch.com";
const WRONG_HOSTS = new Set(["masseurmatch.com", "masseurmatch.vercel.app"]);

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // 🔹 Não faz NADA em desenvolvimento / localhost
  if (
    process.env.NODE_ENV !== "production" ||
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1"
  ) {
    return NextResponse.next();
  }

  const isWrongHost = WRONG_HOSTS.has(url.hostname);
  const isHttp = url.protocol === "http:";

  // 🔹 Força sempre https + host canônico em produção
  if (isWrongHost || isHttp) {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";

    // Evita redirect em loop para a MESMA URL
    if (
      url.hostname === req.nextUrl.hostname &&
      url.pathname === req.nextUrl.pathname &&
      url.search === req.nextUrl.search
    ) {
      return NextResponse.next();
    }

    return NextResponse.redirect(url, 308);
  }

  // 🔹 Resposta normal + headers extras
  const res = NextResponse.next();

  // canonical header
  res.headers.set(
    "x-canonical-url",
    `https://${CANONICAL_HOST}${url.pathname}`
  );

  // AI-blockers
  res.headers.set("X-Robots-Tag", "noai, noimageai");

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
