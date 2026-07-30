'use client';

import { useSearchStore } from '@/stores/search-store';

export function MobileSearchButton() {
  const setIsSearchOpen = useSearchStore((s) => s.setIsOpen);

  return (
    <button
      onClick={() => setIsSearchOpen(true)}
      className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors duration-150"
      aria-label="Search"
    >
      <span className="material-symbols-outlined text-[22px]">search</span>
    </button>
  );
}
