'use client';

import Link from 'next/link';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';

export function TopUtilityBar() {
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showAuth = hydrated;

  return (
    <div className="hidden lg:block bg-gray-50/80 border-b border-gray-100">
      <div className="app-container h-9 flex items-center justify-between">
        <div className="flex items-center gap-5 text-xs text-gray-500">
          <Link
            href="/help"
            className="hover:text-primary transition-colors duration-150 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">help_outline</span>
            Help Center
          </Link>
          <Link
            href="/orders"
            className="hover:text-primary transition-colors duration-150 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">local_shipping</span>
            Track Order
          </Link>
          {!isAuthenticated && (
            <Link
              href="/seller/dashboard"
              className="hover:text-primary transition-colors duration-150 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">storefront</span>
              Become a Seller
            </Link>
          )}
          {showAuth && isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
            <Link
              href="/admin"
              className="hover:text-primary transition-colors duration-150 flex items-center gap-1 font-semibold text-gray-700"
            >
              <span className="material-symbols-outlined text-[13px]">admin_panel_settings</span>
              Admin Panel
            </Link>
          )}
        </div>
        <div className="flex items-center gap-5 text-xs text-gray-500">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            100% Authentic Products
          </span>
          <Link href="/notifications" className="hover:text-primary transition-colors duration-150">
            Offers & Deals
          </Link>
          <Link href="/help" className="hover:text-primary transition-colors duration-150">
            Download App
          </Link>
        </div>
      </div>
    </div>
  );
}
