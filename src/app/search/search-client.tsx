'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import Link from 'next/link';
import { products } from '@/lib/data/products';

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="app-container pt-4 md:pt-6 pb-16 md:pb-20">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">
        {query.trim() ? `Results for "${query}"` : 'Search Products'}
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        {results.length} {results.length === 1 ? 'product' : 'products'} found
      </p>

      {results.length === 0 && query.trim() ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">search_off</span>
          <h2 className="text-lg font-semibold text-gray-700">No results found</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-md">
            We couldn&apos;t find any products matching &quot;{query}&quot;. Try a different search term or browse categories.
          </p>
        </div>
      ) : null}

      {!query.trim() ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">search</span>
          <h2 className="text-lg font-semibold text-gray-700">Search our store</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter a product name, brand, or category above to find what you&apos;re looking for.
          </p>
        </div>
      ) : null}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {results.map((product) => (
            <Link
              key={product.id}
              href={product.slug ? `/product/${product.slug}` : '#'}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {product.discount ? (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded">
                    -{product.discount}%
                  </span>
                ) : null}
                {product.isNew ? (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded">
                    New
                  </span>
                ) : null}
              </div>
              <div className="p-3 space-y-1.5">
                <p className="text-[13px] text-gray-600 truncate">{product.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-gray-900">
                    {product.currency}{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice ? (
                    <span className="text-[11px] text-gray-400 line-through">
                      {product.currency}{product.originalPrice.toLocaleString()}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                  <span className="material-symbols-outlined text-[14px]">star</span>
                  <span>{product.rating}</span>
                  <span>({product.reviewCount})</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
