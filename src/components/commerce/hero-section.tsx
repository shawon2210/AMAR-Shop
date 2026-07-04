"use client";

import Link from 'next/link';
import { HeroSlider } from "./hero-slider";

const campaignCards = [
  { icon: 'flash_on', label: 'Flash Sale', desc: 'Up to 70% off', href: '/flash-sale', gradient: 'from-rose-500/90 to-red-600/85', iconBg: 'bg-rose-500/25' },
  { icon: 'local_shipping', label: 'Free Delivery', desc: 'On orders over ৳999', href: '#', gradient: 'from-emerald-600/85 to-green-700/80', iconBg: 'bg-emerald-500/25' },
  { icon: 'new_releases', label: 'New Arrivals', desc: 'Fresh styles & gadgets', href: '/categories', gradient: 'from-sky-600/85 to-blue-700/80', iconBg: 'bg-sky-500/25' },
  { icon: 'storefront', label: 'Become a Seller', desc: 'Reach millions', href: '/seller/dashboard', gradient: 'from-violet-600/85 to-purple-700/80', iconBg: 'bg-violet-500/25' },
];

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-1 lg:pt-2">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
          {/* Hero Slider */}
          <div className="flex-1 min-w-0">
            <HeroSlider />
          </div>

          {/* Campaign Cards — responsive grid */}
          <aside className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:w-[240px] xl:w-[280px] shrink-0">
            {campaignCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className={`bg-gradient-to-br ${card.gradient} rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-2.5 sm:py-3 text-white hover:scale-[1.02] hover:shadow-lg transition-all duration-300 flex flex-col justify-center min-h-[100px] sm:min-h-[130px] lg:min-h-[145px]`}
              >
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${card.iconBg} flex items-center justify-center mb-1.5 sm:mb-2`}>
                  <span className="material-symbols-outlined text-base sm:text-lg">{card.icon}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold leading-tight">{card.label}</p>
                <p className="text-[10px] sm:text-[11px] text-white/80 mt-0.5 leading-tight">{card.desc}</p>
              </Link>
            ))}
          </aside>
        </div>

        {/* Mobile categories pills */}
        <div className="lg:hidden -mx-4 px-4 pt-3 pb-2 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2.5 w-max">
            {['Electronics', 'Fashion', 'Beauty', 'Groceries', 'Home & Living', 'Sports', 'Flash Sale', 'New Arrivals', 'Deals', 'Mall'].map((name) => (
              <Link
                key={name}
                href="/categories"
                className="flex items-center h-8 px-4 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 lg:hover:border-primary lg:hover:text-primary transition-colors whitespace-nowrap"
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
