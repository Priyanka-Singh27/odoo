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

// Which login page belongs to which role
const LOGIN_PAGE_ROLE: Record<string, string> = {
  '/login': 'customer',
  '/organizer/login': 'organiser',
  '/admin/login': 'admin',
};

// Routes that require specific role(s)
const ROLE_PROTECTED: { prefix: string; roles: string[] }[] = [
  { prefix: '/organizer', roles: ['organiser', 'admin'] },
  { prefix: '/admin', roles: ['admin'] },
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth_token')?.value;
  const payload = token ? await verifyToken(token) : null;

  console.log(`[middleware] pathname=${pathname} hasToken=${!!token} role=${payload?.role ?? 'none'}`);

  // Always allow public-booking routes (share links)
  if (pathname.startsWith('/public-booking')) {
    return NextResponse.next();
  }

  // Check if this is a public route
  const isPublic = PUBLIC_ROUTES.some(r => pathname === r || (r !== '/' && pathname.startsWith(r)));

  // If NOT logged in and hitting a protected route → redirect to login
  if (!payload && !isPublic) {
    console.log(`[middleware] → not authenticated → redirect to /login`);
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If logged in and hitting a login/signup page:
  const isAuthPage = ['/login', '/signup', '/verify-otp', '/organizer/login', '/admin/login'].some(
    r => pathname === r || pathname.startsWith(r)
  );

  if (payload && isAuthPage) {
    // Check if user is trying to access a login page for a DIFFERENT role → clear cookie so they can switch
    const targetRole = LOGIN_PAGE_ROLE[pathname];
    if (targetRole && targetRole !== payload.role) {
      console.log(`[middleware] → switching portal: clearing session (current=${payload.role}, target=${targetRole})`);
      const response = NextResponse.next();
      response.cookies.delete('auth_token');
      return response;
    }

    // Same role login page → redirect to their dashboard
    const dashboard = ROLE_DASHBOARDS[payload.role] || '/home';
    console.log(`[middleware] → already logged in as ${payload.role} → redirect to ${dashboard}`);
    return NextResponse.redirect(new URL(dashboard, req.url));
  }

  // If logged in, enforce role-based access for protected areas
  if (payload) {
    for (const { prefix, roles } of ROLE_PROTECTED) {
      if (pathname.startsWith(prefix) && !roles.includes(payload.role)) {
        console.log(`[middleware] → wrong role for ${prefix} → redirect to /login`);
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
