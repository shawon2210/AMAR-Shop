'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
      <div className="app-container">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-red-500 to-red-600 p-4 md:p-6 shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_45%)]" />
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5 blur-[80px]" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                  </span>
                  <h3 className="text-white text-[clamp(13px,1.5vw,16px)] font-bold">Flash Sale</h3>
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
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {displayProducts.map(product => (
                  <ProductCard key={product.id} product={product} variant="flash-sale" />
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
      </div>
    </section>
  );
}
