'use client';

import Link from 'next/link';
import { categories } from '@/lib/data/categories';

export default function CategoriesPage() {
  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      <h1 className="font-headline-md text-headline-md">All Categories</h1>

      <div className="space-y-xs">
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex items-center gap-md p-md bg-surface-container-lowest rounded-xl shadow-sm hover:brightness-95 transition-all active:scale-[0.99]"
          >
            <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-title-sm text-title-sm">{cat.bnName}</p>
              <p className="text-body-sm text-secondary truncate">{cat.name}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-label-bold text-primary">{(cat.productCount / 1000).toFixed(1)}K+</p>
              <p className="text-[10px] text-secondary">products</p>
            </div>
            <span className="material-symbols-outlined text-secondary">chevron_right</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
