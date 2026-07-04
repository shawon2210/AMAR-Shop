"use client";

import Link from 'next/link';
import { HeroSlider } from "./hero-slider";

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-1 lg:pt-2">
        <div className="flex flex-col lg:flex-row gap-3 xl:gap-4">
          {/* Hero Slider (≈70%) */}
          <div className="flex-1 min-w-0">
            <HeroSlider />
          </div>

          {/* Campaign Cards (≈30%) - lg+ only */}
          <aside className="hidden lg:flex flex-col gap-2 w-[240px] xl:w-[280px] shrink-0">
            {[
              { icon: 'flash_on', label: 'Flash Sale', desc: 'Up to 70% off', href: '/flash-sale', color: 'from-red-500 to-red-600' },
              { icon: 'local_shipping', label: 'Free Delivery', desc: 'On orders over ৳999', href: '#', color: 'from-primary to-primary-dark' },
              { icon: 'new_releases', label: 'New Arrivals', desc: 'Fresh styles & gadgets', href: '/categories', color: 'from-blue-500 to-blue-600' },
              { icon: 'storefront', label: 'Become a Seller', desc: 'Reach millions', href: '/seller/dashboard', color: 'from-purple-500 to-purple-600' },
            ].map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className={`flex items-center gap-2.5 bg-gradient-to-r ${card.color} rounded-xl px-3.5 py-2.5 text-white hover:brightness-110 transition-all flex-none shadow-sm`}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-base">{card.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{card.label}</p>
                  <p className="text-[10px] text-white/80 truncate">{card.desc}</p>
                </div>
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
