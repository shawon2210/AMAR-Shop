'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categoryNav } from '../config';

export function MobileCategoryList({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  return (
    <div className="px-5 pb-2">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
        Shop by Category
      </p>
      <nav className="flex flex-col gap-0.5" aria-label="Mobile categories">
        {categoryNav.map((cat) => {
          const isActive = pathname === cat.href;
          return (
            <Link
              key={cat.href}
              href={cat.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                isActive
                  ? 'bg-primary-fixed text-primary'
                  : cat.highlight
                    ? 'text-red-500 hover:bg-red-50 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.icon && (
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    cat.highlight ? 'text-red-400' : 'text-gray-400'
                  }`}
                >
                  {cat.icon}
                </span>
              )}
              {cat.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
