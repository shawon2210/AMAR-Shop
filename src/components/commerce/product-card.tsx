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

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`material-symbols-outlined text-[10px] ${
              i < full
                ? 'text-yellow-400'
                : i === full && half
                  ? 'text-yellow-400'
                  : 'text-gray-200'
            }`}
            style={i < full || (i === full && half) ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {i === full && half ? 'star_half' : 'star'}
          </span>
        ))}
        <span className="text-[10px] text-gray-500 ml-0.5">
          ({product.reviewCount > 999 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})
        </span>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <Link href={`/product/${product.id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex flex-col group h-full">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {!imgError ? (
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <span className="material-symbols-outlined text-3xl">image</span>
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.isMall && (
            <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Mall</span>
          )}
        </div>
        <div className="p-2 md:p-3 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="text-xs md:text-sm text-gray-800 line-clamp-2 mb-1 leading-snug">
              {product.name}
            </h3>
          </div>
          <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />
          <div className="flex items-center justify-between pt-1 mt-auto">
            {renderStars(product.rating)}
            {product.freeShipping && (
              <span className="text-[9px] font-semibold text-green-600 whitespace-nowrap">Free shipping</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/product/${product.id}`} className="bg-white border border-gray-200 rounded-xl overflow-hidden group hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {!imgError ? (
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <span className="material-symbols-outlined text-4xl">image</span>
          </div>
        )}

        {/* Top-left: discount badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}

        {/* Top-right: badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.isMall && (
            <span className="bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase shadow-sm">Mall</span>
          )}
          {product.isNew && (
            <span className="bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase shadow-sm">New</span>
          )}
        </div>

        {/* Seller info overlay */}
        {product.seller?.isOfficial && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            {product.seller.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug mb-1.5">
            {product.name}
          </h3>
        </div>

        <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="md" />

        {/* Rating row */}
        <div className="flex items-center justify-between mt-1">
          {renderStars(product.rating)}
          {product.freeShipping && (
            <span className="text-[9px] font-semibold text-green-600 whitespace-nowrap">Free shipping</span>
          )}
        </div>

        {/* Flash sale progress */}
        {variant === 'flash-sale' && product.soldPercent !== undefined && (
          <div className="space-y-1 mt-2">
            <div className="flex justify-between text-[10px] font-semibold">
              <span className="text-gray-500">{product.soldPercent}% Sold</span>
              {product.soldPercent >= 80 && (
                <span className="text-red-500 font-bold animate-pulse-subtle">Limited Stock!</span>
              )}
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  product.soldPercent >= 80 ? 'bg-red-500' : 'bg-primary'
                }`}
                style={{ width: `${product.soldPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Buy button */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-2.5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 active:scale-[0.97] transition-all text-sm"
        >
          {variant === 'flash-sale' ? 'Grab Now' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
