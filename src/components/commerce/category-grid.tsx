'use client';

import Link from 'next/link';
import { categories } from '@/lib/data/categories';

export function CategoryGrid() {
  return (
    <section>
      <div className="app-container">
        <div className="relative overflow-hidden rounded-[24px] border border-gray-200/50 bg-white/80 backdrop-blur-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900">Shop by Category</h3>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View All
              <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </Link>
          </div>

          {/* Desktop: 8-column grid */}
          <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-white transition-all duration-300"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary group-hover:from-primary group-hover:to-primary-dark group-hover:text-white group-hover:shadow-md transition-all duration-300">
                  <span className="material-symbols-outlined text-lg sm:text-xl">{cat.icon}</span>
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-700 group-hover:text-primary text-center leading-tight line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[9px] sm:text-[10px] font-medium text-gray-400 bg-gray-100/80 px-1.5 py-0.5 rounded-full">
                  {cat.productCount > 999 ? `${(cat.productCount / 1000).toFixed(0)}k+` : `${cat.productCount}`}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="md:hidden -mx-4 px-4 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 w-max">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-white transition-all min-w-[90px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                  </div>
                  <span className="text-[11px] font-medium text-gray-700 text-center leading-tight line-clamp-1">
                    {cat.name}
                  </span>
                  <span className="text-[9px] font-medium text-gray-400 bg-gray-100/80 px-1.5 py-0.5 rounded-full">
                    {cat.productCount > 999 ? `${(cat.productCount / 1000).toFixed(0)}k+` : `${cat.productCount}`}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
