'use client';

import Link from 'next/link';
import { useState, memo } from 'react';
import { Product } from '@/types';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'flash-sale' | 'compact';
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={'material-symbols-outlined leading-none ' + (i < Math.floor(rating) ? 'text-amber-400 text-[13px]' : 'text-gray-200 text-[13px]')}
            style={i < Math.floor(rating) ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            star
          </span>
        ))}
      </div>
      <span className="text-[11px] text-gray-400 leading-none">
        ({count > 999 ? (count / 1000).toFixed(1) + 'k' : count})
      </span>
    </div>
  );
}

export const ProductCard = memo(function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const addToast = useUIStore(s => s.addToast);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : (product.discount ?? 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAddedToCart(true);
    addToast(product.name + ' added to cart!');
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(w => !w);
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <Link
      href={'/product/' + product.id}
      className="group relative flex flex-col h-full w-full overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50 shrink-0">
        {!imgError ? (
          <img
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
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

        {/* Badges — top left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
              NEW
            </span>
          )}
          {product.isMall && (
            <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
              MALL
            </span>
          )}
        </div>

        {/* Wishlist — top right, always visible */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm border border-gray-100 transition-all duration-150 hover:scale-110 active:scale-95"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span
            className={'material-symbols-outlined text-[16px] ' + (wishlisted ? 'text-red-500' : 'text-gray-400')}
            style={wishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            favorite
          </span>
        </button>

        {/* Add to Cart overlay — desktop hover reveal, always visible on mobile */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 md:block hidden">
          <button
            onClick={handleAddToCart}
            className={
              'w-full h-10 font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors duration-150 ' +
              (addedToCart
                ? 'bg-primary text-white'
                : 'bg-gray-900/90 backdrop-blur-sm text-white hover:bg-gray-900')
            }
          >
            <span className="material-symbols-outlined text-[16px]">
              {addedToCart ? 'check' : 'shopping_bag'}
            </span>
            {addedToCart ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-2.5 md:p-3 gap-1">
        {product.brand && (
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide truncate leading-none">
            {product.brand}
          </p>
        )}

        <h3 className="text-[13px] md:text-sm font-medium text-gray-800 line-clamp-2 leading-snug min-h-[2.4em]">
          {product.name}
        </h3>

        <StarRating rating={product.rating} count={product.reviewCount} />

        {/* Price row */}
        <div className="mt-auto pt-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-[15px] md:text-base font-bold text-gray-900 leading-none">
              ৳{product.price.toLocaleString('en-BD')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-gray-400 line-through leading-none">
                ৳{product.originalPrice.toLocaleString('en-BD')}
              </span>
            )}
          </div>
          {discount > 0 && (
            <p className="text-[11px] text-red-500 font-medium mt-0.5 leading-none">
              Save ৳{(( product.originalPrice ?? product.price) - product.price).toLocaleString('en-BD')}
            </p>
          )}
        </div>

        {/* Mobile add to cart — always visible */}
        <button
          onClick={handleAddToCart}
          className={
            'md:hidden mt-1.5 w-full h-9 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 transition-colors duration-150 ' +
            (addedToCart
              ? 'bg-primary text-white'
              : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95')
          }
        >
          <span className="material-symbols-outlined text-[14px]">
            {addedToCart ? 'check' : 'shopping_bag'}
          </span>
          {addedToCart ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
});
