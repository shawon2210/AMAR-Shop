'use client';

import Link from 'next/link';
import { useState, memo, useCallback } from 'react';
import type { Product } from '@/types';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';
import { brandLogoMap } from '@/components/commerce/brand-logos';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'flash-sale' | 'compact';
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={'material-symbols-outlined text-[12px] leading-none ' + (i < full ? 'text-amber-400' : i === full && hasHalf ? 'text-amber-300' : 'text-gray-200')}
          style={i < full ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          star
        </span>
      ))}
    </div>
  );
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const addToast = useUIStore(s => s.addToast);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : (product.discount ?? 0);

  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  const handleCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    addToast(product.name + ' added to cart!');
    setTimeout(() => setAdded(false), 1500);
  }, [addItem, addToast, product]);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(prev => {
      addToast(prev ? 'Removed from wishlist' : 'Added to wishlist!');
      return !prev;
    });
  }, [addToast]);

  return (
    <Link
      href={'/product/' + product.id}
      className="group relative flex flex-col h-full w-full overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-200 hover:shadow-[0_8px_30px_0_rgb(0_0_0/0.12)] hover:-translate-y-1 hover:border-gray-200"
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50 shrink-0">
        {!imgError ? (
          <img
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.06]"
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="material-symbols-outlined text-3xl text-gray-300">image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none shadow-sm">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none shadow-sm">
              NEW
            </span>
          )}
          {product.isMall && (
            <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none shadow-sm">
              MALL
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm border border-gray-100/80 transition-all duration-150 hover:scale-110 active:scale-95"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span
            className={'material-symbols-outlined text-[15px] transition-colors duration-150 ' + (wishlisted ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600')}
            style={wishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            favorite
          </span>
        </button>

        {/* Desktop hover: Add to Cart slides up */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 hidden md:block">
          <button
            onClick={handleCart}
            className={
              'w-full h-10 font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors duration-150 ' +
              (added ? 'bg-primary text-white' : 'bg-gray-900/95 backdrop-blur-sm text-white hover:bg-gray-900')
            }
          >
            <span className="material-symbols-outlined text-[15px]">
              {added ? 'check' : 'shopping_bag'}
            </span>
            {added ? 'Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 md:p-3.5">
        {product.brand && (() => {
          const BrandLogo = brandLogoMap[product.brand];
          return (
            <div className="flex items-center gap-1 mb-1.5">
              {BrandLogo ? (
                <BrandLogo className="w-[52px] h-[11px] text-gray-400" />
              ) : (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate leading-none">
                  {product.brand}
                </p>
              )}
              {BrandLogo && (
                <span className="inline-flex items-center gap-[2px] h-[14px] px-1 rounded-[2px] bg-primary/10 text-primary text-[7px] font-bold tracking-wider leading-none">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-[8px] h-[8px]">
                    <path d="M8 1L9.5 4.5L13 6L9.5 7.5L8 11L6.5 7.5L3 6L6.5 4.5L8 1Z" />
                    <path d="M8 11L9.5 14L13 12.5L9.5 13L8 16L6.5 13L3 12.5L6.5 14L8 11Z" />
                  </svg>
                  Official Store
                </span>
              )}
            </div>
          );
        })()}

        <h3 className="text-[13px] font-medium text-gray-800 line-clamp-2 leading-snug flex-1" style={{ minHeight: '2.6em' }}>
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mt-2">
          <Stars rating={product.rating} />
          <span className="text-[11px] text-gray-400 leading-none">
            ({product.reviewCount > 999 ? (product.reviewCount / 1000).toFixed(1) + 'k' : product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mt-2.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-[16px] font-bold text-gray-900 leading-none">
              ৳{product.price.toLocaleString('en-BD')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[12px] text-gray-400 line-through leading-none">
                ৳{product.originalPrice.toLocaleString('en-BD')}
              </span>
            )}
          </div>
          {savings > 0 && (
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 leading-none">
              Save ৳{savings.toLocaleString('en-BD')}
            </p>
          )}
        </div>

        {/* Mobile cart button */}
        <button
          onClick={handleCart}
          className={
            'md:hidden mt-2.5 w-full h-10 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 ' +
            (added ? 'bg-primary text-white' : 'bg-gray-900 text-white hover:bg-gray-800')
          }
        >
          <span className="material-symbols-outlined text-[14px]">
            {added ? 'check' : 'shopping_bag'}
          </span>
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
});
