'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/stores/search-store';
import { products } from '@/lib/data/products';
import { useFocusTrap } from '../hooks/use-focus-trap';
import { useBodyLock } from '../hooks/use-body-lock';
import { Z_SEARCH_OVERLAY } from '../styles';
import { Search, X, TrendingUp, Clock, ArrowRight, Store, Grid3X3 } from 'lucide-react';
import Image from 'next/image';

const DEBOUNCE_MS = 200;

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="text-primary font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export function SearchOverlay() {
  const router = useRouter();
  const {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    selectedIndex,
    setSelectedIndex,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    trendingSearches,
  } = useSearchStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  const [filteredProducts, setFilteredProducts] = useState<typeof products>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<string[]>([]);

  const { categories, brands } = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    const brds = [...new Set(products.filter((p) => p.brand).map((p) => p.brand!))];
    return { categories: cats, brands: brds };
  }, []);

  const performSearch = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setFilteredProducts([]);
        setFilteredCategories([]);
        setFilteredBrands([]);
        return;
      }

      const lower = q.toLowerCase();

      setFilteredProducts(
        products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(lower) ||
              p.brand?.toLowerCase().includes(lower) ||
              p.category.toLowerCase().includes(lower),
          )
          .slice(0, 6),
      );
      setFilteredCategories(
        categories.filter((c) => c.toLowerCase().includes(lower)).slice(0, 3),
      );
      setFilteredBrands(
        brands.filter((b) => b.toLowerCase().includes(lower)).slice(0, 3),
      );
    },
    [categories, brands],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(query), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, performSearch]);

  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      prevFocusRef.current?.focus?.();
      prevFocusRef.current = null;
    }
  }, [isOpen]);

  useFocusTrap(overlayRef, isOpen);
  useBodyLock(isOpen);

  useEffect(() => {
    if (!isOpen) {
      setSelectedIndex(-1);
      setQuery('');
    }
  }, [isOpen]);

  const totalItems =
    filteredProducts.length +
    filteredCategories.length +
    filteredBrands.length +
    (query.trim() ? 1 : 0);

  const scrollIntoView = useCallback(
    (index: number) => {
      if (!resultsRef.current) return;
      const items = resultsRef.current.querySelectorAll<HTMLElement>('[data-result-index]');
      const target = Array.from(items).find(
        (el) => el.getAttribute('data-result-index') === String(index),
      );
      target?.scrollIntoView({ block: 'nearest' });
    },
    [],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        const nextDown = Math.min(selectedIndex + 1, totalItems - 1);
        setSelectedIndex(nextDown);
        scrollIntoView(nextDown);
        break;
      case 'ArrowUp':
        e.preventDefault();
        const nextUp = Math.max(selectedIndex - 1, -1);
        setSelectedIndex(nextUp);
        scrollIntoView(nextUp);
        break;
      case 'Enter': {
        e.preventDefault();
        if (selectedIndex >= 0) {
          let idx = 0;
          for (const cat of filteredCategories) {
            if (idx === selectedIndex) {
              addRecentSearch(cat);
              setIsOpen(false);
              router.push(`/category/${cat.toLowerCase()}`);
              return;
            }
            idx++;
          }
          for (const brand of filteredBrands) {
            if (idx === selectedIndex) {
              addRecentSearch(brand);
              setIsOpen(false);
              router.push(`/search?brand=${encodeURIComponent(brand)}`);
              return;
            }
            idx++;
          }
          for (const prod of filteredProducts) {
            if (idx === selectedIndex) {
              addRecentSearch(prod.name);
              setIsOpen(false);
              router.push(`/product/${prod.id}`);
              return;
            }
            idx++;
          }
          if (idx === selectedIndex && query.trim()) {
            addRecentSearch(query);
            setIsOpen(false);
            router.push(`/search?q=${encodeURIComponent(query)}`);
          }
        } else if (query.trim()) {
          addRecentSearch(query);
          setIsOpen(false);
          router.push(`/search?q=${encodeURIComponent(query)}`);
        }
        break;
      }
    }
  };

  const handleSelect = (text: string, href: string) => {
    addRecentSearch(text);
    setIsOpen(false);
    router.push(href);
  };

  if (!isOpen) return null;

  const showRecent = !query.trim() && recentSearches.length > 0;
  const showTrending = !query.trim() && !showRecent;
  const showResults = query.trim().length > 0;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm"
      style={{ zIndex: Z_SEARCH_OVERLAY }}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div
        ref={overlayRef}
        className="absolute top-0 left-0 right-0 bg-white shadow-2xl border-b border-gray-200 safe-top"
      >
        <div className="app-container py-4">
          <div className="flex items-start gap-2 max-w-3xl mx-auto">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products, brands & categories..."
                className="w-full h-12 pl-12 pr-12 text-base bg-gray-50 border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_rgb(166_54_0/0.08)]"
                aria-label="Search"
                aria-controls="search-results"
                aria-activedescendant={
                  selectedIndex >= 0 ? `result-item-${selectedIndex}` : undefined
                }
                role="combobox"
                aria-expanded={showResults}
                aria-autocomplete="list"
                autoComplete="off"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 active:bg-gray-100 transition-all"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={resultsRef}
          id="search-results"
          className="app-container pb-6 max-h-[calc(100dvh-8rem)] md:max-h-[70vh] overflow-y-auto overscroll-contain"
          role="listbox"
          aria-label="Search results"
        >
          <div className="max-w-3xl mx-auto">
            {showRecent && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-primary hover:underline min-h-[44px] px-2"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <span key={search} className="inline-flex items-center">
                      <button
                        onClick={() => {
                          setQuery(search);
                          performSearch(search);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-600 hover:bg-primary/5 hover:text-primary transition-all min-h-[36px]"
                      >
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {search}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(search);
                        }}
                        className="ml-1 p-1.5 text-gray-300 hover:text-red-400 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                        aria-label={`Remove ${search}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {showTrending && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Trending Now
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {trendingSearches.map((item) => (
                    <button
                      key={item.text}
                      onClick={() => {
                        setQuery(item.text);
                        performSearch(item.text);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-primary/5 hover:text-primary transition-all group min-h-[40px]"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-primary/60 group-hover:text-primary shrink-0" />
                      <span className="truncate">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showResults && (
              <div className="space-y-4">
                {filteredCategories.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Categories
                    </h4>
                    <div className="space-y-0.5">
                      {filteredCategories.map((cat, i) => {
                        const globalIdx = i;
                        return (
                          <button
                            key={cat}
                            id={`result-item-${globalIdx}`}
                            data-result-index={globalIdx}
                            role="option"
                            aria-selected={selectedIndex === globalIdx}
                            onClick={() => handleSelect(cat, `/category/${cat.toLowerCase()}`)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all min-h-[44px] ${
                              selectedIndex === globalIdx
                                ? 'bg-primary/5 text-primary'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Grid3X3
                              className={`w-4 h-4 shrink-0 ${
                                selectedIndex === globalIdx ? 'text-primary' : 'text-gray-400'
                              }`}
                            />
                            <span>{highlightMatch(cat, query)}</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-auto text-gray-300 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {filteredBrands.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Brands
                    </h4>
                    <div className="space-y-0.5">
                      {filteredBrands.map((brand, i) => {
                        const globalIdx = filteredCategories.length + i;
                        return (
                          <button
                            key={brand}
                            id={`result-item-${globalIdx}`}
                            data-result-index={globalIdx}
                            role="option"
                            aria-selected={selectedIndex === globalIdx}
                            onClick={() =>
                              handleSelect(brand, `/search?brand=${encodeURIComponent(brand)}`)
                            }
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all min-h-[44px] ${
                              selectedIndex === globalIdx
                                ? 'bg-primary/5 text-primary'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Store
                              className={`w-4 h-4 shrink-0 ${
                                selectedIndex === globalIdx ? 'text-primary' : 'text-gray-400'
                              }`}
                            />
                            <span>{highlightMatch(brand, query)}</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-auto text-gray-300 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {filteredProducts.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Products
                    </h4>
                    <div className="space-y-0.5">
                      {filteredProducts.map((prod, i) => {
                        const globalIdx =
                          filteredCategories.length + filteredBrands.length + i;
                        return (
                          <button
                            key={prod.id}
                            id={`result-item-${globalIdx}`}
                            data-result-index={globalIdx}
                            role="option"
                            aria-selected={selectedIndex === globalIdx}
                            onClick={() => handleSelect(prod.name, `/product/${prod.id}`)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all min-h-[56px] ${
                              selectedIndex === globalIdx
                                ? 'bg-primary/5 text-primary'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="relative w-8 h-8 rounded-md bg-gray-100 overflow-hidden shrink-0">
                              <Image
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                                fill
                              />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <p className="truncate">{highlightMatch(prod.name, query)}</p>
                              <p className="text-xs text-gray-400">
                                ৳{prod.price.toLocaleString('en-BD')}
                              </p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {query.trim() && (
                  <button
                    onClick={() => {
                      addRecentSearch(query);
                      setIsOpen(false);
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[48px] ${
                      selectedIndex === totalItems - 1
                        ? 'bg-primary text-white'
                        : 'bg-primary/5 text-primary hover:bg-primary/10'
                    }`}
                    role="option"
                    aria-selected={selectedIndex === totalItems - 1}
                  >
                    View all results for &ldquo;{query}&rdquo;
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {totalItems === 0 && query.trim() && (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      No results found for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try different keywords or browse categories
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
