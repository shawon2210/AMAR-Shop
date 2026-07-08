'use client';

import { useMemo, useState } from 'react';
import { FlashSaleBanner } from '@/components/commerce/flash-sale-banner';
import { ProductCard } from '@/components/commerce/product-card';
import { flashSaleProducts } from '@/lib/data/products';

const FLASH_SALE_END = '2026-06-30T23:59:59Z';

type TabType = 'active' | 'upcoming';

interface TabProps {
  active: TabType;
  type: TabType;
  title: string;
  subtitle: string;
  onClick: () => void;
}

interface CategoryFilterProps {
  categories: readonly string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  'All Products',
  'Electronics',
  'Fashion',
  'Home Decor',
  'Health & Beauty',
  'Kitchen',
  'Sports',
] as const;

// Extracted tab component to eliminate duplication
const PhaseTab = ({ active, type, title, subtitle, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={`flex-1 py-md border-b-2 font-label-bold text-center transition-colors ${
      active === type
        ? 'border-primary text-primary'
        : 'border-transparent text-secondary hover:bg-surface-container-high'
    }`}
    type="button"
  >
    {title}
    <span className="block text-[10px] opacity-70 font-normal">{subtitle}</span>
  </button>
);

// Extracted category filter component
const CategoryFilter = ({ categories: cats, activeCategory, onCategoryChange }: CategoryFilterProps) => (
  <section className="bg-surface py-sm px-container-margin shadow-sm overflow-x-auto whitespace-nowrap hide-scrollbar">
    <div className="max-w-7xl mx-auto flex gap-sm">
      {cats.map(cat => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-md py-1.5 rounded-full font-label-bold text-sm transition-colors whitespace-nowrap ${
            activeCategory === cat
              ? 'bg-primary text-white'
              : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
          }`}
          type="button"
        >
          {cat}
        </button>
      ))}
    </div>
  </section>
);

// Extracted upcoming product card component
const UpcomingProductCard = ({ product }: { product: (typeof flashSaleProducts)[number] }) => {
  const interestText = '2.4k People Interested';

  return (
    <article
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
          <span className="font-price-lg text-primary-container">
            ৳{product.price.toLocaleString('en-BD')}
          </span>
          <span className="text-[10px] text-secondary italic">Special Price</span>
        </div>
        <div className="pt-1">
          <div className="flex items-center gap-1 text-[10px] font-label-bold text-secondary">
            <span className="material-symbols-outlined text-sm">notifications</span>
            <span>{interestText}</span>
          </div>
        </div>
        <button className="w-full mt-2 py-2 border-2 border-primary text-primary font-label-bold rounded-lg hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[18px]">alarm</span>
          Remind Me
        </button>
      </div>
    </article>
  );
};

export default function FlashSalePage() {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [activeCategory, setActiveCategory] = useState<string>('All Products');

  // Memoized filtering to avoid recalculating on every render
  const filteredProducts = useMemo(() =>
    flashSaleProducts.filter(p =>
      activeCategory === 'All Products' || p.category === activeCategory
    ),
    [activeCategory]
  );

  const upcomingProducts = useMemo(
    () => filteredProducts.slice(0, 6),
    [filteredProducts]
  );

  return (
    <>
      <FlashSaleBanner endDate={FLASH_SALE_END} />

      {/* Phase Selector Tabs */}
      <nav className="sticky top-14 z-40 bg-surface border-b border-outline-variant">
        <div className="max-w-7xl mx-auto flex">
          <PhaseTab
            active={activeTab}
            type="active"
            title="Happening Now"
            subtitle="Active Deals"
            onClick={() => setActiveTab('active')}
          />
          <PhaseTab
            active={activeTab}
            type="upcoming"
            title="Coming Soon"
            subtitle="Starts 12:00 PM"
            onClick={() => setActiveTab('upcoming')}
          />
        </div>
      </nav>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-container-margin py-md pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-grid-gutter">
          {activeTab === 'active'
            ? filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} variant="flash-sale" />
              ))
            : upcomingProducts.map(product => (
                <UpcomingProductCard key={product.id} product={product} />
              ))
          }
        </div>
      </main>
    </>
  );
}