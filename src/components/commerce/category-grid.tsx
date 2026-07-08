'use client';

import Link from 'next/link';
import { categories } from '@/lib/data/categories';

const categoryColors: Record<string, { bg: string; icon: string; hover: string }> = {
  'cat-1':  { bg: 'bg-pink-50',    icon: 'text-pink-500',    hover: 'group-hover:bg-pink-500' },
  'cat-2':  { bg: 'bg-blue-50',    icon: 'text-blue-500',    hover: 'group-hover:bg-blue-500' },
  'cat-3':  { bg: 'bg-green-50',   icon: 'text-green-600',   hover: 'group-hover:bg-green-600' },
  'cat-4':  { bg: 'bg-amber-50',   icon: 'text-amber-600',   hover: 'group-hover:bg-amber-600' },
  'cat-5':  { bg: 'bg-rose-50',    icon: 'text-rose-500',    hover: 'group-hover:bg-rose-500' },
  'cat-6':  { bg: 'bg-purple-50',  icon: 'text-purple-500',  hover: 'group-hover:bg-purple-500' },
  'cat-7':  { bg: 'bg-orange-50',  icon: 'text-orange-500',  hover: 'group-hover:bg-orange-500' },
  'cat-8':  { bg: 'bg-indigo-50',  icon: 'text-indigo-500',  hover: 'group-hover:bg-indigo-500' },
  'cat-9':  { bg: 'bg-teal-50',    icon: 'text-teal-600',    hover: 'group-hover:bg-teal-600' },
  'cat-10': { bg: 'bg-cyan-50',    icon: 'text-cyan-600',    hover: 'group-hover:bg-cyan-600' },
  'cat-11': { bg: 'bg-slate-100',  icon: 'text-slate-600',   hover: 'group-hover:bg-slate-600' },
  'cat-12': { bg: 'bg-emerald-50', icon: 'text-emerald-600', hover: 'group-hover:bg-emerald-600' },
};

function formatCount(n: number) {
  if (n >= 10000) return `${(n / 1000).toFixed(0)}k+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function CategoryGrid() {
  return (
    <section>
      <div className="app-container">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 tracking-tight" style={{ fontSize: 'clamp(15px, 1.6vw, 20px)' }}>
              Shop by Category
            </h2>
            <Link
              href="/categories"
              className="flex items-center gap-0.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors duration-150"
            >
              View All
              <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            </Link>
          </div>

          {/* 3-col mobile → 4-col tablet → 6-col desktop */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-2 md:gap-2.5">
            {categories.map(cat => {
              const colors = categoryColors[cat.id] ?? { bg: 'bg-gray-50', icon: 'text-gray-500', hover: 'group-hover:bg-gray-500' };
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center gap-2 p-2.5 md:p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <div className={`relative w-12 h-12 md:w-14 md:h-14 rounded-2xl ${colors.bg} ${colors.hover} flex items-center justify-center text-gray-500 transition-all duration-200 group-hover:shadow-lg group-hover:scale-105`}>
                    <span className={`material-symbols-outlined text-[22px] md:text-[24px] ${colors.icon} group-hover:text-white transition-colors duration-200`}>
                      {cat.icon}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] md:text-[12px] font-semibold text-gray-700 group-hover:text-primary transition-colors duration-150 line-clamp-1 leading-tight">
                      {cat.name}
                    </p>
                    <span className="text-[10px] text-gray-400 leading-none mt-0.5 block">
                      {formatCount(cat.productCount)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
