'use client';

import { useParams } from 'next/navigation';
import { useGetProducts } from '@/services/products';
import { ProductCard } from '@/components/commerce/product-card';
import { CategoryFilterSidebar } from '@/components/commerce/category-filter-sidebar';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: categoryProducts = [], isLoading: loading } = useGetProducts(0, 50, slug);

  return (
    <div className="app-container py-6 space-y-6 pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface capitalize">{slug.replace(/-/g, ' ')}</span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="text-responsive-subheading font-bold capitalize">{slug.replace(/-/g, ' ')}</h1>
        <span className="text-xs text-secondary">{loading ? '...' : `${categoryProducts.length} products`}</span>
      </div>

      {/* Filter bar — mobile */}
      <div className="lg:hidden -mx-[clamp(12px,2.5vw,40px)] px-[clamp(12px,2.5vw,40px)] overflow-x-auto whitespace-nowrap hide-scrollbar pb-2">
        <div className="flex items-center gap-2">
          <CategoryFilterSidebar />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-3xl text-secondary">progress_activity</span>
        </div>
      ) : categoryProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined text-4xl text-secondary mb-3">inventory_2</span>
          <p className="text-secondary">No products in this category yet</p>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <CategoryFilterSidebar />
          </div>
          {/* Product grid */}
          <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {categoryProducts.map(product => (
              <ProductCard key={product.id} product={product} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
