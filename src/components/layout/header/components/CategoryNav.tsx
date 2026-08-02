'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categoryNav } from '../config';
import { useLanguage } from '@/contexts/language-context';
import { TranslationKey } from '@/translations';

const categoryKeyMap: Record<string, TranslationKey> = {
  '/category/fashion': 'cat.fashion',
  '/category/electronics': 'cat.electronics',
  '/category/beauty': 'cat.beauty',
  '/category/groceries': 'cat.groceries',
  '/category/home': 'cat.homeLiving',
  '/category/sports': 'cat.sports',
  '/flash-sale': 'cat.flashSale',
};

export function CategoryNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="hidden lg:block border-t border-gray-100/80 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="app-container">
        <nav
          className="flex items-center gap-0 h-10 overflow-x-auto hide-scrollbar"
          aria-label="Category navigation"
          role="tablist"
        >
          {categoryNav.map((cat) => {
            const isActive = pathname === cat.href || pathname.startsWith(cat.href + '/');
            const key = categoryKeyMap[cat.href];
            const label = key ? t(key) : cat.label;

            return (
              <Link
                key={cat.href}
                href={cat.href}
                role="tab"
                aria-selected={isActive}
                className={
                  'relative flex-none px-3.5 h-10 flex items-center text-[13px] font-medium whitespace-nowrap transition-all duration-150 rounded-lg ' +
                  (cat.highlight
                    ? 'text-red-500 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-950/30'
                    : isActive
                      ? 'text-primary font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800')
                }
              >
                {label}
                {isActive && !cat.highlight && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
