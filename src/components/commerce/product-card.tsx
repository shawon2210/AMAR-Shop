'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/types';
import { PriceDisplay, DiscountBadge } from '@/components/ui/price-display';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'flash-sale' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const addToast = useUIStore(s => s.addToast);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    addToast(`${product.name} added to cart!`);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (variant === 'compact') {
    return (
      <Link href={`/product/${product.id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex flex-col group">
        <div className="aspect-square relative overflow-hidden bg-surface-container">
          {!imgError ? (
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-container-high text-secondary">
              <span className="material-symbols-outlined text-3xl">image</span>
            </div>
          )}
          {product.isMall && (
            <Badge variant="primary" className="absolute top-2 left-2">MALL</Badge>
          )}
          {product.isNew && (
            <Badge variant="tertiary" className="absolute top-2 left-2">NEW</Badge>
          )}
          {discount > 0 && (
            <DiscountBadge discount={discount} />
          )}
        </div>
        <div className="p-sm flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="font-body-sm text-body-sm line-clamp-2 text-on-surface mb-1">
              {product.name}
            </h3>
          </div>
          <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span className="text-[10px] text-secondary">({product.reviewCount > 999 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})</span>
            </div>
            {product.freeShipping && (
              <span className="text-[10px] font-bold text-tertiary">FREE SHIPPING</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/product/${product.id}`} className="bg-surface border border-outline-variant rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-surface-container">
        {!imgError ? (
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-high text-secondary">
            <span className="material-symbols-outlined text-4xl">image</span>
          </div>
        )}
        {product.isFlashSale && discount > 0 && (
          <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-label-bold px-2 py-1 rounded-full uppercase">
            -{discount}% OFF
          </div>
        )}
        {product.isMall && (
          <div className="absolute top-2 right-2">
            <Badge variant="primary">MALL</Badge>
          </div>
        )}
      </div>
      <div className="p-sm flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-body-md text-body-md text-on-surface line-clamp-2">{product.name}</h3>
        </div>
        <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="md" />

        {variant === 'flash-sale' && product.soldPercent !== undefined && (
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] font-label-bold">
              <span className="text-on-surface-variant">{product.soldPercent}% Sold</span>
              {product.soldPercent >= 80 && (
                <span className="text-error font-bold animate-pulse-subtle">Limited Stock!</span>
              )}
            </div>
            <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${product.soldPercent >= 80 ? 'bg-error' : 'bg-primary'}`}
                style={{ width: `${product.soldPercent}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          className="w-full mt-2 py-2 bg-primary text-white font-label-bold rounded-lg hover:bg-primary-container active:scale-95 transition-all text-sm"
        >
          Buy Now
        </button>
      </div>
    </Link>
  );
}
