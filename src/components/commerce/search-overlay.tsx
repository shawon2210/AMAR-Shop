'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/stores/search-store';
import { products } from '@/lib/data/products';
import { Search, X, TrendingUp, Clock, ArrowRight, Package, Store, Grid3X3 } from 'lucide-react';

const DEBOUNCE_MS = 200;

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="text-primary font-semibold">{part}</span>
    ) : (
      part
    )
  );
}

export function SearchOverlay() {
  const router = useRouter();
  const {
    query, setQuery, isOpen, setIsOpen,
    selectedIndex, setSelectedIndex,
    recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches,
    suggestions, setSuggestions, trendingSearches,
  } = useSearchStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<typeof products>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<string[]>([]);

  // Get unique categories and brands
  const { categories, brands } = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    const brds = [...new Set(products.filter(p => p.brand).map(p => p.brand!))];
    return { categories: cats, brands: brds };
  }, [products]);

  // Debounced search
  const performSearch = useCallback((q: string) => {
    if (!q.trim()) {
      setFilteredProducts([]);
      setFilteredCategories([]);
      setFilteredBrands([]);
      setSuggestions([]);
      return;
    }

    const lower = q.toLowerCase();

    const matchedProducts = products
      .filter(p =>
        p.name.toLowerCase().includes(lower) ||
        p.brand?.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
      )
      .slice(0, 6);

    const matchedCategories = categories.filter(c =>
      c.toLowerCase().includes(lower)
    ).slice(0, 3);

    const matchedBrands = brands.filter(b =>
      b.toLowerCase().includes(lower)
    ).slice(0, 3);

    setFilteredProducts(matchedProducts);
    setFilteredCategories(matchedCategories);
    setFilteredBrands(matchedBrands);

    // Build suggestions
    const sugg = [
      ...matchedCategories.map(c => ({ type: 'category' as const, text: c, icon: 'category' as const })),
      ...matchedBrands.map(b => ({ type: 'brand' as const, text: b, icon: 'store' as const })),
      ...matchedProducts.map(p => ({ type: 'product' as const, text: p.name, icon: 'package' as const })),
    ];
    setSuggestions(sugg);
  }, [categories, brands, setSuggestions]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(query), DEBOUNCE_MS);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, performSearch]);

  // Focus input when opened, restore focus on close
  useEffect(() => {
    if (isOpen) {
      prevFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      prevFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, setIsOpen]);

  // Close on click outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', onClick);
    }
    return () => document.removeEventListener('mousedown', onClick);
  }, [isOpen, setIsOpen]);

  const totalItems = filteredProducts.length + filteredCategories.length + filteredBrands.length + (query.trim() ? 1 : 0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(Math.min(selectedIndex + 1, totalItems - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(Math.max(selectedIndex - 1, -1));
        break;
      case 'Enter': {
        e.preventDefault();
        if (selectedIndex >= 0) {
          // Navigate based on selected item
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
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Search products">
      <div
        ref={overlayRef}
        className="absolute top-0 left-0 right-0 bg-white shadow-2xl border-b border-gray-200"
      >
        {/* Search input */}
        <div className="app-container py-4">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products, brands & categories..."
              className="w-full h-12 pl-12 pr-12 text-base bg-gray-50 border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_rgb(166_54_0/0.08)]"
              aria-label="Search"
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
        </div>

        {/* Results */}
        <div className="app-container pb-6 max-h-[70vh] overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Recent Searches */}
            {showRecent && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => {
                        setQuery(search);
                        performSearch(search);
                      }}
                      className="group flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-600 hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary" />
                      {search}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(search);
                        }}
                        className="ml-1 text-gray-300 hover:text-red-400 transition-colors"
                        aria-label={`Remove ${search}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
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
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-primary/5 hover:text-primary transition-all group"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-primary/60 group-hover:text-primary" />
                      {item.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {showResults && (
              <div className="space-y-4">
                {/* Categories */}
                {filteredCategories.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</h4>
                    <div className="space-y-0.5">
                      {filteredCategories.map((cat, i) => {
                        const globalIdx = i;
                        return (
                          <button
                            key={cat}
                            onClick={() => handleSelect(cat, `/category/${cat.toLowerCase()}`)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                              selectedIndex === globalIdx ? 'bg-primary/5 text-primary' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Grid3X3 className={`w-4 h-4 ${selectedIndex === globalIdx ? 'text-primary' : 'text-gray-400'}`} />
                            <span>{highlightMatch(cat, query)}</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-auto text-gray-300" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Brands */}
                {filteredBrands.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Brands</h4>
                    <div className="space-y-0.5">
                      {filteredBrands.map((brand, i) => {
                        const globalIdx = filteredCategories.length + i;
                        return (
                          <button
                            key={brand}
                            onClick={() => handleSelect(brand, `/search?brand=${encodeURIComponent(brand)}`)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                              selectedIndex === globalIdx ? 'bg-primary/5 text-primary' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Store className={`w-4 h-4 ${selectedIndex === globalIdx ? 'text-primary' : 'text-gray-400'}`} />
                            <span>{highlightMatch(brand, query)}</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-auto text-gray-300" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Products */}
                {filteredProducts.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Products</h4>
                    <div className="space-y-0.5">
                      {filteredProducts.map((prod, i) => {
                        const globalIdx = filteredCategories.length + filteredBrands.length + i;
                        return (
                          <button
                            key={prod.id}
                            onClick={() => handleSelect(prod.name, `/product/${prod.id}`)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                              selectedIndex === globalIdx ? 'bg-primary/5 text-primary' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                              <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <p className="truncate">{highlightMatch(prod.name, query)}</p>
                              <p className="text-xs text-gray-400">৳{prod.price.toLocaleString('en-BD')}</p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* View all results */}
                {query.trim() && (
                  <button
                    onClick={() => {
                      addRecentSearch(query);
                      setIsOpen(false);
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      selectedIndex === totalItems - 1
                        ? 'bg-primary text-white'
                        : 'bg-primary/5 text-primary hover:bg-primary/10'
                    }`}
                  >
                    View all results for &ldquo;{query}&rdquo;
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {/* Empty state */}
                {totalItems === 0 && query.trim() && (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No results found for &ldquo;{query}&rdquo;</p>
                    <p className="text-sm text-gray-400 mt-1">Try different keywords or browse categories</p>
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