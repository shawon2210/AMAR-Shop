'use client';

import Link from 'next/link';
import { memo, useRef, useEffect, useState } from 'react';
import { brandData, type BrandInfo } from './brand-logos';

const VISIBLE_COUNT = { desktop: 8, tablet: 6, mobile: 4 };

const BrandCard = memo(function BrandCard({ brand }: { brand: BrandInfo }) {
  return (
    <Link
      href={`/brand/${brand.slug}`}
      className="group flex flex-col items-center gap-2.5 p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-180 bg-white"
    >
      <div className={`w-14 h-14 rounded-2xl ${brand.bg} ring-4 ${brand.ring} flex items-center justify-center transition-all duration-180 group-hover:scale-105 group-hover:shadow-lg`}>
        <div className="flex items-center justify-center w-7 h-7">
          <brand.logo className="w-full h-full text-white" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-[12px] font-bold text-gray-800 group-hover:text-primary transition-colors duration-150 leading-tight">
          {brand.name}
        </p>
        <p className="text-[10px] text-gray-400 leading-none mt-0.5">{brand.tagline}</p>
      </div>
    </Link>
  );
});

/**
 * Responsive brand carousel with auto-scroll and pause-on-hover.
 * Desktop: 8 visible, Tablet: 6, Mobile: 4
 */
function BrandCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [visibleCount, setVisibleCount] = useState(VISIBLE_COUNT.desktop);

  useEffect(() => {
    const mq = (w: number) => {
      if (w >= 1024) return VISIBLE_COUNT.desktop;
      if (w >= 640) return VISIBLE_COUNT.tablet;
      return VISIBLE_COUNT.mobile;
    };
    const handler = () => setVisibleCount(mq(window.innerWidth));
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Auto-scroll every 3s, pause on hover
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const cardW = 80 + 10; // min-w + gap
      const step = cardW * visibleCount;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, visibleCount]);

  return (
    <div
      ref={scrollRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
      className="flex gap-2.5 overflow-x-auto hide-scrollbar scroll-smooth pb-0.5"
      style={{
        marginLeft: 'calc(var(--container-padding) * -1)',
        marginRight: 'calc(var(--container-padding) * -1)',
        paddingLeft: 'var(--container-padding)',
        paddingRight: 'var(--container-padding)',
      }}
    >
      {/* Duplicate brands for seamless infinite scroll illusion */}
      {[...brandData, ...brandData].map((b, i) => (
        <Link
          key={`${b.slug}-${i}`}
          href={`/brand/${b.slug}`}
          className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 min-w-[80px] max-w-[80px] hover:border-gray-200 transition-all duration-180 bg-white hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 shrink-0"
        >
          <div className={`w-12 h-12 rounded-xl ${b.bg} flex items-center justify-center transition-transform duration-180 group-hover:scale-105`}>
            <div className="flex items-center justify-center w-6 h-6">
              <b.logo className="w-full h-full text-white" />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-gray-700 truncate w-full text-center leading-tight">{b.name}</span>
        </Link>
      ))}
    </div>
  );
}

export const TopBrands = memo(function TopBrands() {
  return (
    <section>
      <div className="app-container">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-gray-900 tracking-tight" style={{ fontSize: 'clamp(15px, 1.6vw, 20px)' }}>
                Top Brands
              </h2>
              <span className="hidden sm:inline-flex items-center h-5 px-2 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                Official Stores
              </span>
            </div>
            <Link href="/categories" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors duration-150 flex items-center gap-0.5">
              View All
              <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            </Link>
          </div>

          {/* Desktop: 8-col grid */}
          <div className="hidden sm:grid grid-cols-4 md:grid-cols-8 gap-2.5">
            {brandData.map(b => <BrandCard key={b.slug} brand={b} />)}
          </div>

          {/* Mobile/Tablet: auto-scroll carousel */}
          <div className="sm:hidden">
            <BrandCarousel />
          </div>
        </div>
      </div>
    </section>
  );
});