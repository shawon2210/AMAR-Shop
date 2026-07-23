'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getFlashSaleProducts } from '@/services/products';
import { flashSaleProducts } from '@/lib/data/products';
import type { Product } from '@/types';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';

const FLASH_SALE_END = '2026-12-31T23:59:59Z';

function calcTime(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { h: '00', m: '00', s: '00' };
  return {
    h: String(Math.floor(diff / 3600000)).padStart(2, '0'),
    m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
    s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
  };
}

function useCountdown(target: string) {
  const [t, setT] = useState(() => calcTime(target));
  useEffect(() => {
    const id = setInterval(() => setT(calcTime(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-black/30 backdrop-blur-sm rounded-lg px-2.5 py-1.5 min-w-36px text-center">
        <span className="text-white font-bold text-base tabular-nums leading-none">{value}</span>
      </div>
      <span className="text-white/50 text-[9px] mt-0.5 leading-none uppercase tracking-wide">{label}</span>
    </div>
  );
}

const FlashCard = memo(function FlashCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const addToast = useUIStore(s => s.addToast);

  const sold = product.soldPercent ?? 0;
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : (product.discount ?? 0);

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    addToast(product.name + ' added to cart!');
    setTimeout(() => setAdded(false), 1500);
  }, [addItem, addToast, product]);

  const progressColor = sold >= 80 ? 'from-red-300 to-orange-200' : sold >= 50 ? 'from-orange-300 to-yellow-200' : 'from-yellow-300 to-green-200';

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-white/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50 shrink-0">
        {!imgError ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="material-symbols-outlined text-3xl text-gray-300">image</span>
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none shadow-sm">
            -{discount}%
          </span>
        )}
      </div>

      <div className="p-2.5 flex flex-col gap-1.5">
        <p className="text-gray-800 text-[12px] font-medium line-clamp-2 leading-snug" style={{ minHeight: '2.4em' }}>
          {product.name}
        </p>

        <div className="flex items-baseline gap-1.5">
          <span className="text-gray-900 font-bold text-sm leading-none">
            ৳{product.price.toLocaleString('en-BD')}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-gray-400 text-[10px] line-through leading-none">
              ৳{product.originalPrice.toLocaleString('en-BD')}
            </span>
          )}
        </div>

        {sold > 0 && (
          <div>
            <div className="flex justify-between text-[10px] text-gray-500 mb-1 leading-none">
              <span className="font-medium">{sold}% sold</span>
              <span>{100 - sold}% left</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-linear-to-br ${progressColor} rounded-full transition-all duration-500`}
                style={{ width: `${sold}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleAdd}
          className={
            'w-full h-8 rounded-lg text-[11px] font-semibold transition-all duration-150 active:scale-95 ' +
            (added
              ? 'bg-primary text-white'
              : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-100 hover:border-red-500')
          }
        >
          {added ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
});

export function FlashSaleSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const timer = useCountdown(FLASH_SALE_END);

  useEffect(() => {
    getFlashSaleProducts().then(all => {
      setProducts(all.length > 0 ? all.slice(0, 6) : flashSaleProducts.slice(0, 6));
    });
  }, []);

  return (
    <section>
      <div className="app-container">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-red-600 via-red-500 to-rose-600 p-4 md:p-5 shadow-lg">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_55%)]" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -top-8 right-1/3 w-32 h-32 rounded-full bg-white/5 blur-2xl" />

          <div className="relative z-10">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                  </span>
                  <h2 className="text-white font-bold tracking-tight" style={{ fontSize: 'clamp(15px, 1.6vw, 20px)' }}>
                    Flash Sale
                  </h2>
                </div>

                {/* Timer with labels */}
                <div className="flex items-end gap-1.5">
                  <TimeUnit value={timer.h} label="hrs" />
                  <span className="text-white/60 font-bold text-lg leading-none mb-3">:</span>
                  <TimeUnit value={timer.m} label="min" />
                  <span className="text-white/60 font-bold text-lg leading-none mb-3">:</span>
                  <TimeUnit value={timer.s} label="sec" />
                </div>
              </div>

              <Link
                href="/flash-sale"
                className="flex items-center gap-1.5 text-white/90 hover:text-white text-xs font-semibold transition-all duration-150 bg-white/15 hover:bg-white/25 rounded-xl px-3.5 py-2 border border-white/10"
              >
                See All <ArrowRight size={13} />
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
                {products.map(p => <FlashCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <span className="material-symbols-outlined text-4xl text-white/30">flash_on</span>
                <p className="text-white/50 text-sm">No flash sales right now. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
