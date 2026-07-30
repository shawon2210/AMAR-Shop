'use client';

import { useSearchStore } from '@/stores/search-store';

export function DesktopSearch() {
  const setIsSearchOpen = useSearchStore((s) => s.setIsOpen);

  return (
    <div className="hidden md:flex flex-1 justify-center">
      <button
        onClick={() => setIsSearchOpen(true)}
        className="relative w-full max-w-[clamp(280px,35vw,600px)] group"
        aria-label="Open search"
      >
        <div className="relative w-full transition-all duration-200">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px] pointer-events-none transition-colors duration-150">
            search
          </span>
          <div className="w-full h-11 rounded-full border-2 border-gray-200 bg-white pl-11 pr-14 text-sm text-gray-400 flex items-center text-left transition-all duration-200 group-hover:border-gray-300 group-hover:bg-gray-50 cursor-text">
            <span className="hidden sm:inline">Search products, brands & categories...</span>
          </div>
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white group-hover:bg-primary-dark transition-all duration-150">
            <span className="material-symbols-outlined text-[17px]">search</span>
          </div>
        </div>
      </button>
    </div>
  );
}
