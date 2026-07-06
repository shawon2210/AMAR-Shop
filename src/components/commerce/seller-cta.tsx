'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function SellerCta() {
  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 px-6 py-8 md:px-10 md:py-9 shadow-lg"
        >
          {/* Animated orbs */}
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
            className="absolute right-16 top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl hidden md:block"
          />
          <motion.div
            animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
            className="absolute left-8 bottom-0 h-32 w-32 rounded-full bg-lime-300/10 blur-3xl hidden md:block"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm"
            >
              <span className="material-symbols-outlined text-3xl md:text-4xl">storefront</span>
            </motion.div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-white">Start Selling on AmarShop</h3>
              <p className="text-sm md:text-base text-white/80 mt-1">Reach millions of customers across Bangladesh. Zero listing fees.</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/seller/dashboard"
                className="group inline-flex items-center gap-2 h-12 md:h-14 px-7 md:px-8 rounded-full bg-white font-semibold text-emerald-700 shadow-xl hover:bg-emerald-50 transition-colors"
              >
                Join Free
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
