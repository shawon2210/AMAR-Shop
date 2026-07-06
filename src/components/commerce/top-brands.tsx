'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const brands = ['Samsung', 'Apple', 'Xiaomi', 'Nike', 'Adidas', 'Unilever', 'P&G', 'LG'];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function TopBrands() {
  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] border border-white/30 bg-white/70 backdrop-blur-xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900">Top Brands</h3>
            <Link href="/categories" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">View All</Link>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex md:grid md:grid-cols-8 gap-3 overflow-x-auto md:overflow-visible pb-1 md:pb-0 hide-scrollbar"
          >
            {brands.map((brand) => (
              <motion.div key={brand} variants={item}>
                <Link
                  href="/categories"
                  className="group relative overflow-hidden flex-none md:flex items-center justify-center h-12 md:h-14 min-w-[110px] md:min-w-0 rounded-2xl border border-white/20 bg-white/70 backdrop-blur-xl px-5 md:px-0 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full duration-700" />
                  <span className="relative font-semibold text-xs md:text-sm text-gray-700 whitespace-nowrap">
                    {brand}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
