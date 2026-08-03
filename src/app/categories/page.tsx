'use client';

import Link from 'next/link';
import { categories } from '@/lib/data/categories';
import { useLanguage } from '@/contexts/language-context';

const categoryColors: Record<string, { bg: string; icon: string; hover: string }> = {
  'cat-1':  { bg: 'bg-pink-50 dark:bg-pink-950/40',    icon: 'text-pink-500',    hover: 'group-hover:bg-pink-500' },
  'cat-2':  { bg: 'bg-blue-50 dark:bg-blue-950/40',    icon: 'text-blue-500',    hover: 'group-hover:bg-blue-500' },
  'cat-3':  { bg: 'bg-green-50 dark:bg-green-950/40',  icon: 'text-green-600',   hover: 'group-hover:bg-green-600' },
  'cat-4':  { bg: 'bg-amber-50 dark:bg-amber-950/40',  icon: 'text-amber-600',   hover: 'group-hover:bg-amber-600' },
  'cat-5':  { bg: 'bg-rose-50 dark:bg-rose-950/40',    icon: 'text-rose-500',    hover: 'group-hover:bg-rose-500' },
  'cat-6':  { bg: 'bg-purple-50 dark:bg-purple-950/40', icon: 'text-purple-500', hover: 'group-hover:bg-purple-500' },
  'cat-7':  { bg: 'bg-orange-50 dark:bg-orange-950/40', icon: 'text-orange-500', hover: 'group-hover:bg-orange-500' },
  'cat-8':  { bg: 'bg-indigo-50 dark:bg-indigo-950/40', icon: 'text-indigo-500', hover: 'group-hover:bg-indigo-500' },
  'cat-9':  { bg: 'bg-teal-50 dark:bg-teal-950/40',    icon: 'text-teal-600',    hover: 'group-hover:bg-teal-600' },
  'cat-10': { bg: 'bg-cyan-50 dark:bg-cyan-950/40',    icon: 'text-cyan-600',    hover: 'group-hover:bg-cyan-600' },
  'cat-11': { bg: 'bg-slate-100 dark:bg-slate-800/50', icon: 'text-slate-600',   hover: 'group-hover:bg-slate-600' },
  'cat-12': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', icon: 'text-emerald-600', hover: 'group-hover:bg-emerald-600' },
};

function formatCount(n: number) {
  if (n >= 10000) return `${(n / 1000).toFixed(0)}k+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function CategoriesPage() {
  const { t, language } = useLanguage();
  return (
    <div className="app-container py-4 md:py-6">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <span className="material-symbols-outlined text-primary text-[22px] md:text-2xl">grid_view</span>
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {t('nav.categories')}
        </h1>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-3 sm:p-4 md:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5 md:gap-3">
          {categories.map((category) => {
            const colors = categoryColors[category.id] ?? { bg: 'bg-gray-50 dark:bg-gray-800/50', icon: 'text-gray-500', hover: 'group-hover:bg-gray-500' };
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group flex flex-col items-center gap-2.5 p-2.5 sm:p-3 md:p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 min-w-0"
              >
                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl ${colors.bg} ${colors.hover} flex items-center justify-center transition-all duration-200 group-hover:shadow-lg group-hover:scale-105 shrink-0`}>
                  <span className={`material-symbols-outlined text-[22px] sm:text-[24px] md:text-[26px] ${colors.icon} group-hover:text-white transition-colors duration-200`}>
                    {category.icon}
                  </span>
                </div>
                <div className="text-center min-w-0">
                  <p className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors duration-150 line-clamp-1 leading-tight px-0.5">
                    {language === 'bn' ? (category.bnName || category.name) : category.name}
                  </p>
                  <span className="text-[10px] sm:text-[11px] text-gray-400 dark:text-gray-500 leading-none mt-1 block">
                    {formatCount(category.productCount)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
