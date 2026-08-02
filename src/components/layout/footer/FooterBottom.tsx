'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

export function FooterBottom() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        {t('home.securePaymentTitle')}
      </div>

      <p className="text-xs text-gray-400 text-center">
        &copy; {new Date().getFullYear()} AmarShop. {t('footer.rights')}
      </p>

      <div className="flex items-center gap-1 md:gap-4 text-xs text-gray-400">
        <Link href="/privacy" className="inline-flex items-center justify-center min-h-11 px-2 -mx-1 hover:text-primary transition-colors">{t('footer.privacyPolicy')}</Link>
        <Link href="/terms" className="inline-flex items-center justify-center min-h-11 px-2 -mx-1 hover:text-primary transition-colors">{t('footer.termsOfService')}</Link>
        <Link href="/support/tickets" className="inline-flex items-center justify-center min-h-11 px-2 -mx-1 hover:text-primary transition-colors">{t('nav.help')}</Link>
        <Link href="/orders" className="inline-flex items-center justify-center min-h-11 px-2 -mx-1 hover:text-primary transition-colors">{t('nav.orders')}</Link>
      </div>
    </div>
  );
}
