'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { FlashSaleBanner } from '@/components/commerce/flash-sale-banner';
import { ProductCard } from '@/components/commerce/product-card';
import { useGetFlashSaleProducts } from '@/services/products';
import type { Product } from '@/types';

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
    className={`flex-1 py-4 border-b-2 text-sm font-semibold text-center transition-colors ${
      active === type
        ? 'border-primary text-primary'
        : 'border-transparent text-gray-500 hover:bg-gray-100'
    }`}
    type="button"
  >
    {title}
    <span className="block text-[10px] opacity-70 font-normal">{subtitle}</span>
  </button>
);

// Extracted category filter component
const CategoryFilter = ({ categories: cats, activeCategory, onCategoryChange }: CategoryFilterProps) => (
  <section className="bg-white py-3 border-b border-gray-100 overflow-x-auto whitespace-nowrap hide-scrollbar">
    <div className="app-container flex gap-2">
      {cats.map(cat => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            activeCategory === cat
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
const UpcomingProductCard = ({ product }: { product: Product }) => {
  const interestText = '2.4k People Interested';

  return (
    <article
      className="bg-white border border-gray-200 rounded-xl overflow-hidden group opacity-90"
    >
      <div className="relative aspect-square overflow-hidden grayscale-[0.2]">
        <Image
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={product.images[0]}
          alt={product.name}
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white/90 px-4 py-1 rounded-full text-primary font-semibold text-xs">
            Starts at 12:00
          </div>
        </div>
      </div>
      <div className="p-3 space-y-1">
        <h3 className="text-sm text-gray-900 line-clamp-2 h-10">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-primary">
            ৳{product.price.toLocaleString('en-BD')}
          </span>
          <span className="text-[10px] text-gray-500 italic">Special Price</span>
        </div>
        <div className="pt-1">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-500">
            <span className="material-symbols-outlined text-sm">notifications</span>
            <span>{interestText}</span>
          </div>
        </div>
        <button className="w-full mt-2 h-11 min-h-11 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-1 text-sm">
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
  const { data: flashSaleProducts = [] } = useGetFlashSaleProducts();

  // Memoized filtering to avoid recalculating on every render
  const filteredProducts = useMemo(() =>
    flashSaleProducts.filter(p =>
      activeCategory === 'All Products' || p.category === activeCategory
    ),
    [flashSaleProducts, activeCategory]
  );

  const upcomingProducts = useMemo(
    () => filteredProducts.slice(0, 6),
    [filteredProducts]
  );

  return (
    <>
      <FlashSaleBanner endDate={FLASH_SALE_END} />

      {/* Phase Selector Tabs */}
      <nav className="sticky top-14 z-40 bg-white border-b border-gray-100">
        <div className="app-container flex">
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
      <main className="app-container py-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
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