import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;

  const { pathname } = req.nextUrl;
  if (pathname === '/login' || pathname === '/register')
    return NextResponse.next();

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|register).*)'],
};
