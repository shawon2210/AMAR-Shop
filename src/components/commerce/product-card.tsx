'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
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
  const cardRef = useRef<HTMLDivElement>(null);

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
            className={'material-symbols-outlined text-[10px] ' + (i < full ? 'text-amber-400' : 'text-gray-200')}
            style={i < full ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            star
          </span>
        ))}
        <span className="text-[10px] text-gray-500 ml-0.5">
          {product.reviewCount > 999 ? (product.reviewCount / 1000).toFixed(1) + 'k' : product.reviewCount}
        </span>
      </div>
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 12;
    const rotateY = (centerX - x) / 12;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02,1.02,1.02)';
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  };

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
    >
      <Link
        href={'/product/' + product.id}
        className={'bg-white rounded-2xl overflow-hidden group transition-all duration-300 ease-out flex flex-col h-full border hover:border-gray-300 hover:shadow-xl ' + (isFlashVariant ? 'border-gray-100' : 'border-gray-200')}
      >
        <div className="relative h-36 sm:h-40 md:h-44 w-full overflow-hidden bg-gray-50">
          {!imgError ? (
            <motion.img
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover"
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

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute top-1.5 right-1.5 z-10">
            <button
              onClick={handleWishlist}
              className="w-9 h-9 lg:w-8 lg:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
              aria-label="Add to wishlist"
            >
              <span
                className={'material-symbols-outlined text-base ' + (wishlisted ? 'text-red-500' : 'text-gray-400')}
                style={wishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                favorite
              </span>
            </button>
          </motion.div>

          {discount > 0 && (
            <div className={'absolute top-1.5 left-1.5 ' + (isFlashVariant ? 'bg-red-500' : 'bg-primary') + ' text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-tight'}>
              -{discount}%
            </div>
          )}

          {product.seller?.isOfficial && (
            <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              {product.seller.name}
            </div>
          )}
        </div>

        <div className="p-3 flex flex-col flex-grow gap-1">
          {product.brand && (
            <p className="text-[10px] text-gray-400 font-medium truncate">{product.brand}</p>
          )}

          <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5">
            {renderStars(product.rating)}
          </div>

          <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />

          {isFlashVariant && product.soldPercent !== undefined && (
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] font-semibold">
                <span className="text-gray-500">{product.soldPercent}% Sold</span>
                {product.stockCount < 20 && (
                  <span className="text-red-500">{product.stockCount} left</span>
                )}
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: product.soldPercent + '%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={'h-full rounded-full ' + (product.soldPercent >= 80 ? 'bg-red-500' : 'bg-primary')}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 flex-wrap">
            {product.freeShipping && (
              <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Free shipping</span>
            )}
            {(product.isMall || product.isNew) && (
              <span className={'text-[10px] font-semibold px-1.5 py-0.5 rounded ' + (product.isMall ? 'text-blue-600 bg-blue-50' : 'text-primary bg-primary/10')}>
                {product.isMall ? 'Mall' : 'New'}
              </span>
            )}
          </div>

          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={'w-full mt-auto min-h-[44px] py-2.5 sm:min-h-0 sm:h-9 sm:py-0 font-semibold rounded-lg transition-all text-xs sm:text-xs ' + (isFlashVariant ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-primary text-white hover:bg-primary-dark')}
          >
            <span className="flex items-center justify-center gap-1.5">
              <ShoppingBag size={14} />
              {isFlashVariant ? 'Grab Now' : 'Add to Cart'}
            </span>
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
}
