'use client';

import { useSearchStore } from '@/stores/search-store';

export function MobileSearchButton({ scrolled = false }: { scrolled?: boolean }) {
  const setIsSearchOpen = useSearchStore((s) => s.setIsOpen);

  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        scrolled ? 'h-0 opacity-0' : 'h-[52px] opacity-100'
      }`}
    >
      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex items-center w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-400 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-50 transition-all duration-200 text-left gap-2"
        aria-label="Search"
      >
        <span className="material-symbols-outlined text-[18px] text-gray-400 shrink-0">search</span>
        <span className="flex-1 truncate">Search products, brands &amp; categories...</span>
      </button>
    </div>
  );
}
