'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categoryNav } from '../config';

export function CategoryNav() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:block border-t border-gray-100/80 bg-white">
      <div className="app-container">
        <nav
          className="flex items-center gap-0 h-10 overflow-x-auto hide-scrollbar"
          aria-label="Category navigation"
          role="tablist"
        >
          {categoryNav.map((cat) => {
            const isActive = pathname === cat.href || pathname.startsWith(cat.href + '/');
            return (
              <Link
                key={cat.href}
                href={cat.href}
                role="tab"
                aria-selected={isActive}
                className={
                  'relative flex-none px-3.5 h-10 flex items-center text-[13px] font-medium whitespace-nowrap transition-all duration-150 rounded-lg ' +
                  (cat.highlight
                    ? 'text-red-500 font-semibold hover:bg-red-50'
                    : isActive
                      ? 'text-primary font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
                }
              >
                {cat.label}
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
