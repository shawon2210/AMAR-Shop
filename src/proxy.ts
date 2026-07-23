import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

const protectedRoutes = {
  '/account': ['CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN'],
  '/checkout': ['CUSTOMER'],
  '/cart': ['CUSTOMER', 'SELLER'],
  '/seller': ['SELLER', 'ADMIN', 'SUPER_ADMIN'],
  '/admin': ['ADMIN', 'SUPER_ADMIN'],
};

const authRoutes = ['/auth/login', '/auth/register'];

function getTokenFromCookies(request: NextRequest): string | null {
  return request.cookies.get('accessToken')?.value || null;
}

async function validateAuth(request: NextRequest): Promise<{ userId: string; role: string } | null> {
  const token = getTokenFromCookies(request);
  if (!token) return null;

  try {
    const payload = await verifyToken(token);
    return { userId: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = await validateAuth(request);

  // Check if route requires authentication
  const protectedRoute = Object.entries(protectedRoutes).find(([route]) =>
    pathname.startsWith(route),
  );

  if (protectedRoute) {
    const [, allowedRoles] = protectedRoute;

    if (!auth) {
      // Redirect to login with redirect parameter
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!allowedRoles.includes(auth.role)) {
      // Redirect to unauthorized or home
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.includes(pathname) && auth) {
    const roleHome = getRoleHome(auth.role);
    return NextResponse.redirect(new URL(roleHome, request.url));
  }

  // Add auth headers for downstream use
  const response = NextResponse.next();
  if (auth) {
    response.headers.set('x-user-id', auth.userId);
    response.headers.set('x-user-role', auth.role);
  }
  return response;
}

function getRoleHome(role: string): string {
  switch (role) {
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return '/admin/dashboard';
    case 'SELLER':
      return '/seller/dashboard';
    default:
      return '/account';
  }
}

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/cart/:path*',
    '/seller/:path*',
    '/admin/:path*',
    '/auth/login',
    '/auth/register',
  ],
};