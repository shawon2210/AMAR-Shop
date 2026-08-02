'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { TranslationKey } from '@/translations';

interface StatItem {
  value: string;
  labelKey: TranslationKey;
}

const stats: StatItem[] = [
  { value: '2M+', labelKey: 'home.customers' },
  { value: '50k+', labelKey: 'home.sellers' },
  { value: '0%', labelKey: 'home.listingFee' },
];

export function SellerCta() {
  const { t } = useLanguage();

  return (
    <section>
      <div className="app-container">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 px-5 py-6 md:px-8 md:py-8 shadow-lg">
          {/* Decorative */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-teal-500/20 to-transparent hidden md:block" />
          <div className="absolute right-16 top-4 h-40 w-40 rounded-full bg-white/5 blur-3xl hidden md:block" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 md:gap-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/20">
              <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <h3 className="font-bold text-white tracking-tight" style={{ fontSize: 'clamp(17px, 2vw, 24px)' }}>
                {t('home.startSelling')}
              </h3>
              <p className="text-sm text-emerald-100 mt-1">
                {t('home.reachMillions')}
              </p>
              {/* Stats */}
              <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
                {stats.map(s => (
                  <div key={s.labelKey} className="flex items-center gap-1.5">
                    <span className="text-white font-bold text-sm">{s.value}</span>
                    <span className="text-emerald-200 text-xs">{t(s.labelKey)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/seller/dashboard"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-white font-bold text-emerald-700 text-sm shadow-xl hover:bg-emerald-50 hover:shadow-2xl hover:gap-3 transition-all duration-200 whitespace-nowrap shrink-0"
            >
              {t('home.joinFree')}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
