'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { staggerContainer, cardItem, fastTransition } from '@/lib/motion-variants';
import { Footer as NewFooter } from './footer/Footer';

const trustItems = [
  { icon: 'lock', title: 'Secure Payment', desc: 'SSL encrypted. bKash, Nagad, COD & cards' },
  { icon: 'local_shipping', title: 'Nationwide Delivery', desc: 'Free shipping over \u09F3999. 64 districts' },
  { icon: 'assignment_return', title: 'Easy Returns', desc: '7-day return & exchange. No questions' },
  { icon: 'verified', title: 'Verified Sellers', desc: '100% authentic products. Brand warranty' },
];

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 md:mt-16">

      {/* ───── Trust Section ───── */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
          >
            {trustItems.map((item) => (
              <motion.div
                key={item.title}
                variants={cardItem}
                className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 flex items-start gap-3 hover:border-primary/20 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl md:text-2xl">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 mb-0.5">{item.title}</h4>
                  <p className="text-xs md:text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ───── Newsletter ───── */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-700 px-6 sm:px-8 lg:px-12 py-8 lg:py-10 shadow-lg hover:shadow-[0_30px_80px_rgba(16,185,129,0.35)] transition-shadow duration-500"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_45%)]" />

            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-white/10 blur-[90px]" />
            <div className="absolute -bottom-16 -left-12 w-40 h-40 rounded-full bg-lime-200/10 blur-[90px]" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
              <div className="text-center lg:text-left">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-xs font-medium text-emerald-50 backdrop-blur-md">
                  ✨ Stay Updated
                </span>
                <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-white">
                  Stay in the Loop
                </h2>
                <p className="mt-1.5 text-sm sm:text-base leading-7 text-emerald-100 max-w-md">
                  Exclusive deals, launches & offers.
                </p>
              </div>

              <div className="w-full lg:w-auto shrink-0">
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 min-w-[240px]">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200" size={18} />
                    <input
                      type="email"
                      placeholder="Email address"
                      className="h-14 w-full rounded-full border border-white/15 bg-white/10 pl-12 pr-4 text-white text-sm placeholder:text-emerald-100/70 outline-none backdrop-blur-xl transition-all duration-300 focus:ring-4 focus:ring-white/20 focus:border-white/40"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.04, y: -2 }}
                    className="group relative overflow-hidden h-14 rounded-full bg-white px-7 font-semibold text-emerald-700 shadow-lg whitespace-nowrap transition-all duration-300 hover:bg-emerald-50 hover:shadow-emerald-500/25"
                  >
                    <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
                    <span className="relative flex items-center gap-2">
                      Subscribe
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </motion.button>
                </form>
                <p className="mt-3 text-xs text-emerald-100/70 text-center lg:text-left">
                  No spam &bull; Unsubscribe anytime &bull; Privacy respected
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ───── Main Grid + Bottom (modular) ───── */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 lg:px-16 py-8 md:py-12 lg:py-16">
          <NewFooter />
        </div>
      </div>

    </footer>
  );
}

export { Footer };
