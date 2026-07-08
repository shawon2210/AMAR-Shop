'use client';

import Link from 'next/link';
import { HeroSlider } from './hero-slider';

const campaignCards = [
  { icon: 'flash_on', label: 'Flash Sale', desc: 'Up to 70% off', href: '/flash-sale', gradient: 'from-rose-500/90 to-red-600/85', iconBg: 'bg-rose-500/25' },
  { icon: 'local_shipping', label: 'Free Delivery', desc: 'On orders over ৳999', href: '#', gradient: 'from-emerald-600/85 to-green-700/80', iconBg: 'bg-emerald-500/25' },
  { icon: 'new_releases', label: 'New Arrivals', desc: 'Fresh styles & gadgets', href: '/categories', gradient: 'from-sky-600/85 to-blue-700/80', iconBg: 'bg-sky-500/25' },
  { icon: 'storefront', label: 'Become a Seller', desc: 'Reach millions', href: '/seller/dashboard', gradient: 'from-violet-600/85 to-purple-700/80', iconBg: 'bg-violet-500/25' },
];

const mobilePills = ['Electronics', 'Fashion', 'Beauty', 'Groceries', 'Home & Living', 'Sports', 'Flash Sale', 'New Arrivals', 'Deals', 'Mall'];

export function HeroSection() {
  return (
    <section className="bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 md:pt-6">
        {/* Desktop: 70/30 grid, Tablet: 2 promo cards below slider, Mobile: slider only */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          {/* Slider — full width on mobile/tablet */}
          <div className="min-w-0">
            <HeroSlider />
          </div>

          {/* Campaign cards — sidebar on desktop, 2-col grid on tablet */}
          <div className="hidden lg:flex flex-col gap-3">
            {campaignCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className={`group bg-gradient-to-br ${card.gradient} rounded-2xl p-4 text-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-center min-h-[100px] relative overflow-hidden flex-1`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
                <div className={`w-9 h-9 rounded-full ${card.iconBg} flex items-center justify-center mb-2 backdrop-blur-md relative`}>
                  <span className="material-symbols-outlined text-lg">{card.icon}</span>
                </div>
                <p className="text-sm font-semibold leading-tight relative">{card.label}</p>
                <p className="text-xs text-white/80 mt-0.5 leading-tight relative">{card.desc}</p>
              </Link>
            ))}
          </div>

          {/* Tablet: 2 promo cards in a row below slider */}
          <div className="lg:hidden grid grid-cols-2 sm:grid-cols-4 gap-3">
            {campaignCards.slice(0, 4).map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className={`group bg-gradient-to-br ${card.gradient} rounded-xl p-3 text-white shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
                <div className={`w-8 h-8 rounded-full ${card.iconBg} flex items-center justify-center mb-1.5 backdrop-blur-md relative`}>
                  <span className="material-symbols-outlined text-base">{card.icon}</span>
                </div>
                <p className="text-xs font-semibold leading-tight relative">{card.label}</p>
                <p className="text-[10px] text-white/80 mt-0.5 leading-tight relative">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile horizontal scrollable pills */}
        <div className="lg:hidden mt-4 -mx-4 px-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 w-max">
            {mobilePills.map((name) => (
              <Link
                key={name}
                href="/categories"
                className="flex items-center h-9 px-4 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all whitespace-nowrap shadow-sm"
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
