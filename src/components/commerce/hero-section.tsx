"use client";

import Link from 'next/link';
import { HeroSlider } from "./hero-slider";
import { categories } from '@/lib/data/categories';

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-site mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 pt-1 lg:pt-2">
        <div className="flex gap-4 xl:gap-6">
          {/* Sidebar Categories (18%) - hidden on md- */}
          <aside className="hidden lg:block w-[200px] xl:w-[220px] shrink-0 bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="py-2">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors group ${
                    i < categories.length - 1 ? 'border-b border-gray-50' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-primary transition-colors">
                    {cat.icon}
                  </span>
                  <span className="font-medium">{cat.name}</span>
                  <span className="ml-auto text-[10px] text-gray-400">
                    {cat.productCount > 999 ? `${(cat.productCount / 1000).toFixed(0)}k` : cat.productCount}
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/categories"
              className="flex items-center justify-center gap-1 px-4 py-3 text-[12px] font-medium text-primary border-t border-gray-100 hover:bg-gray-50 transition-colors"
            >
              View All
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </aside>

          {/* Hero Slider (57%) */}
          <div className="flex-1 min-w-0">
            <HeroSlider />
          </div>

          {/* Promo Cards (25%) - xl+ only */}
          <aside className="hidden xl:flex flex-col gap-3 w-[280px] shrink-0">
            {[
              { icon: 'flash_on', label: 'Flash Sale', desc: 'Up to 70% off — today only', href: '/flash-sale', color: 'from-red-500 to-red-600' },
              { icon: 'local_shipping', label: 'Free Delivery', desc: 'On orders over ৳999', href: '#', color: 'from-primary to-primary-dark' },
              { icon: 'new_releases', label: 'New Arrivals', desc: 'Fresh styles & latest gadgets', href: '/categories', color: 'from-blue-500 to-blue-600' },
              { icon: 'storefront', label: 'Become a Seller', desc: 'Reach millions of customers', href: '/seller/dashboard', color: 'from-purple-500 to-purple-600' },
              { icon: 'payments', label: 'Cash on Delivery', desc: 'Pay when you receive', href: '#', color: 'from-emerald-500 to-emerald-600' },
              { icon: 'celebration', label: 'Festival Offers', desc: 'Special deals every season', href: '#', color: 'from-amber-500 to-amber-600' },
            ].map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className={`flex items-center gap-3 bg-gradient-to-r ${card.color} rounded-xl px-4 py-3 text-white hover:brightness-110 transition-all flex-none shadow-sm`}
              >
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">{card.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold truncate">{card.label}</p>
                  <p className="text-[11px] text-white/80 truncate">{card.desc}</p>
                </div>
              </Link>
            ))}
          </aside>
        </div>

        {/* Mobile categories pills */}
        <div className="lg:hidden -mx-3 sm:-mx-4 px-3 sm:px-4 pt-2 pb-1 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 w-max">
            {categories.slice(0, 10).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-gray-100 border border-gray-200 text-[12px] font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
