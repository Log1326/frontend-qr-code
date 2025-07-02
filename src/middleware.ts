import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const { pathname } = req.nextUrl;

  const publicPaths = ['/auth'];

  if (publicPaths.includes(pathname)) return NextResponse.next();

  if (!token)
    return NextResponse.redirect(new URL('/auth?mode=login', req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth|api).*)'],
};
