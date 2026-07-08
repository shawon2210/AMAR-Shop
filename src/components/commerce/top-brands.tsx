'use client';

import Link from 'next/link';

const brands = [
  {
    name: 'Samsung',
    initial: 'S',
    bg: 'bg-blue-600',
    text: 'text-white',
    ring: 'ring-blue-100',
    tagline: 'Electronics',
  },
  {
    name: 'Apple',
    initial: '',
    bg: 'bg-gray-900',
    text: 'text-white',
    ring: 'ring-gray-100',
    tagline: 'Premium Tech',
    icon: true,
  },
  {
    name: 'Xiaomi',
    initial: 'Mi',
    bg: 'bg-orange-500',
    text: 'text-white',
    ring: 'ring-orange-100',
    tagline: 'Smart Devices',
  },
  {
    name: 'Walton',
    initial: 'W',
    bg: 'bg-red-600',
    text: 'text-white',
    ring: 'ring-red-100',
    tagline: 'Local Brand',
  },
  {
    name: 'Asus',
    initial: 'A',
    bg: 'bg-blue-700',
    text: 'text-white',
    ring: 'ring-blue-100',
    tagline: 'Computing',
  },
  {
    name: 'Lenovo',
    initial: 'L',
    bg: 'bg-red-700',
    text: 'text-white',
    ring: 'ring-red-100',
    tagline: 'Laptops',
  },
  {
    name: 'Nike',
    initial: '✓',
    bg: 'bg-gray-900',
    text: 'text-white',
    ring: 'ring-gray-100',
    tagline: 'Sportswear',
  },
  {
    name: 'Adidas',
    initial: '⊞',
    bg: 'bg-black',
    text: 'text-white',
    ring: 'ring-gray-100',
    tagline: 'Lifestyle',
  },
];

function BrandCard({ brand }: { brand: typeof brands[0] }) {
  return (
    <Link
      href="/categories"
      className="group flex flex-col items-center gap-2.5 p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 bg-white hover:-translate-y-0.5"
    >
      <div className={`w-14 h-14 rounded-2xl ${brand.bg} ring-4 ${brand.ring} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
        {brand.icon ? (
          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        ) : (
          <span className="text-lg font-black tracking-tight" style={{ color: 'white' }}>{brand.initial}</span>
        )}
      </div>
      <div className="text-center">
        <p className="text-[12px] font-bold text-gray-800 group-hover:text-primary transition-colors duration-150 leading-tight">
          {brand.name}
        </p>
        <p className="text-[10px] text-gray-400 leading-none mt-0.5">{brand.tagline}</p>
      </div>
    </Link>
  );
}

export function TopBrands() {
  return (
    <section>
      <div className="app-container">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-gray-900 tracking-tight" style={{ fontSize: 'clamp(15px, 1.6vw, 20px)' }}>
                Top Brands
              </h2>
              <span className="hidden sm:inline-flex items-center h-5 px-2 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                Official Stores
              </span>
            </div>
            <Link href="/categories" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors duration-150 flex items-center gap-0.5">
              View All
              <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            </Link>
          </div>

          {/* Desktop: 8-col grid */}
          <div className="hidden sm:grid grid-cols-4 md:grid-cols-8 gap-2.5">
            {brands.map(b => <BrandCard key={b.name} brand={b} />)}
          </div>

          {/* Mobile: horizontal scroll */}
          <div
            className="sm:hidden overflow-x-auto hide-scrollbar"
            style={{
              marginLeft: 'calc(var(--container-padding) * -1)',
              marginRight: 'calc(var(--container-padding) * -1)',
              paddingLeft: 'var(--container-padding)',
              paddingRight: 'var(--container-padding)',
            }}
          >
            <div className="flex gap-2.5 w-max pb-0.5">
              {brands.map(b => (
                <Link
                  key={b.name}
                  href="/categories"
                  className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 min-w-[80px] hover:border-gray-200 transition-all duration-150 bg-white"
                >
                  <div className={`w-12 h-12 rounded-xl ${b.bg} flex items-center justify-center`}>
                    {b.icon ? (
                      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                    ) : (
                      <span className="text-base font-black" style={{ color: 'white' }}>{b.initial}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-700 truncate w-full text-center">{b.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
