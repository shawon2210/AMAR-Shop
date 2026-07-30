'use client';

import { useSearchStore } from '@/stores/search-store';

export function MobileSearchButton() {
  const setIsSearchOpen = useSearchStore((s) => s.setIsOpen);

  return (
    <button
      onClick={() => setIsSearchOpen(true)}
      className="flex md:hidden items-center w-full max-w-[260px] h-10 px-3 rounded-full border-2 border-gray-200 bg-white text-sm text-gray-400 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-left gap-2"
      aria-label="Search"
    >
      <span className="material-symbols-outlined text-[18px] text-gray-400 shrink-0">search</span>
      <span className="flex-1 truncate">Search products...</span>
      <kbd className="hidden rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-400 font-mono border border-gray-200 border-b-2">
        ⌘K
      </kbd>
    </button>
  );
}