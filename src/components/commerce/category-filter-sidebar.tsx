'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { SlidersHorizontal, X } from 'lucide-react';

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Groceries', slug: 'groceries' },
  { name: 'Home & Living', slug: 'home' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Appliances', slug: 'appliances' },
  { name: 'Books & Stationery', slug: 'books-stationery' },
  { name: 'Gaming', slug: 'gaming' },
  { name: 'Accessories', slug: 'accessories' },
];

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export function CategoryFilterSidebar() {
  const params = useParams();
  const currentSlug = params.slug as string;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [mounted, setMounted] = useState(false);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll + focus save/restore when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      prevFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      prevFocusRef.current?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Don't render filter content until mounted (SSR safety)
  if (!mounted) return null;

  const filterContent = (
    <div className="space-y-8">
      {/* Sort */}
      <div>
        <h4 className="text-[13px] font-bold uppercase tracking-[0.08em] text-gray-900 mb-4">
          Sort By
        </h4>
        <div className="space-y-2">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedSort(opt.value)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedSort === opt.value
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-[13px] font-bold uppercase tracking-[0.08em] text-gray-900 mb-4">
          Categories
        </h4>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isActive = cat.slug === currentSlug;
            return (
              <Link
                key={cat.slug}
                href={'/category/' + cat.slug}
                className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Filter Button — mobile only */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 h-9 px-4 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        aria-label="Open filters"
      >
        <SlidersHorizontal size={16} />
        Filters
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[240px] shrink-0">
        <div className="sticky top-24 space-y-6 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Drawer — portal to body to avoid z-index/clipping issues */}
      {mounted && mobileOpen && createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 h-full w-[280px] max-w-[80vw] bg-white z-[210] shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-label="Filters"
              >
                <div className="flex items-center justify-between px-5 h-16 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <SlidersHorizontal size={16} />
                    Filters
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                    aria-label="Close filters"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-5 overflow-y-auto h-[calc(100%-64px)]">
                  {filterContent}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
