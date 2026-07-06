'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/commerce/product-card';
import { staggerContainer, cardItem } from '@/lib/motion-variants';

interface ProductGridProps {
  products: Product[];
  title?: string;
  columns?: 2 | 3 | 4 | 5 | 6;
  showLoadMore?: boolean;
}

const columnClasses: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
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
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-4"
          >
            <h3 className="text-base md:text-lg font-bold text-gray-900">{title}</h3>
            <Link
              href="/categories"
              className="group flex items-center gap-1 text-xs md:text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              See All
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        )}

        <motion.div
          ref={gridRef}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className={`grid ${columnClasses[columns]} gap-4`}
        >
          {visibleProducts.map((product) => (
            <motion.div key={product.id} variants={cardItem} className="h-full">
              <ProductCard product={product} variant="compact" />
            </motion.div>
          ))}
        </motion.div>

        {showLoadMore && hasMore && (
          <motion.button
            onClick={loadMore}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full mt-6 min-h-[44px] py-3 sm:py-2.5 sm:min-h-0 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 active:scale-[0.99] transition-all cursor-pointer text-xs"
          >
            Load More
          </motion.button>
        )}
      </div>
    </section>
  );
}
