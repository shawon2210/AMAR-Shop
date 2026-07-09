'use client';

import { motion } from 'framer-motion';
import { useRecentlyViewedStore } from '@/stores/recently-viewed-store';
import { ProductCardEnhanced } from '@/components/commerce/product-card-enhanced';
import { staggerContainer, cardItem } from '@/lib/motion-variants';
import { Clock, Trash2 } from 'lucide-react';

export function RecentlyViewed() {
  const items = useRecentlyViewedStore(s => s.items);
  const clearItems = useRecentlyViewedStore(s => s.clearItems);

  if (items.length === 0) return null;

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      className="app-container"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Recently Viewed</h2>
        </div>
        <button
          onClick={clearItems}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Clear recently viewed"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {items.slice(0, 6).map((product, i) => (
          <motion.div key={product.id} variants={cardItem} custom={i}>
            <ProductCardEnhanced product={product} recentlyViewed />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}