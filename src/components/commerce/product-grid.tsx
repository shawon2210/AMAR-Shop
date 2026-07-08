'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
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
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
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
    <section className="py-xl">
      <div className="max-w-7xl mx-auto px-container">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-md"
          >
            <h3 className="text-xl font-bold text-text-primary tracking-tight">{title}</h3>
            <Link
              href="/categories"
              className="group flex items-center gap-sm text-sm font-semibold text-primary hover:text-primary-dark transition-all"
            >
              See All
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}

        <motion.div
          ref={gridRef}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className={`grid gap-4 gap-y-8 xl:gap-6 ${columnClasses[columns] || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}
        >
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="default" />
          ))}
        </motion.div>

        {showLoadMore && hasMore && (
          <motion.button
            onClick={loadMore}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full mt-lg min-h-[48px] py-md border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary-container transition-all text-sm"
          >
            Load More Products
          </motion.button>
        )}
      </div>
    </section>
  );
}
