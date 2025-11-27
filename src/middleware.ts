// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicPath =
    pathname.startsWith('/login') ||
    pathname.startsWith('/join') ||
    pathname.startsWith('/api/public') ||
    pathname === '/' ; // se quiser deixar home pública

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Exemplo de cookie de auth (ajuste o nome pro seu)
  const token = req.cookies.get('mm_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // NÃO rodar middleware em arquivos estáticos
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
