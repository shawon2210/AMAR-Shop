'use client';

import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { useAuthHydrated } from '@/stores/auth-store';

export function CartButton() {
  const hydrated = useAuthHydrated();
  const itemCount = useCartStore((s) => s.getItemCount());
  const showBadge = hydrated && itemCount > 0;

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-11 h-11 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-primary transition-all duration-150"
      aria-label={`Shopping cart${showBadge ? `, ${itemCount} items` : ''}`}
    >
      <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
      {showBadge && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ring-2 ring-white">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
