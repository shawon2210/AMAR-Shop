'use client';

import { useState } from 'react';
import { FlashSaleBanner } from '@/components/commerce/flash-sale-banner';
import { ProductCard } from '@/components/commerce/product-card';
import { flashSaleProducts } from '@/lib/data/products';

const FLASH_SALE_END = '2026-06-30T23:59:59Z';

const categories = [
  'All Products',
  'Electronics',
  'Fashion',
  'Home Decor',
  'Health & Beauty',
  'Kitchen',
  'Sports',
];

export default function FlashSalePage() {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming'>('active');
  const [activeCategory, setActiveCategory] = useState('All Products');

  const filteredProducts = flashSaleProducts.filter(p => {
    if (activeCategory === 'All Products') return true;
    return p.category === activeCategory;
  });

  return (
    <>
      <FlashSaleBanner endDate={FLASH_SALE_END} />

      {/* Phase Selector Tabs */}
      <nav className="sticky top-14 z-40 bg-surface border-b border-outline-variant">
        <div className="max-w-7xl mx-auto flex">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-md border-b-2 font-label-bold text-center transition-colors ${
              activeTab === 'active'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:bg-surface-container-high'
            }`}
          >
            Happening Now
            <span className="block text-[10px] opacity-70 font-normal">Active Deals</span>
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-md border-b-2 font-label-bold text-center transition-colors ${
              activeTab === 'upcoming'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:bg-surface-container-high'
            }`}
          >
            Coming Soon
            <span className="block text-[10px] opacity-70 font-normal">Starts 12:00 PM</span>
          </button>
        </div>
      </nav>

      {/* Filter Bar */}
      <section className="bg-surface py-sm px-container-margin shadow-sm overflow-x-auto whitespace-nowrap hide-scrollbar">
        <div className="max-w-7xl mx-auto flex gap-sm">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-md py-1.5 rounded-full font-label-bold text-sm transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-container-margin py-md pb-24">
        {activeTab === 'active' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-grid-gutter">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} variant="flash-sale" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-grid-gutter">
            {filteredProducts.slice(0, 6).map(product => (
              <article
                key={product.id}
                className="bg-surface border border-outline-variant rounded-lg overflow-hidden group opacity-90"
              >
                <div className="relative aspect-square overflow-hidden filter grayscale-[0.2]">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={product.images[0]}
                    alt={product.name}
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-white/90 px-md py-1 rounded-full text-primary font-label-bold text-xs">
                      Starts at 12:00
                    </div>
                  </div>
                </div>
                <div className="p-sm space-y-1">
                  <h3 className="font-body-md text-body-md text-on-surface line-clamp-2 h-10">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="font-price-lg text-primary-container">৳{product.price.toLocaleString('en-BD')}</span>
                    <span className="text-[10px] text-secondary italic">Special Price</span>
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-1 text-[10px] font-label-bold text-secondary">
                      <span className="material-symbols-outlined text-sm">notifications</span>
                      <span>2.4k People Interested</span>
                    </div>
                  </div>
                  <button className="w-full mt-2 py-2 border-2 border-primary text-primary font-label-bold rounded-lg hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">alarm</span>
                    Remind Me
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
