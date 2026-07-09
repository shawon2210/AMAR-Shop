'use client';

import { memo, useState, useMemo } from 'react';
import { brandData } from './brand-logos';

interface BrandFilterProps {
  /** Callback when a brand is selected. Passes the brand slug or '' for "All" */
  onBrandChange?: (brandSlug: string) => void;
  /** Currently selected brand slug */
  activeBrand?: string;
  /** Additional products count per brand (optional) */
  counts?: Record<string, number>;
}

/**
 * Horizontal brand filter bar for marketplace category/product pages.
 * Shows "All" plus each brand with its logo.
 */
export const BrandFilter = memo(function BrandFilter({ onBrandChange, activeBrand = '', counts }: BrandFilterProps) {
  const [selected, setSelected] = useState(activeBrand);

  const handleSelect = (slug: string) => {
    setSelected(slug);
    onBrandChange?.(slug);
  };

  // Total across all brands
  const totalCount = useMemo(() => {
    if (!counts) return undefined;
    return Object.values(counts).reduce((a, b) => a + b, 0);
  }, [counts]);

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
      {/* All button */}
      <button
        onClick={() => handleSelect('')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
          selected === ''
            ? 'bg-gray-900 text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
        {totalCount !== undefined && (
          <span className={`text-[10px] font-medium ${selected === '' ? 'text-white/70' : 'text-gray-400'}`}>
            {totalCount}
          </span>
        )}
      </button>

      {/* Brand buttons */}
      {brandData.map(brand => {
        const isActive = selected === brand.slug;
        return (
          <button
            key={brand.slug}
            onClick={() => handleSelect(brand.slug)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
              isActive
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <brand.logo className="w-4 h-4" />
            {brand.name}
            {counts?.[brand.slug] !== undefined && (
              <span className={`text-[10px] font-medium ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                {counts[brand.slug]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
});