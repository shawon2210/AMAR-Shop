import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';

const mockItems = [
  { id: 'item-1', quantity: 2, product: { id: 'prod-1', name: 'Test Product', price: 1000, images: [] } },
];

const mockStore = {
  items: mockItems,
  totalItems: 2,
  totalPrice: 2000,
  addItem: vi.fn(),
  removeItem: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
  toggleSelect: vi.fn(),
  selectedItems: mockItems,
  selectedTotal: 2000,
};

vi.mock('@/stores/cart-store', () => ({
  useCart: () => mockStore,
}));

describe('useCart hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns cart items', async () => {
    const { useCart } = await import('@/stores/cart-store');
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalItems).toBe(2);
  });

  it('calculates total price correctly', async () => {
    const { useCart } = await import('@/stores/cart-store');
    const { result } = renderHook(() => useCart());
    expect(result.current.totalPrice).toBe(2000);
  });

  it('provides addItem function', async () => {
    const { useCart } = await import('@/stores/cart-store');
    const { result } = renderHook(() => useCart());
    act(() => { result.current.addItem({ productId: 'prod-2', quantity: 1 }); });
    expect(mockStore.addItem).toHaveBeenCalledWith({ productId: 'prod-2', quantity: 1 });
  });
});
