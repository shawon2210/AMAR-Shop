'use client';

import Link from 'next/link';

export function EmptyCart() {
  return (
    <div className="app-container py-6 space-y-6 pb-24 min-h-screen">
      <h1 className="text-xl font-bold">Checkout</h1>
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-primary">shopping_cart</span>
        </div>
        <p className="text-secondary text-lg">Your cart is empty or no items selected for checkout</p>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          Go to Cart
        </Link>
      </div>
    </div>
  );
}
