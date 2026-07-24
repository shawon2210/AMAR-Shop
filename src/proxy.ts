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

// Login/register pages — authenticated users get redirected to their role home.
// Also excluded from the protected-route check below so unauthenticated
// users can actually reach them.
const authRoutes = ['/auth/login', '/auth/register', '/admin/login', '/seller/login'];

// Rate limiting — per-IP sliding window for auth endpoints.
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 10;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const authEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];

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

function getRoleHome(role: string): string {
  switch (role) {
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return '/admin';
    case 'SELLER':
      return '/seller/dashboard';
    default:
      return '/account';
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = await validateAuth(request);

  // 1. Auth routes — redirect authenticated users away from login pages
  if (authRoutes.includes(pathname) && auth) {
    return NextResponse.redirect(new URL(getRoleHome(auth.role), request.url));
  }

  // 2. Edge rate limiting for auth API calls
  if (authEndpoints.includes(pathname) && isRateLimited(request.headers.get('x-forwarded-for') || 'unknown')) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  // 3. Protected routes — require auth + matching role
  const protectedRoute = Object.entries(protectedRoutes).find(([route]) =>
    pathname.startsWith(route),
  );

  if (protectedRoute) {
    const [, allowedRoles] = protectedRoute;

    if (!auth) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!allowedRoles.includes(auth.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // 4. Inject auth headers for downstream
  const response = NextResponse.next();
  if (auth) {
    response.headers.set('x-user-id', auth.userId);
    response.headers.set('x-user-role', auth.role);
  }
  return response;
}

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/cart/:path*',
    '/seller/:path*',
    '/admin',
    '/admin/:path*',
    '/auth/login',
    '/auth/register',
  ],
};