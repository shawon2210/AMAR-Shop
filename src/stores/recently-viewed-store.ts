'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface RecentlyViewedState {
  items: Product[];
  addItem: (product: Product) => void;
  clearItems: () => void;
}

const MAX_ITEMS = 12;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;
        // Remove if exists, then add to front
        const filtered = items.filter(item => item.id !== product.id);
        set({ items: [product, ...filtered].slice(0, MAX_ITEMS) });
      },

      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'amarshop-recently-viewed',
      partialize: (state) => ({ items: state.items }),
    }
  )
);