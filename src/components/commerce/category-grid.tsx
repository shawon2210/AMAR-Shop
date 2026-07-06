'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { categories } from '@/lib/data/categories';
import { staggerContainer, cardItem } from '@/lib/motion-variants';

export function CategoryGrid() {
  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[28px] border border-white/30 bg-white/70 backdrop-blur-xl p-5 md:p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900">Shop by Category</h3>
            <Link
              href="/categories"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View All
              <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </Link>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3"
          >
            {categories.map(cat => (
              <motion.div key={cat.id} variants={cardItem}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-white/80 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary group-hover:from-primary group-hover:to-primary-dark group-hover:text-white group-hover:shadow-md transition-all duration-300"
                  >
                    <span className="material-symbols-outlined text-xl sm:text-2xl">{cat.icon}</span>
                  </motion.div>
                  <span className="text-[10px] sm:text-[11px] md:text-xs font-medium text-gray-700 group-hover:text-primary text-center leading-tight line-clamp-1">
                    {cat.name}
                  </span>
                  <span className="inline-flex items-center text-[10px] font-medium text-gray-400 bg-gray-100/80 px-2 py-0.5 rounded-full">
                    {cat.productCount > 999 ? `${(cat.productCount / 1000).toFixed(0)}k+` : `${cat.productCount}`}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
