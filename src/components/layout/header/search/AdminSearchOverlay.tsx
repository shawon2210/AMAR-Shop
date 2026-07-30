'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFocusTrap } from '../hooks/use-focus-trap';
import { Z_SEARCH_OVERLAY } from '../styles';

interface NavItem {
  label: string;
  icon: string;
  href: string;
  section: string;
}

export function AdminSearchOverlay({
  allNavItems: _allNavItems,
  onClose,
}: {
  allNavItems: NavItem[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return _allNavItems;
    const q = query.toLowerCase();
    return _allNavItems.filter((i) => i.label.toLowerCase().includes(q));
  }, [query, _allNavItems]);

  useFocusTrap(overlayRef, true);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm"
      style={{ zIndex: Z_SEARCH_OVERLAY }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        ref={overlayRef}
        className="absolute top-0 sm:top-18 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg bg-white sm:rounded-2xl shadow-2xl sm:border sm:border-gray-200 overflow-hidden min-h-50 sm:min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
            aria-label="Search menu items"
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 font-mono">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 && query.trim() ? (
            <p className="p-6 text-center text-sm text-gray-400">No results found</p>
          ) : (
            results.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0 min-h-[48px]"
              >
                <span className="material-symbols-outlined text-[18px] text-gray-400 shrink-0">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{item.label}</p>
                  <p className="text-[10px] text-gray-400">{item.section}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
