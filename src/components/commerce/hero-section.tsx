'use client';

import Link from 'next/link';
import { HeroSlider } from './hero-slider';

const promoCards = [
  {
    icon: 'flash_on',
    label: 'Flash Sale',
    desc: 'Up to 70% off today',
    href: '/flash-sale',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    accent: 'hover:border-l-red-400',
  },
  {
    icon: 'local_shipping',
    label: 'Free Delivery',
    desc: 'On orders over ৳999',
    href: '#',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-500',
    accent: 'hover:border-l-sky-400',
  },
  {
    icon: 'new_releases',
    label: 'New Arrivals',
    desc: 'Fresh styles every day',
    href: '/categories',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    accent: 'hover:border-l-violet-400',
  },
  {
    icon: 'storefront',
    label: 'Sell on AmarShop',
    desc: 'Zero listing fees',
    href: '/seller/dashboard',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    accent: 'hover:border-l-emerald-400',
  },
];

const mobilePills = ['Electronics', 'Fashion', 'Beauty', 'Groceries', 'Home', 'Sports', '🔥 Flash Sale', 'New Arrivals'];

export function HeroSection() {
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
                key={card.label}
                href={card.href}
                className={`group flex items-center gap-3 bg-white rounded-xl border border-gray-100 border-l-4 border-l-transparent px-3.5 hover:border-gray-200 hover:shadow-md transition-all duration-200 ${card.accent}`}
              >
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                  <span className={`material-symbols-outlined text-[22px] ${card.iconColor}`}>{card.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-gray-800 truncate leading-tight group-hover:text-primary transition-colors duration-150">
                    {card.label}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate leading-tight mt-0.5">{card.desc}</p>
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
                key={card.label}
                href={card.href}
                className="group flex items-center gap-2.5 bg-white rounded-xl border border-gray-100 px-3 py-2.5 hover:border-gray-200 hover:shadow-sm transition-all duration-150"
              >
                <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center shrink-0`}>
                  <span className={`material-symbols-outlined text-[18px] ${card.iconColor}`}>{card.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate leading-tight">{card.label}</p>
                  <p className="text-[10px] text-gray-400 truncate leading-tight mt-0.5">{card.desc}</p>
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
            {mobilePills.map(name => (
              <Link
                key={name}
                href="/categories"
                className="flex items-center h-8 px-3.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-150 whitespace-nowrap shadow-sm"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
