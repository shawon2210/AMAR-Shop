'use client';

import Link from 'next/link';
import { categories } from '@/lib/data/categories';

export function CategoryGrid() {
  return (
    <section>
      <div className="max-w-site mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 md:p-5 lg:p-6 shadow-sm border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900">Shop by Category</h3>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-[12px] md:text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View All
              <span className="material-symbols-outlined text-base">arrow_forward_ios</span>
            </Link>
          </div>

          {/* Desktop grid - 5 cols */}
          <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-2 cursor-pointer group py-3 px-2 rounded-xl hover:bg-gray-50 transition-all"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary group-hover:from-primary group-hover:to-primary-dark group-hover:text-white group-hover:shadow-md transition-all duration-300">
                  <span className="material-symbols-outlined text-xl md:text-2xl lg:text-3xl">{cat.icon}</span>
                </div>
                <span className="text-[11px] md:text-xs lg:text-sm font-medium text-gray-700 group-hover:text-primary text-center leading-tight">
                  {cat.name}
                </span>
                <span className="text-[9px] md:text-[10px] text-gray-400">
                  {cat.productCount > 999 ? `${(cat.productCount / 1000).toFixed(0)}k+ items` : `${cat.productCount} items`}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="sm:hidden overflow-x-auto hide-scrollbar -mx-4 px-4">
            <div className="flex gap-3 pb-2 w-max">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="flex flex-col items-center gap-1.5 min-w-[80px] py-2"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                  </div>
                  <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">
                    {cat.name}
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
