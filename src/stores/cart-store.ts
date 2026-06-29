'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, sellerName?: string, sellerId?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleSelect: (itemId: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  clearCart: () => void;
  getSelectedItems: () => CartItem[];
  getTotal: () => number;
  getSelectedTotal: () => number;
  getItemCount: () => number;
  getSelectedCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, sellerName?: string, sellerId?: string) => {
        const items = get().items;
        const existingIndex = items.findIndex(item => item.product.id === product.id);

        if (existingIndex >= 0) {
          const updated = [...items];
          updated[existingIndex].quantity += quantity;
          set({ items: updated });
        } else {
          set({
            items: [
              ...items,
              {
                id: `cart-${product.id}-${Date.now()}`,
                product,
                quantity,
                selected: true,
                sellerName: sellerName || product.seller?.name || 'Unknown Store',
                sellerId: sellerId || product.seller?.id || 'unknown',
              },
            ],
          });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter(item => item.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      toggleSelect: (itemId) => {
        set({
          items: get().items.map(item =>
            item.id === itemId ? { ...item, selected: !item.selected } : item
          ),
        });
      },

      toggleSelectAll: (selected) => {
        set({
          items: get().items.map(item => ({ ...item, selected })),
        });
      },

      clearCart: () => set({ items: [] }),

      getSelectedItems: () => get().items.filter(item => item.selected),

      getTotal: () =>
        get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),

      getSelectedTotal: () =>
        get()
          .items.filter(item => item.selected)
          .reduce((total, item) => total + item.product.price * item.quantity, 0),

      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),

      getSelectedCount: () =>
        get()
          .items.filter(item => item.selected)
          .reduce((count, item) => count + item.quantity, 0),
    }),
    { name: 'amarshop-cart' }
  )
);
