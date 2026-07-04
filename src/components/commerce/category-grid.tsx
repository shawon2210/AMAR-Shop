'use client';

import Link from 'next/link';
import { categories } from '@/lib/data/categories';

export function CategoryGrid() {
  return (
    <section>
      <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm md:text-base font-bold text-gray-900">Shop by Category</h3>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-[11px] md:text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View All
              <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </Link>
          </div>

          {/* Grid - 6 cols desktop */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-2 cursor-pointer group p-4 rounded-2xl hover:bg-gray-50 transition-all"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary group-hover:scale-105 group-hover:from-primary group-hover:to-primary-dark group-hover:text-white group-hover:shadow-md transition-all duration-300">
                  <span className="material-symbols-outlined text-xl sm:text-2xl">{cat.icon}</span>
                </div>
                <span className="text-[10px] sm:text-[11px] md:text-xs font-medium text-gray-700 group-hover:text-primary text-center leading-tight line-clamp-1">
                  {cat.name}
                </span>
                <span className="inline-flex items-center text-[8px] sm:text-[9px] font-medium text-gray-400 bg-gray-100/80 px-1.5 py-0.5 rounded-full">
                  {cat.productCount > 999 ? `${(cat.productCount / 1000).toFixed(0)}k+` : `${cat.productCount}`}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
