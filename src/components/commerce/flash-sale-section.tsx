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
    <section className="mt-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>flash_on</span>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Flash Sale</h3>
              </div>
              <div className="hidden sm:block">
                <CountdownTimer targetDate={FLASH_SALE_END} />
              </div>
              {/* Mobile timer */}
              <div className="sm:hidden flex items-center gap-1 bg-primary/10 rounded-lg px-2 py-1">
                <span className="material-symbols-outlined text-sm text-primary">timer</span>
                <CountdownTimer targetDate={FLASH_SALE_END} />
              </div>
            </div>
            <Link
              href="/flash-sale"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              See All
              <span className="material-symbols-outlined text-base">arrow_forward_ios</span>
            </Link>
          </div>

          {/* "Ending Soon" banner */}
          <div className="flex items-center gap-2 mb-4 bg-gradient-to-r from-primary/5 to-primary-fixed/10 rounded-xl px-4 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-xs md:text-sm font-medium text-primary">Ending soon — Limited stock available!</span>
          </div>

          {/* Products carousel with scroll buttons */}
          {displayProducts.length > 0 ? (
            <div className="relative group/carousel">
              {/* Left scroll button */}
              <button
                onClick={() => scroll('left')}
                className="absolute -left-2 md:-left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 opacity-0 group-hover/carousel:opacity-100 hover:bg-gray-50 hover:text-primary transition-all"
                aria-label="Scroll left"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>

              <div
                ref={scrollRef}
                className="overflow-x-auto hide-scrollbar"
              >
                <div className="flex gap-3 md:gap-4 pb-2">
                  {displayProducts.map(product => (
                    <div key={product.id} className="min-w-[180px] md:min-w-[220px]">
                      <ProductCard product={product} variant="flash-sale" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right scroll button */}
              <button
                onClick={() => scroll('right')}
                className="absolute -right-2 md:-right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 opacity-0 group-hover/carousel:opacity-100 hover:bg-gray-50 hover:text-primary transition-all"
                aria-label="Scroll right"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl text-gray-300">flash_on</span>
                <p className="text-sm text-gray-400 mt-2">No flash sales available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}