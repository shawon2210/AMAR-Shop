'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { PriceDisplay } from '@/components/ui/price-display';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'flash-sale' | 'compact';
}

export function ProductCard({ product, variant: _variant = 'default' }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const addToast = useUIStore(s => s.addToast);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    addToast(product.name + ' added to cart!');
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

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={'material-symbols-outlined text-xs ' + (i < full ? 'text-amber-400' : 'text-gray-300')}
            style={i < full ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            star
          </span>
        ))}
        <span className="text-xs text-gray-500 ml-1">
          {product.reviewCount > 999 ? (product.reviewCount / 1000).toFixed(1) + 'k' : product.reviewCount}
        </span>
      </div>
    );
  };

  return (
    <Link
      href={'/product/' + product.id}
      className="flex flex-col h-full w-full overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
    >
      {/* Image container */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        {!imgError ? (
          <img
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
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

        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all z-20 border border-gray-200/50"
          aria-label="Add to wishlist"
        >
          <span
            className={'material-symbols-outlined text-base ' + (wishlisted ? 'text-red-500' : 'text-gray-600')}
            style={wishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            favorite
          </span>
        </button>

        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm z-10">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-3 md:p-4">
        {product.brand && (
          <p className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider">{product.brand}</p>
        )}

        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] mt-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-1.5 mb-2">
          {renderStars(product.rating)}
        </div>

        <div className="mt-auto pt-2">
          <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />

          <button
            onClick={handleAddToCart}
            className="w-full mt-2 h-11 min-h-[44px] font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <ShoppingBag size={15} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
