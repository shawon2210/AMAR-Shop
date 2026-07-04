'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from '@/components/commerce/product-card';

interface ProductGridProps {
  products: Product[];
  title?: string;
  columns?: 2 | 3 | 4 | 5 | 6;
  showLoadMore?: boolean;
}

const columnClasses: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6',
};

export function ProductGrid({
  products,
  title,
  columns = 4,
  showLoadMore = true,
}: ProductGridProps) {
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 12;

  const visibleProducts = useMemo(() => products.slice(0, page * ITEMS_PER_PAGE), [products, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const loadMore = () => {
    setPage(page + 1);
  };

  const hasMore = visibleProducts.length < products.length;

  return (
    <section className="mt-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Header with "See All" */}
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">{title}</h3>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              See All
              <span className="material-symbols-outlined text-base">arrow_forward_ios</span>
            </Link>
          </div>
        )}

        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {visibleProducts.map((product, index) => (
            <div
              key={product.id}
              className={`h-full transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 50}ms` }}
            >
              <ProductCard product={product} variant="compact" />
            </div>
          ))}
        </div>

        {showLoadMore && hasMore && (
          <button
            onClick={loadMore}
            className="w-full mt-6 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 active:scale-[0.99] transition-all cursor-pointer text-sm"
          >
            Load More Items
          </button>
        )}
      </div>
    </section>
  );
}
