'use client';

import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import Link from 'next/link';

interface AuthSectionProps {
  compact?: boolean;
}

export function AuthSection({ compact = false }: AuthSectionProps) {
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const iconSize = compact ? 'w-10 h-10 sm:w-11 sm:h-11' : 'w-11 h-11';

  if (!hydrated) {
    return (
      <div className={`flex items-center justify-center shrink-0 ${iconSize}`}>
        <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" aria-hidden="true" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Link
          href="/auth/login"
          className={`md:hidden flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-100 transition-colors duration-150 ${iconSize}`}
          aria-label="Sign in"
        >
          <span className="material-symbols-outlined text-[22px]">person</span>
        </Link>
        <Link
          href="/auth/login"
          className="hidden md:flex items-center h-9 px-5 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-dark transition-all duration-150 whitespace-nowrap hover:shadow-md"
        >
          Sign In
        </Link>
      </>
    );
  }

  if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
    return (
      <>
        <Link
          href="/admin"
          className={`md:hidden flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-100 transition-colors duration-150 ${iconSize}`}
          aria-label="Admin dashboard"
        >
          <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
        </Link>
        <Link
          href="/admin"
          className="hidden md:flex items-center h-9 px-4 text-sm font-semibold text-primary bg-primary-fixed rounded-full hover:bg-primary/10 transition-all duration-150 whitespace-nowrap gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          Admin
        </Link>
      </>
    );
  }

  return (
    <Link
      href={user?.isSeller ? '/seller/dashboard' : '/account'}
      className={`flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 hover:text-primary active:bg-gray-100 transition-all duration-150 ${iconSize}`}
      aria-label="My account"
    >
      <span className="material-symbols-outlined text-[22px]">person</span>
    </Link>
  );
}
