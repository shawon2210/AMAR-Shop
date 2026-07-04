'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { ProductCard } from '@/components/commerce/product-card';
import { getFlashSaleProducts } from '@/services/products';
import { flashSaleProducts } from '@/lib/data/products';
import type { Product } from '@/types';

const FLASH_SALE_END = '2026-06-30T23:59:59Z';

export function FlashSaleSection() {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFlashSaleProducts().then(all => {
      setDisplayProducts(all.length > 0 ? all.slice(0, 8) : flashSaleProducts.slice(0, 8));
    });
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-5 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <h3 className="text-white text-sm md:text-base lg:text-lg font-bold">Flash Sale</h3>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-0.5">
                <CountdownTimer targetDate={FLASH_SALE_END} variant="flash-sale" />
              </div>
            </div>
            <Link
              href="/flash-sale"
              className="flex items-center gap-1 text-white/90 hover:text-white text-xs md:text-sm font-semibold transition-colors bg-white/15 hover:bg-white/25 rounded-lg px-3 py-1.5"
            >
              See All
              <span className="material-symbols-outlined text-base">arrow_forward_ios</span>
            </Link>
          </div>

          {/* Products carousel */}
          {displayProducts.length > 0 ? (
            <div className="relative group/carousel">
              <button
                onClick={() => scroll('left')}
                className="absolute -left-2 md:-left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 opacity-80 md:opacity-0 md:group-hover/carousel:opacity-100 hover:bg-gray-50 hover:text-primary transition-all"
                aria-label="Scroll left"
              >
                <span className="material-symbols-outlined text-base md:text-lg">chevron_left</span>
              </button>

              <div ref={scrollRef} className="overflow-x-auto hide-scrollbar -mx-1 px-1">
                <div className="flex gap-2 sm:gap-3 pb-1">
                  {displayProducts.map(product => (
                    <div key={product.id} className="min-w-[130px] sm:min-w-[150px] md:min-w-[170px] lg:min-w-[190px]">
                      <ProductCard product={product} variant="flash-sale" />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => scroll('right')}
                className="absolute -right-2 md:-right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 opacity-80 md:opacity-0 md:group-hover/carousel:opacity-100 hover:bg-gray-50 hover:text-primary transition-all"
                aria-label="Scroll right"
              >
                <span className="material-symbols-outlined text-base md:text-lg">chevron_right</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl text-white/50">flash_on</span>
                <p className="text-sm text-white/60 mt-2">No flash sales available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
