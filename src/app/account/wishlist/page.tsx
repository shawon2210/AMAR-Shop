'use client';

import Link from 'next/link';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useGetWishlist, useRemoveFromWishlist } from '@/services/account';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';

export default function WishlistPage() {
  const { data, isLoading } = useGetWishlist();
  const { mutate: remove } = useRemoveFromWishlist();
  const addItem = useCartStore(s => s.addItem);
  const addToast = useUIStore(s => s.addToast);
  const items = data?.items ?? [];

  return (
    <AuthGuard>
      <div className="app-container py-6 pb-24 space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/account" className="text-secondary hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-xl font-bold">My Wishlist</h1>
          {!isLoading && <span className="text-sm text-secondary">({items.length})</span>}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-square bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-secondary mb-3">favorite</span>
            <p className="text-secondary">Your wishlist is empty</p>
            <Link
              href="/"
              className="mt-4 px-6 py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:brightness-110 transition-all"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((product) => (
              <div key={product.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group">
                <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      remove(product.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-error hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </Link>
                <div className="p-3 space-y-2">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-sm font-semibold text-on-surface line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-primary">৳{product.price.toLocaleString('en-BD')}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-secondary line-through">৳{product.originalPrice.toLocaleString('en-BD')}</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      addItem(product, 1);
                      addToast('Added to cart', 'success');
                    }}
                    className="w-full py-2 text-sm font-semibold bg-primary text-on-primary rounded-lg hover:brightness-110 transition-all active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
