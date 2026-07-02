'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, requiredRole, fallback }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, isAuthenticated, router, pathname]);

  if (!mounted || !hydrated) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] px-4">
        <div className="w-full max-w-md">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface-container-high rounded w-1/3" />
            <div className="h-4 bg-surface-container-high rounded w-1/2" />
            <div className="h-32 bg-surface-container-high rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] px-4">
        <div className="w-full max-w-md text-center">
          <span className="material-symbols-outlined text-5xl text-secondary">lock</span>
          <h2 className="font-title-sm text-title-sm mt-3">Authentication Required</h2>
          <p className="text-sm text-secondary mt-1">Please sign in to access this page</p>
        </div>
      </div>
    );
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'SUPER_ADMIN') {
    router.push('/403');
    return null;
  }

  return <>{children}</>;
}
