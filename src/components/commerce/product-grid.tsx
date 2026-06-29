'use client';

import { useState, useEffect, useRef } from 'react';
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
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5',
  6: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
};

export function ProductGrid({
  products,
  title,
  columns = 6,
  showLoadMore = true,
}: ProductGridProps) {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setVisibleProducts(products.slice(0, ITEMS_PER_PAGE));
  }, [products]);

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
    const nextPage = page + 1;
    setVisibleProducts(products.slice(0, nextPage * ITEMS_PER_PAGE));
    setPage(nextPage);
  };

  const hasMore = visibleProducts.length < products.length;

  return (
    <section className="mt-xl px-container-margin">
      {title && (
        <h3 className="font-headline-md text-headline-md mb-md text-on-background">{title}</h3>
      )}

      <div ref={gridRef} className={`grid ${columnClasses[columns]} gap-grid-gutter`}>
        {visibleProducts.map((product, index) => (
          <div
            key={product.id}
            className={`transition-all duration-500 ${
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
          className="w-full mt-xl py-md border-2 border-primary text-primary font-headline-md rounded-lg hover:bg-primary-fixed transition-colors cursor-pointer"
        >
          Load More Items
        </button>
      )}
    </section>
  );
}
