'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { ProductCard } from '@/components/commerce/product-card';
import { getFlashSaleProducts } from '@/services/products';
import { flashSaleProducts } from '@/lib/data/products';
import type { Product } from '@/types';

const FLASH_SALE_END = '2026-06-30T23:59:59Z';

export function FlashSaleSection() {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);

  useEffect(() => {
    getFlashSaleProducts().then(all => {
      setDisplayProducts(all.length > 0 ? all.slice(0, 6) : flashSaleProducts.slice(0, 6));
    });
  }, []);

  return (
    <section>
      <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <h3 className="text-white text-sm md:text-base font-bold">Flash Sale</h3>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-0.5">
                <CountdownTimer targetDate={FLASH_SALE_END} variant="flash-sale" />
              </div>
            </div>
            <Link
              href="/flash-sale"
              className="flex items-center gap-1 text-white/90 hover:text-white text-xs font-semibold transition-colors bg-white/15 hover:bg-white/25 rounded-lg px-3 py-1.5"
            >
              See All
              <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </Link>
          </div>

          {/* Grid layout */}
          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {displayProducts.map(product => (
                <div key={product.id} className="h-[280px]">
                  <ProductCard product={product} variant="flash-sale" />
                </div>
              ))}
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
