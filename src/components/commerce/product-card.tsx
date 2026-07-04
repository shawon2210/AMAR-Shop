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
      className={`bg-white rounded-xl overflow-hidden group hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex flex-col h-full ${
        isFlashVariant ? 'border border-gray-100' : 'border border-gray-200'
      }`}
    >
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

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 hover:bg-white transition-all"
        >
          <span
            className={`material-symbols-outlined text-lg ${wishlisted ? 'text-red-500' : 'text-gray-400'}`}
            style={wishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            favorite
          </span>
        </button>

        {/* Discount badge */}
        {discount > 0 && (
          <div className={`absolute top-2 left-2 ${isFlashVariant ? 'bg-red-500' : 'bg-primary'} text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md flex flex-col items-center leading-tight`}>
            <span>-{discount}%</span>
            <span className="text-[7px] md:text-[8px] font-normal opacity-90">OFF</span>
          </div>
        )}

        {/* Mall badge */}
        {product.isMall && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase shadow-sm">Mall</div>
        )}

        {/* Seller overlay */}
        {product.seller?.isOfficial && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            {product.seller.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2 md:p-3 flex flex-col flex-grow">
        {/* Brand */}
        {product.brand && (
          <p className="text-[10px] md:text-[11px] text-gray-400 font-medium mb-0.5">{product.brand}</p>
        )}

        {/* Title */}
        <div className="flex-grow">
          <h3 className="text-[12px] md:text-[13px] font-medium text-gray-800 line-clamp-2 leading-snug mb-1">
            {product.name}
          </h3>
        </div>

        {/* Rating + Sales */}
        <div className="flex items-center gap-2 mb-1">
          {renderStars(product.rating)}
          {product.reviewCount > 90 && (
            <span className="text-[9px] md:text-[10px] text-green-600 font-medium whitespace-nowrap">
              Top Rated
            </span>
          )}
        </div>

        {/* Price */}
        <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />

        {/* Savings */}
        {savings > 0 && (
          <p className="text-[9px] md:text-[10px] text-red-500 font-medium mt-0.5">
            Save ৳{savings.toLocaleString('en-BD')}
          </p>
        )}

        {/* Flash sale progress */}
        {isFlashVariant && product.soldPercent !== undefined && (
          <div className="space-y-1 mt-1.5">
            <div className="flex justify-between text-[9px] md:text-[10px] font-semibold">
              <span className="text-gray-500">{product.soldPercent}% Sold</span>
              <span className="text-red-500">
                {product.stockCount < 20 ? `Only ${product.stockCount} left` : ''}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  product.soldPercent >= 80 ? 'bg-red-500' : 'bg-primary'
                }`}
                style={{ width: `${product.soldPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags row */}
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {product.freeShipping && (
            <span className="text-[8px] md:text-[9px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Free shipping</span>
          )}
          {product.isMall && (
            <span className="text-[8px] md:text-[9px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Mall</span>
          )}
          {product.isNew && (
            <span className="text-[8px] md:text-[9px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">New</span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          className={`w-full mt-2 py-2 md:py-2.5 font-semibold rounded-lg active:scale-[0.97] transition-all text-[11px] md:text-sm ${
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
