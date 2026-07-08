'use client';

import Link from 'next/link';

const brands = ['Samsung', 'Apple', 'Xiaomi', 'Nike', 'Adidas', 'Unilever', 'P&G', 'LG'];

export function TopBrands() {
  return (
    <section>
      <div className="app-container">
        <div className="relative overflow-hidden rounded-[24px] border border-gray-200/50 bg-white/80 backdrop-blur-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900">Top Brands</h3>
            <Link href="/categories" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">View All</Link>
          </div>

          {/* Desktop: grid, Mobile: horizontal scroll */}
          <div className="md:grid md:grid-cols-8 gap-3 flex overflow-x-auto md:overflow-visible pb-1 md:pb-0 hide-scrollbar">
            {brands.map((brand) => (
              <Link
                key={brand}
                href="/categories"
                className="group relative overflow-hidden flex-none md:flex items-center justify-center h-10 md:h-14 min-w-[100px] md:min-w-0 rounded-2xl border border-gray-200/50 bg-white/70 backdrop-blur-xl px-4 md:px-0 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full duration-700" />
                <span className="relative font-semibold text-xs md:text-sm text-gray-700 whitespace-nowrap">
                  {brand}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
