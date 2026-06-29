'use client';

import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UIState {
  isSearchOpen: boolean;
  toasts: Toast[];
  setSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
  isSearchOpen: false,
  toasts: [],

  setSearchOpen: (open) => set({ isSearchOpen: open }),

  toggleSearch: () => set({ isSearchOpen: !get().isSearchOpen }),

  addToast: (message, type = 'success') => {
    const id = `toast-${Date.now()}`;
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter(t => t.id !== id) });
  },
}));
