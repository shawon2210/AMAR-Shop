'use client';

import Link from 'next/link';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useLanguage } from '@/contexts/language-context';

export function TopUtilityBar() {
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showAuth = hydrated;
  const { t } = useLanguage();

  return (
    <div className="hidden lg:block bg-gray-50/80 dark:bg-gray-900/80 border-b border-gray-100 dark:border-gray-800">
      <div className="app-container h-9 flex items-center justify-between">
        <div className="flex items-center gap-5 text-xs text-gray-500 dark:text-gray-400">
          <Link
            href="/help"
            className="hover:text-primary transition-colors duration-150 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">help_outline</span>
            {t('nav.help')}
          </Link>
          <Link
            href="/orders"
            className="hover:text-primary transition-colors duration-150 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">local_shipping</span>
            {t('nav.trackOrder')}
          </Link>
          {!isAuthenticated && (
            <Link
              href="/seller/dashboard"
              className="hover:text-primary transition-colors duration-150 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[13px]">storefront</span>
              {t('footer.becomeSeller')}
            </Link>
          )}
          {showAuth && isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
            <Link
              href="/admin"
              className="hover:text-primary transition-colors duration-150 flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-200"
            >
              <span className="material-symbols-outlined text-[13px]">admin_panel_settings</span>
              {t('nav.adminPanel')}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-5 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            {t('nav.authenticProducts')}
          </span>
          <Link href="/notifications" className="hover:text-primary transition-colors duration-150">
            {t('nav.offersDeals')}
          </Link>
          <Link href="/help" className="hover:text-primary transition-colors duration-150">
            {t('nav.downloadApp')}
          </Link>
        </div>
      </div>
    </div>
  );
}
