'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { PriceDisplay } from '@/components/ui/price-display';

interface AIRecommendationsProps {
  productId?: string;
  userId?: string;
  variant?: 'frequently-bought' | 'cross-sell' | 'upsell' | 'feed';
  limit?: number;
  title?: string;
}

export function AIRecommendations({
  productId,
  variant = 'frequently-bought',
  limit = 6,
  title,
}: AIRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      try {
        let endpoint = '/api/ai/recommendations/';
        switch (variant) {
          case 'frequently-bought':
            endpoint += `frequently-bought/${productId}`;
            break;
          case 'cross-sell':
            endpoint += `cross-sell/${productId}`;
            break;
          case 'upsell':
            endpoint += `upsell/${productId}`;
            break;
          case 'feed':
            endpoint += 'feed';
            break;
        }

        const res = await fetch(`${endpoint}?limit=${limit}`);
        if (res.ok) setProducts(await res.json());
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    if (variant !== 'feed' && !productId) return;
    fetchRecommendations();
  }, [productId, variant, limit]);

  if (loading) {
    return (
      <section className="mt-xl">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[160px] animate-pulse">
              <div className="aspect-square bg-surface-container-high rounded-lg" />
              <div className="h-4 bg-surface-container-high rounded mt-2 w-3/4" />
              <div className="h-4 bg-surface-container-high rounded mt-1 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  const defaultTitle = {
    'frequently-bought': 'Frequently Bought Together',
    'cross-sell': 'Customers Also Viewed',
    'upsell': 'You May Also Like',
    'feed': 'Recommended For You',
  }[variant];

  return (
    <section className="mt-xl">
      <div className="flex items-center justify-between mb-md">
        <h3 className="font-headline-md text-headline-md text-on-surface">
          {title || defaultTitle}
        </h3>
        <Link
          href={productId ? `/product/${productId}` : '#'}
          className="text-primary font-label-bold text-label-bold flex items-center hover:underline"
        >
          View All <span className="material-symbols-outlined text-sm ml-0.5">chevron_right</span>
        </Link>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-md pb-2">
        {products.map(product => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="min-w-[140px] md:min-w-[180px] bg-surface border border-outline-variant rounded-lg overflow-hidden hover:shadow-md transition-shadow shrink-0"
          >
            <div className="aspect-square bg-surface-container overflow-hidden">
              <img
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                src={product.images?.[0] || '/placeholder.svg'}
                alt={product.name}
                loading="lazy"
              />
            </div>
            <div className="p-2 space-y-1">
              <p className="text-body-sm text-body-sm text-on-surface line-clamp-2">{product.name}</p>
              <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />
              {product.rating > 0 && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>
              )}
              {product.freeShipping && (
                <span className="text-[10px] font-bold text-tertiary">FREE SHIPPING</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
