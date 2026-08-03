'use client';

import Link from 'next/link';
import { HeroSlider } from './hero-slider';
import { useLanguage } from '@/contexts/language-context';
import { TranslationKey } from '@/translations';

interface PromoCard {
  icon: string;
  labelKey: TranslationKey;
  descKey: TranslationKey;
  href: string;
  iconBg: string;
  iconColor: string;
  accent: string;
}

const promoCards: PromoCard[] = [
  {
    icon: 'flash_on',
    labelKey: 'cat.flashSale',
    descKey: 'home.upTo70Off',
    href: '/flash-sale',
    iconBg: 'bg-red-50 dark:bg-red-950/40',
    iconColor: 'text-red-500',
    accent: 'hover:border-l-red-400',
  },
  {
    icon: 'local_shipping',
    labelKey: 'home.freeShippingTitle',
    descKey: 'home.freeShippingDesc',
    href: '#',
    iconBg: 'bg-sky-50 dark:bg-sky-950/40',
    iconColor: 'text-sky-500',
    accent: 'hover:border-l-sky-400',
  },
  {
    icon: 'new_releases',
    labelKey: 'home.newArrivals',
    descKey: 'home.freshStyles',
    href: '/categories',
    iconBg: 'bg-violet-50 dark:bg-violet-950/40',
    iconColor: 'text-violet-500',
    accent: 'hover:border-l-violet-400',
  },
  {
    icon: 'storefront',
    labelKey: 'home.sellOnAmarshop',
    descKey: 'home.zeroFees',
    href: '/seller/dashboard',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-600',
    accent: 'hover:border-l-emerald-400',
  },
];

const mobilePillKeys: { key: TranslationKey; href: string }[] = [
  { key: 'cat.electronics', href: '/category/electronics' },
  { key: 'cat.fashion', href: '/category/fashion' },
  { key: 'cat.beauty', href: '/category/beauty' },
  { key: 'cat.groceries', href: '/category/groceries' },
  { key: 'cat.homeLiving', href: '/category/home' },
  { key: 'cat.sports', href: '/category/sports' },
  { key: 'cat.flashSale', href: '/flash-sale' },
  { key: 'home.newArrivals', href: '/categories' },
];

export function HeroSection({ priority = false }: { priority?: boolean }) {
  const { t } = useLanguage();

  return (
    <section>
      <div className="app-container pt-3 md:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_244px] xl:grid-cols-[1fr_260px] gap-3">

          {/* Slider */}
          <div className="min-w-0">
            <HeroSlider />
          </div>

          {/* Desktop promo sidebar */}
          <div className="hidden lg:grid grid-rows-4 gap-2 h-hero">
            {promoCards.map(card => (
              <Link
                key={card.labelKey}
                href={card.href}
                className={`group flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 border-l-4 border-l-transparent px-3.5 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all duration-200 ${card.accent}`}
              >
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                  <span className={`material-symbols-outlined text-[22px] ${card.iconColor}`}>{card.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 truncate leading-tight group-hover:text-primary transition-colors duration-150">
                    {t(card.labelKey)}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-400 truncate leading-tight mt-0.5">{t(card.descKey)}</p>
                </div>
                <span className="material-symbols-outlined text-[14px] text-gray-300 shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>

          {/* Tablet/mobile: 2×2 or 4-col promo row */}
          <div className="lg:hidden grid grid-cols-2 sm:grid-cols-4 gap-2">
            {promoCards.map(card => (
              <Link
                key={card.labelKey}
                href={card.href}
                className="group flex items-center gap-2.5 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-3 py-2.5 hover:border-gray-200 transition-all duration-150"
              >
                <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}>
                  <span className={`material-symbols-outlined text-[18px] ${card.iconColor}`}>{card.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate leading-tight">{t(card.labelKey)}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-400 truncate leading-tight mt-0.5">{t(card.descKey)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile category pills */}
        <div
          className="lg:hidden mt-3 overflow-x-auto hide-scrollbar"
          style={{
            marginLeft: 'calc(var(--container-padding) * -1)',
            marginRight: 'calc(var(--container-padding) * -1)',
            paddingLeft: 'var(--container-padding)',
            paddingRight: 'var(--container-padding)',
          }}
        >
          <div className="flex gap-2 w-max pb-0.5">
            {mobilePillKeys.map(pill => (
              <Link
                key={pill.key}
                href={pill.href}
                className="flex items-center min-h-11 px-3.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary transition-all duration-150 whitespace-nowrap shadow-xs"
              >
                {t(pill.key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
