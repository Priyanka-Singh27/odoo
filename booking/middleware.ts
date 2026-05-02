import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

// Routes accessible without any auth
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/verify-otp',
  '/forgot-password',
  '/public-booking',
  '/organizer/login',
  '/admin/login',
];

// After login, redirect to these dashboards based on role
const ROLE_DASHBOARDS: Record<string, string> = {
  customer: '/home',
  organiser: '/organizer/appointments',
  admin: '/admin/dashboard',
};

// Routes that require a specific role
const ROLE_PROTECTED: { prefix: string; role: string }[] = [
  { prefix: '/organizer', role: 'organiser' },
  { prefix: '/admin', role: 'admin' },
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth_token')?.value;
  const payload = token ? verifyToken(token) : null;

  // Always allow public-booking routes (share links)
  if (pathname.startsWith('/public-booking')) {
    return NextResponse.next();
  }

  // Check if this is a public route
  const isPublic = PUBLIC_ROUTES.some(r => pathname === r || (r !== '/' && pathname.startsWith(r)));

  // If NOT logged in and hitting a protected route → redirect to login
  if (!payload && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If logged in and hitting a login/signup page → redirect to their dashboard
  const isAuthPage = ['/login', '/signup', '/verify-otp', '/organizer/login', '/admin/login'].some(
    r => pathname === r || pathname.startsWith(r)
  );
  if (payload && isAuthPage) {
    const dashboard = ROLE_DASHBOARDS[payload.role] || '/home';
    return NextResponse.redirect(new URL(dashboard, req.url));
  }

  // If logged in, enforce role-based access for protected areas
  if (payload) {
    for (const { prefix, role } of ROLE_PROTECTED) {
      if (pathname.startsWith(prefix) && payload.role !== role) {
        // Wrong role for this section → send them to their own dashboard
        const dashboard = ROLE_DASHBOARDS[payload.role] || '/home';
        return NextResponse.redirect(new URL(dashboard, req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
