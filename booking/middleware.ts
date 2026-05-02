import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const PUBLIC_ROUTES = ['/login', '/signup', '/verify-otp', '/forgot-password', '/home', '/public-booking'];

const ROLE_REDIRECTS: Record<string, string> = {
  customer: '/home',
  organiser: '/organiser/appointments',
  admin: '/admin/dashboard',
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth_token')?.value;
  const payload = token ? verifyToken(token) : null;

  // Allow public public-booking routes
  if (pathname.startsWith('/public-booking')) {
    return NextResponse.next();
  }

  // If logged in and hitting a public route or root → redirect to dashboard
  if (payload && (pathname === '/' || PUBLIC_ROUTES.some(r => pathname.startsWith(r)))) {
    return NextResponse.redirect(new URL(ROLE_REDIRECTS[payload.role] || '/home', req.url));
  }

  // Always allow RBAC landing page for non-authenticated users
  if (pathname === '/') {
    return NextResponse.next();
  }

  // If not logged in and hitting a protected route → redirect to login
  if (!payload && !PUBLIC_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
