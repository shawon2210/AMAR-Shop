'use client';

import { useParams } from 'next/navigation';
import { useGetProducts } from '@/services/products';
import { ProductCard } from '@/components/commerce/product-card';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: categoryProducts = [], isLoading: loading } = useGetProducts(0, 50, slug);

  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface capitalize">{slug.replace(/-/g, ' ')}</span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md capitalize">{slug.replace(/-/g, ' ')}</h1>
        <span className="text-xs text-secondary">{loading ? '...' : `${categoryProducts.length} products`}</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-grid-gutter">
          {categoryProducts.map(product => (
            <ProductCard key={product.id} product={product} variant="compact" />
          ))}
        </div>
      )}
    </div>
  );
}
