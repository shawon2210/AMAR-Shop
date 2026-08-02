'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchProducts } from '@/services/products';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { ProductCard } from '@/components/commerce/product-card';

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { t } = useLanguage();

  const { data, isLoading } = useSearchProducts(query);
  const results = data?.products || [];
  const total = data?.total || 0;

  return (
    <div className="app-container pt-4 md:pt-6 pb-16 md:pb-20">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">
        {query.trim() ? `${t('search.resultsFor')} "${query}"` : t('search.title')}
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        {isLoading
          ? t('search.searching')
          : `${total} ${total === 1 ? t('search.product') : t('search.products')}`}
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading && results.length === 0 && query.trim() ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">search_off</span>
          <h2 className="text-lg font-semibold text-gray-700">{t('search.noResults')}</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-md">
            {t('search.noResultsDesc')}
          </p>
        </div>
      ) : null}

      {!isLoading && !query.trim() ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">search</span>
          <h2 className="text-lg font-semibold text-gray-700">{t('search.searchOurStore')}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {t('search.searchHint')}
          </p>
        </div>
      ) : null}

      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
          {results.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
