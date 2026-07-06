'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { designTokens } from '@/lib/designTokens';
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

  const isFlashVariant = variant === 'flash-sale';

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={'material-symbols-outlined text-xs ' + (i < full ? 'text-amber-400' : 'text-text-tertiary')}
            style={i < full ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            star
          </span>
        ))}
        <span className="text-xs text-text-secondary ml-1">
          {product.reviewCount > 999 ? (product.reviewCount / 1000).toFixed(1) + 'k' : product.reviewCount}
        </span>
      </div>
    );
  };

  return (
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex flex-col h-full w-full"
      >
        <Link
          href={'/product/' + product.id}
          className="flex flex-col h-full w-full overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950 transition-all duration-300 hover:shadow-xl group"
        >
          {/* Media Element */}
          <div className="relative w-full aspect-square overflow-hidden bg-slate-50">
            {!imgError ? (
              <img
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-dim text-text-tertiary">
                <span className="material-symbols-outlined text-4xl">image</span>
              </div>
            )}
            
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all z-10"
              aria-label="Add to wishlist"
            >
              <span
                className={'material-symbols-outlined text-lg ' + (wishlisted ? 'text-error' : 'text-slate-400')}
                style={wishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                favorite
              </span>
            </button>

            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                -{discount}%
              </div>
            )}
          </div>

          {/* Text Controls & Footer Wrapper */}
          <div className="flex-1 flex flex-col p-4">
            {product.brand && (
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{product.brand}</p>
            )}

            <h3 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2 min-h-[2.5rem] mt-1">
              {product.name}
            </h3>

            <div className="flex items-center gap-1 mt-2 mb-3">
              {renderStars(product.rating)}
            </div>

            {/* Action Elements & Pricing Footer */}
            <div className="mt-auto pt-2">
              <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />
              
              <button
                onClick={handleAddToCart}
                className="w-full mt-3 h-10 font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
  );
}
