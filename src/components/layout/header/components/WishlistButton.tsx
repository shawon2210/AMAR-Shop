'use client';

import Link from 'next/link';

interface WishlistButtonProps {
  variant?: 'default' | 'drawer';
}

export function WishlistButton({ variant = 'default' }: WishlistButtonProps) {
  return (
    <Link
      href="/account"
      className={
        variant === 'drawer'
          ? 'flex relative items-center justify-center w-11 h-11 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-primary active:bg-gray-100 transition-all duration-150'
          : 'flex relative items-center justify-center w-11 h-11 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-primary active:bg-gray-100 transition-all duration-150'
      }
      aria-label="Wishlist"
    >
      <span className="material-symbols-outlined text-[22px]">favorite_border</span>
    </Link>
  );
}
