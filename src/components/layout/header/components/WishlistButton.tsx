'use client';

import Link from 'next/link';

export function WishlistButton() {
  return (
    <Link
      href="/account"
      className="hidden lg:flex relative items-center justify-center w-11 h-11 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-primary transition-all duration-150"
      aria-label="Wishlist"
    >
      <span className="material-symbols-outlined text-[22px]">favorite_border</span>
    </Link>
  );
}
