'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';

export function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const itemCount = useCartStore(s => s.getItemCount());

  return (
    <header className="w-full top-0 sticky z-50 bg-surface shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between px-container-margin py-sm w-full max-w-7xl mx-auto gap-md">
        <div className="flex items-center gap-sm">
          <Link href="/" className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary cursor-pointer md:hidden">menu</span>
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary tracking-tight leading-none">
              AmarShop
            </h1>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="flex-grow max-w-2xl hidden md:flex relative">
          <input
            className="w-full bg-surface-container-low border-none rounded-lg px-md py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"
            placeholder="Search in AmarShop..."
            type="text"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-1 hover:bg-surface-container-high rounded-full transition-colors"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <span className="material-symbols-outlined text-primary">search</span>
          </button>

          <Link href="/notifications" className="relative p-1 hover:bg-surface-container-high rounded-full transition-colors">
            <span className="material-symbols-outlined text-primary">notifications</span>
            <span className="absolute -top-0.5 -right-0.5 bg-error text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </Link>

          <Link href="/cart" className="relative p-1 hover:bg-surface-container-high rounded-full transition-colors">
            <span className="material-symbols-outlined text-primary">shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Search Expandable */}
      {mobileSearchOpen && (
        <div className="md:hidden px-container-margin pb-sm">
          <div className="relative flex items-center bg-surface-container-high rounded-full px-md py-2">
            <span className="material-symbols-outlined text-secondary mr-sm text-lg">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
              placeholder="Search in AmarShop..."
              type="text"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
