'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'trending';
  text: string;
  href?: string;
  icon?: string;
}

interface SearchState {
  query: string;
  isOpen: boolean;
  selectedIndex: number;
  recentSearches: string[];
  suggestions: SearchSuggestion[];
  trendingSearches: SearchSuggestion[];
  setQuery: (query: string) => void;
  setIsOpen: (open: boolean) => void;
  setSelectedIndex: (index: number) => void;
  addRecentSearch: (text: string) => void;
  removeRecentSearch: (text: string) => void;
  clearRecentSearches: () => void;
  setSuggestions: (suggestions: SearchSuggestion[]) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: '',
      isOpen: false,
      selectedIndex: -1,
      recentSearches: [],
      suggestions: [],
      trendingSearches: [
        { type: 'trending', text: 'iPhone 16', icon: 'trending_up' },
        { type: 'trending', text: 'Samsung Galaxy S25', icon: 'trending_up' },
        { type: 'trending', text: 'Eid Collection 2026', icon: 'trending_up' },
        { type: 'trending', text: 'TWS Earbuds', icon: 'trending_up' },
        { type: 'trending', text: 'Smart Watch', icon: 'trending_up' },
        { type: 'trending', text: 'Men\'s Fashion', icon: 'trending_up' },
      ],

      setQuery: (query) => set({ query }),
      setIsOpen: (isOpen) => set({ isOpen, selectedIndex: -1 }),
      setSelectedIndex: (selectedIndex) => set({ selectedIndex }),

      addRecentSearch: (text) => {
        const recent = get().recentSearches;
        const filtered = recent.filter(s => s !== text);
        set({ recentSearches: [text, ...filtered].slice(0, 10) });
      },

      removeRecentSearch: (text) => {
        set({ recentSearches: get().recentSearches.filter(s => s !== text) });
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      setSuggestions: (suggestions) => set({ suggestions }),
    }),
    {
      name: 'amarshop-search',
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);