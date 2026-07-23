'use client';

import Link from 'next/link';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useGetReviews } from '@/services/account';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-sm ${i < rating ? 'text-amber-400' : 'text-gray-200'}`}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { data, isLoading } = useGetReviews();
  const reviews = data?.reviews ?? [];

  return (
    <AuthGuard>
      <div className="app-container py-6 pb-24 space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/account" className="text-secondary hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-xl font-bold">My Reviews</h1>
          {!isLoading && <span className="text-sm text-secondary">({reviews.length})</span>}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-container-lowest rounded-xl p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-secondary mb-3">rate_review</span>
            <p className="text-secondary">No reviews yet</p>
            <Link
              href="/orders"
              className="mt-4 px-6 py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:brightness-110 transition-all"
            >
              Review your purchases
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
                <div className="flex gap-3">
                  <Link href={`/product/${review.productId}`} className="shrink-0">
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${review.productId}`}
                      className="text-sm font-semibold text-on-surface hover:text-primary transition-colors line-clamp-1"
                    >
                      {review.productName}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-secondary">{new Date(review.createdAt).toLocaleDateString('en-BD')}</span>
                    </div>
                    <p className="text-sm text-secondary mt-2">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
