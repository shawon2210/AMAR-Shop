'use client';

import { useParams } from 'next/navigation';
import { products } from '@/lib/data/products';
import { categories } from '@/lib/data/categories';
import { ProductCard } from '@/components/commerce/product-card';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = categories.find(c => c.slug === slug);
  const categoryProducts = products.filter(
    p => p.category.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-container-margin">
        <span className="material-symbols-outlined text-6xl text-secondary mb-4">category</span>
        <h2 className="font-headline-md text-headline-md mb-2">Category Not Found</h2>
        <Link
          href="/"
          className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-bold hover:brightness-110 transition-all"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="px-container-margin pt-md space-y-md">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-secondary">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">{category.name}</span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md">{category.name}</h1>
        <span className="text-xs text-secondary">{categoryProducts.length} products</span>
      </div>

      {categoryProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined text-4xl text-secondary mb-3">inventory_2</span>
          <p className="text-secondary">No products in this category yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-grid-gutter">
          {categoryProducts.map(product => (
            <ProductCard key={product.id} product={product} variant="compact" />
          ))}
        </div>
      )}
    </div>
  );
}
