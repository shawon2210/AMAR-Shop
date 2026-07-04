'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/types';
import { PriceDisplay } from '@/components/ui/price-display';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'flash-sale' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const addToast = useUIStore(s => s.addToast);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    addToast(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`material-symbols-outlined text-[9px] md:text-[10px] ${
              i < full ? 'text-amber-400' : 'text-gray-200'
            }`}
            style={i < full ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            star
          </span>
        ))}
        <span className="text-[9px] md:text-[10px] text-gray-500 ml-0.5">
          {product.reviewCount > 999 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount}
        </span>
      </div>
    );
  };

  const isFlashVariant = variant === 'flash-sale';

  return (
    <Link
      href={`/product/${product.id}`}
      className={`bg-white rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-xl hover:border-gray-300 transition-all duration-300 ease-out flex flex-col h-full border border-gray-200 ${
        isFlashVariant ? 'border-gray-100' : 'border-gray-200'
      }`}
    >
      {/* Image */}
      <div className="relative h-36 sm:h-40 md:h-44 w-full overflow-hidden bg-gray-50">
        {!imgError ? (
          <img
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
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

        {/* Wishlist button — always visible */}
        <button
          onClick={handleWishlist}
          className="absolute top-1.5 right-1.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
        >
          <span
            className={`material-symbols-outlined text-base ${wishlisted ? 'text-red-500' : 'text-gray-400'}`}
            style={wishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            favorite
          </span>
        </button>

        {/* Discount badge */}
        {discount > 0 && (
          <div className={`absolute top-1.5 left-1.5 ${isFlashVariant ? 'bg-red-500' : 'bg-primary'} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-tight`}>
            -{discount}%
          </div>
        )}

        {/* Seller overlay */}
        {product.seller?.isOfficial && (
          <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[8px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
            <span className="material-symbols-outlined text-[9px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            {product.seller.name}
          </div>
        )}
      </div>

        {/* Content — compact */}
      <div className="p-3 flex flex-col flex-grow gap-1">
        {/* Brand */}
        {product.brand && (
          <p className="text-[10px] text-gray-400 font-medium truncate">{product.brand}</p>
        )}

        {/* Title */}
        <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          {renderStars(product.rating)}
        </div>

        {/* Price */}
        <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />

        {/* Flash sale progress — compact */}
        {isFlashVariant && product.soldPercent !== undefined && (
          <div className="space-y-0.5">
            <div className="flex justify-between text-[9px] font-semibold">
              <span className="text-gray-500">{product.soldPercent}% Sold</span>
              {product.stockCount < 20 && (
                <span className="text-red-500">{product.stockCount} left</span>
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

        {/* Tags — max 2 */}
        <div className="flex items-center gap-1 flex-wrap">
          {product.freeShipping && (
            <span className="text-[8px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Free shipping</span>
          )}
          {(product.isMall || product.isNew) && (
            <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${product.isMall ? 'text-blue-600 bg-blue-50' : 'text-primary bg-primary/10'}`}>
              {product.isMall ? 'Mall' : 'New'}
            </span>
          )}
        </div>

        {/* CTA — h-9 compact */}
        <button
          onClick={handleAddToCart}
          className={`w-full h-9 font-semibold rounded-lg active:scale-[0.97] transition-all text-xs ${
            isFlashVariant
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {isFlashVariant ? 'Grab Now' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
