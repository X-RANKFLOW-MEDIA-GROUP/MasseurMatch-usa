// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL("https://waitlist-zeta-tan.vercel.app/");

  // Se quiser manter a rota original como query param (opcional)
  url.searchParams.set("from", req.nextUrl.href);

  return NextResponse.redirect(url, 307); // 307 = redirecionamento temporário
}

// Faz o middleware rodar em todas as rotas
export const config = {
  matcher: "/:path*",
};
