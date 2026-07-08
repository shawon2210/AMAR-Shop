'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/commerce/product-card';

interface ProductGridProps {
  products: Product[];
  title?: string;
  columns?: 2 | 3 | 4 | 5 | 6 | 7;
  showLoadMore?: boolean;
}

const colClasses: Record<number, string> = {
  7: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 min-[1728px]:grid-cols-7',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  3: 'grid-cols-2 sm:grid-cols-3',
  2: 'grid-cols-2',
};

const ITEMS_PER_PAGE = 12;

export function ProductGrid({ products, title, columns = 4, showLoadMore = true }: ProductGridProps) {
  const [page, setPage] = useState(1);
  const visible = useMemo(() => products.slice(0, page * ITEMS_PER_PAGE), [products, page]);
  const hasMore = visible.length < products.length;

  return (
    <section>
      <div className="app-container">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 tracking-tight" style={{ fontSize: 'clamp(16px, 1.8vw, 22px)' }}>
              {title}
            </h2>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors duration-150"
            >
              See All <ArrowRight size={15} />
            </Link>
          </div>
        )}

        <div className={`grid gap-2.5 md:gap-3 lg:gap-4 ${colClasses[columns] ?? colClasses[4]}`}>
          {visible.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {showLoadMore && hasMore && (
          <button
            onClick={() => setPage(p => p + 1)}
            className="w-full mt-5 h-11 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors duration-150 text-sm"
          >
            Load More Products
          </button>
        )}
      </div>
    </section>
  );
}
