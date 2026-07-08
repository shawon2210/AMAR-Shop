'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function SellerCta() {
  return (
    <section>
      <div className="app-container">
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 px-6 py-7 md:px-10 md:py-9 shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute right-16 top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl hidden md:block" />
          <div className="absolute left-8 bottom-0 h-32 w-32 rounded-full bg-lime-300/10 blur-3xl hidden md:block" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
              <span className="material-symbols-outlined text-3xl md:text-4xl">storefront</span>
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-white">Start Selling on AmarShop</h3>
              <p className="text-sm md:text-base text-white/80 mt-1">Reach millions of customers across Bangladesh. Zero listing fees.</p>
            </div>
            <Link
              href="/seller/dashboard"
              className="inline-flex items-center gap-2 h-11 md:h-14 px-6 md:px-8 rounded-full bg-white font-semibold text-emerald-700 shadow-xl hover:bg-emerald-50 transition-colors"
            >
              Join Free
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
