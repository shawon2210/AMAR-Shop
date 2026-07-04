'use client';

import Link from 'next/link';
import { categories } from '@/lib/data/categories';

export function CategoryGrid() {
  return (
    <section className="bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-4 md:py-6">
        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3 md:gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-2 cursor-pointer group py-3 px-2 rounded-xl hover:bg-gray-50 transition-all"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-primary-fixed to-primary/10 flex items-center justify-center text-primary group-hover:from-primary group-hover:to-primary/80 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                <span className="material-symbols-outlined text-xl md:text-2xl lg:text-3xl">{cat.icon}</span>
              </div>
              <span className="text-[11px] md:text-xs lg:text-sm font-medium text-gray-700 group-hover:text-primary text-center leading-tight">
                {cat.name}
              </span>
              <span className="text-[9px] md:text-[10px] text-gray-400 -mt-1">
                {cat.productCount > 999 ? `${(cat.productCount / 1000).toFixed(0)}k+ items` : `${cat.productCount} items`}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden overflow-x-auto hide-scrollbar -mx-4 px-4">
          <div className="flex gap-3 pb-2 w-max">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-1.5 min-w-[80px] py-2"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-fixed to-primary/10 flex items-center justify-center text-primary">
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
    </section>
  );
}