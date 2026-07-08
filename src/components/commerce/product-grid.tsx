'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
};

export function ProductGrid({
  products,
  title,
  columns = 4,
  showLoadMore = true,
}: ProductGridProps) {
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 12;

  const visibleProducts = useMemo(() => products.slice(0, page * ITEMS_PER_PAGE), [products, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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

  const loadMore = () => setPage(page + 1);
  const hasMore = visibleProducts.length < products.length;

  return (
    <section>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {title && (
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-all"
            >
              See All
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        <div
          ref={gridRef}
          className={`grid gap-3 md:gap-4 xl:gap-6 ${columnClasses[columns] || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}
        >
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="default" />
          ))}
        </div>

        {showLoadMore && hasMore && (
          <button
            onClick={loadMore}
            className="w-full mt-6 min-h-[48px] py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-all text-sm"
          >
            Load More Products
          </button>
        )}
      </div>
    </section>
  );
}
