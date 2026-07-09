'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

const FREE_SHIPPING_THRESHOLD = 999;

interface CartState {
  items: CartItem[];
  removedItems: { item: CartItem; timestamp: number }[];
  couponCode: string;
  couponDiscount: number;
  addItem: (product: Product, quantity?: number, sellerName?: string, sellerId?: string) => void;
  removeItem: (itemId: string) => void;
  undoRemoveItem: (itemId: string) => void;
  clearRemovedItems: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleSelect: (itemId: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  clearCart: () => void;
  setCoupon: (code: string, discount?: number) => void;
  clearCoupon: () => void;
  getSelectedItems: () => CartItem[];
  getTotal: () => number;
  getSelectedTotal: () => number;
  getItemCount: () => number;
  getSelectedCount: () => number;
  getShippingProgress: () => { current: number; target: number; remaining: number; percent: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      removedItems: [],
      couponCode: '',
      couponDiscount: 0,

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
        const item = get().items.find(i => i.id === itemId);
        if (!item) return;
        set({
          items: get().items.filter(i => i.id !== itemId),
          removedItems: [
            { item, timestamp: Date.now() },
            ...get().removedItems,
          ].slice(0, 10), // Keep last 10 removed items
        });
      },

      undoRemoveItem: (itemId) => {
        const removed = get().removedItems.find(r => r.item.id === itemId);
        if (!removed) return;
        set({
          items: [...get().items, removed.item],
          removedItems: get().removedItems.filter(r => r.item.id !== itemId),
        });
      },

      clearRemovedItems: () => set({ removedItems: [] }),

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

      clearCart: () => set({ items: [], couponCode: '', couponDiscount: 0 }),

      setCoupon: (code, discount = 0) => {
        set({ couponCode: code, couponDiscount: discount });
      },

      clearCoupon: () => set({ couponCode: '', couponDiscount: 0 }),

      getSelectedItems: () => get().items.filter(item => item.selected),

      getTotal: () =>
        get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),

      getSelectedTotal: () => {
        const subtotal = get()
          .items.filter(item => item.selected)
          .reduce((total, item) => total + item.product.price * item.quantity, 0);
        return Math.max(0, subtotal - get().couponDiscount);
      },

      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),

      getSelectedCount: () =>
        get()
          .items.filter(item => item.selected)
          .reduce((count, item) => count + item.quantity, 0),

      getShippingProgress: () => {
        const selectedTotal = get()
          .items.filter(item => item.selected)
          .reduce((total, item) => total + item.product.price * item.quantity, 0);
        const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - selectedTotal);
        const percent = Math.min(100, (selectedTotal / FREE_SHIPPING_THRESHOLD) * 100);
        return {
          current: selectedTotal,
          target: FREE_SHIPPING_THRESHOLD,
          remaining,
          percent,
        };
      },
    }),
    {
      name: 'amarshop-cart',
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
      }),
    }
  )
);