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
      whileHover={{ y: -4 }}
      transition={{ duration: designTokens.animation.duration.hover, ease: designTokens.animation.easing.default }}
      className="h-full"
    >
      <Link
        href={'/product/' + product.id}
        className={`bg-surface rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col h-full border hover:border-border-dark hover:shadow-lg ${isFlashVariant ? 'border-border' : 'border-border'}`}
      >
        <div className="relative h-48 w-full overflow-hidden bg-surface-container">
          {!imgError ? (
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover"
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
            className="absolute top-md right-md w-9 h-9 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-surface transition-all z-10"
            aria-label="Add to wishlist"
          >
            <span
              className={'material-symbols-outlined text-lg ' + (wishlisted ? 'text-error' : 'text-text-tertiary')}
              style={wishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              favorite
            </span>
          </button>

          {discount > 0 && (
            <div className={'absolute top-md left-md ' + (isFlashVariant ? 'bg-error' : 'bg-primary') + ' text-on-primary text-xs font-bold px-sm py-xs rounded-lg'}>
              -{discount}%
            </div>
          )}
        </div>

        <div className="p-md flex flex-col flex-grow gap-sm">
          {product.brand && (
            <p className="text-xs text-text-tertiary font-medium truncate uppercase tracking-wide">{product.brand}</p>
          )}

          <h3 className="text-sm font-medium text-text-primary line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <div className="flex items-center gap-sm">
            {renderStars(product.rating)}
          </div>

          <div className="mt-auto">
            <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />
          </div>

          {isFlashVariant && product.soldPercent !== undefined && (
            <div className="space-y-xs pt-sm">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-secondary">{product.soldPercent}% Sold</span>
                {product.stockCount < 20 && (
                  <span className="text-error">{product.stockCount} left</span>
                )}
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: product.soldPercent + '%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={'h-full rounded-full ' + (product.soldPercent >= 80 ? 'bg-error' : 'bg-primary')}
                />
              </div>
            </div>
          )}

          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
            className={`w-full mt-sm min-h-[44px] py-md font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-sm ${isFlashVariant ? 'bg-error text-on-error hover:bg-error-dark' : 'bg-primary text-on-primary hover:bg-primary-dark'}`}
          >
            <ShoppingBag size={16} />
            {isFlashVariant ? 'Grab Now' : 'Add to Cart'}
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
}
