'use client';

import Link from 'next/link';
import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/types';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';
import { brandLogoMap } from '@/components/commerce/brand-logos';
import { Truck, ShieldCheck, Clock, Zap, BarChart3, Heart, ShoppingBag, Check } from 'lucide-react';

interface ProductCardEnhancedProps {
  product: Product;
  variant?: 'default' | 'flash-sale' | 'compact';
  recentlyViewed?: boolean;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={'material-symbols-outlined text-[11px] leading-none ' + (i < full ? 'text-amber-400' : i === full && hasHalf ? 'text-amber-300' : 'text-gray-200')}
          style={i < full ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          star
        </span>
      ))}
    </div>
  );
}

// Generate a random delivery date range (for demo purposes)
function getDeliveryDate() {
  const today = new Date();
  const minDays = 3 + Math.floor(Math.random() * 2);
  const maxDays = minDays + 2;
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDays);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${minDate.toLocaleDateString('en-US', options)} - ${maxDate.toLocaleDateString('en-US', options)}`;
}

export const ProductCardEnhanced = memo(function ProductCardEnhanced({ product, variant = 'default', recentlyViewed }: ProductCardEnhancedProps) {
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const addToast = useUIStore(s => s.addToast);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : (product.discount ?? 0);

  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  const deliveryDate = useCallback(() => getDeliveryDate(), []);
  const isLowStock = product.inStock && product.stockCount <= 10;
  const isOutOfStock = !product.inStock;

  const handleCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product);
    setAdded(true);
    addToast(product.name + ' added to cart!');
    setTimeout(() => setAdded(false), 1500);
  }, [addItem, addToast, product, isOutOfStock]);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(prev => {
      addToast(prev ? 'Removed from wishlist' : 'Added to wishlist!');
      return !prev;
    });
  }, [addToast]);

  const handleQuickAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickAdd(true);
    addItem(product);
    addToast(product.name + ' added to cart!');
    setTimeout(() => setShowQuickAdd(false), 800);
  }, [addItem, addToast, product]);

  return (
    <Link
      href={'/product/' + product.id}
      className="group relative flex flex-col h-full w-full overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-200 hover:shadow-[0_8px_30px_0_rgb(0_0_0/0.12)] hover:-translate-y-1 hover:border-gray-200"
    >
      {/* Recently Viewed Indicator */}
      {recentlyViewed && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-linear-to-r from-primary/90 to-primary/70 backdrop-blur-sm px-2.5 py-1 flex items-center gap-1">
          <Clock className="w-3 h-3 text-white" />
          <span className="text-[9px] text-white font-semibold tracking-wide">Recently Viewed</span>
        </div>
      )}

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

        {/* Badges Row */}
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
          {product.freeShipping && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none shadow-sm">
              FREE SHIP
            </span>
          )}
        </div>

        {/* Right side badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          {/* COD Badge */}
          <span className="bg-white/95 backdrop-blur-sm text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded-md leading-none shadow-sm border border-emerald-200">
            COD
          </span>
          {/* Installment Badge */}
          {product.price >= 5000 && (
            <span className="bg-white/95 backdrop-blur-sm text-violet-700 text-[8px] font-bold px-1.5 py-0.5 rounded-md leading-none shadow-sm border border-violet-200">
              INSTALLMENT
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute bottom-2 right-2 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm border border-gray-100/80 transition-all duration-150 hover:scale-110 active:scale-95"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={'w-3.5 h-3.5 transition-colors duration-150 ' + (wishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover:text-gray-600')}
          />
        </button>

        {/* Stock Status */}
        {isLowStock && (
          <div className="absolute bottom-2 left-2 z-10 bg-orange-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full leading-none shadow-sm flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" />
            Only {product.stockCount} left
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/95 text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Desktop hover: Quick Add slides up */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 hidden md:block">
          <button
            onClick={handleCart}
            disabled={isOutOfStock}
            className={
              'w-full h-10 font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors duration-150 ' +
              (added ? 'bg-primary text-white' : isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-900/95 backdrop-blur-sm text-white hover:bg-gray-900')
            }
          >
            <span className="material-symbols-outlined text-[15px]">
              {added ? 'check' : 'shopping_bag'}
            </span>
            {added ? 'Added to Cart!' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
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
                <BrandLogo className="w52px h-11px text-gray-400" />
              ) : (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate leading-none">
                  {product.brand}
                </p>
              )}
              {BrandLogo && (
                <span className="inline-flex items-center gap-2px h-14px px-1 rounded-[2px] bg-primary/10 text-primary text-[7px] font-bold tracking-wider leading-none">
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

        {/* Rating + Verified Seller */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <Stars rating={product.rating} />
            <span className="text-[11px] text-gray-400 leading-none">
              ({product.reviewCount > 999 ? (product.reviewCount / 1000).toFixed(1) + 'k' : product.reviewCount})
            </span>
          </div>
          {product.seller?.isOfficial && (
            <span className="flex items-center gap-0.5 text-[9px] text-primary font-semibold">
              <ShieldCheck className="w-2.5 h-2.5" />
              Verified
            </span>
          )}
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

        {/* Delivery Date */}
        {!isOutOfStock && (
          <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
            <Truck className="w-3 h-3" />
            <span>Free delivery <strong className="text-gray-600 font-medium">{deliveryDate()}</strong></span>
          </div>
        )}

        {/* Mobile cart button with quick add animation */}
        <div className="relative md:hidden mt-2.5">
          <button
            onClick={handleCart}
            disabled={isOutOfStock}
            className={
              'w-full h-10 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 ' +
              (added ? 'bg-primary text-white' : isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800')
            }
          >
            <span className="material-symbols-outlined text-[14px]">
              {added ? 'check' : 'shopping_bag'}
            </span>
            {added ? 'Added!' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Quick Add ripple animation */}
          <AnimatePresence>
            {showQuickAdd && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-lg bg-primary pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </Link>
  );
});