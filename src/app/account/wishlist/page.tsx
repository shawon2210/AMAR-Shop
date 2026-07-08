'use client';

import Link from 'next/link';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function WishlistPage() {
  return (
    <AuthGuard>
      <div className="app-container py-6 pb-24 space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/account" className="text-secondary hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-xl font-bold">My Wishlist</h1>
        </div>

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
      </div>
    </AuthGuard>
  );
}
