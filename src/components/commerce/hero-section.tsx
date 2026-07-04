"use client";

import Link from 'next/link';
import { HeroSlider } from "./hero-slider";

const campaignCards = [
  { icon: 'flash_on', label: 'Flash Sale', desc: 'Up to 70% off', href: '/flash-sale', color: 'from-red-500/85 to-rose-600/75' },
  { icon: 'local_shipping', label: 'Free Delivery', desc: 'On orders over ৳999', href: '#', color: 'from-emerald-600/85 to-green-700/75' },
  { icon: 'new_releases', label: 'New Arrivals', desc: 'Fresh styles & gadgets', href: '/categories', color: 'from-sky-600/85 to-blue-700/75' },
  { icon: 'storefront', label: 'Become a Seller', desc: 'Reach millions', href: '/seller/dashboard', color: 'from-violet-600/85 to-purple-700/75' },
];

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-1 lg:pt-2">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Hero Slider (≈72%) */}
          <div className="flex-1 min-w-0">
            <HeroSlider />
          </div>

          {/* Campaign Cards (≈26%) - 2×2 rounded-3xl */}
          <aside className="hidden lg:grid grid-cols-2 gap-4 w-[260px] xl:w-[300px] shrink-0">
            {campaignCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className={`bg-gradient-to-br ${card.color} rounded-3xl px-4 py-3 text-white hover:brightness-110 transition-all shadow-sm flex flex-col justify-center h-[145px]`}
              >
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-lg">{card.icon}</span>
                </div>
                <p className="text-sm font-semibold leading-tight">{card.label}</p>
                <p className="text-[11px] text-white/80 mt-0.5 leading-tight">{card.desc}</p>
              </Link>
            ))}
          </aside>
        </div>

        {/* Mobile categories pills */}
        <div className="lg:hidden -mx-4 px-4 pt-2 pb-1 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 w-max">
            {['Electronics', 'Fashion', 'Beauty', 'Groceries', 'Home & Living', 'Sports', 'Flash Sale', 'New Arrivals', 'Deals', 'Mall'].map((name) => (
              <Link
                key={name}
                href="/categories"
                className="flex items-center h-7 px-3 rounded-full bg-gray-100 border border-gray-200 text-[11px] font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
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
