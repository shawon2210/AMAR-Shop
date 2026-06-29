import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockCartItems = [
  {
    id: 'item-1',
    quantity: 2,
    selected: true,
    product: {
      id: 'prod-1',
      name: 'Smartphone X Pro',
      price: 24999,
      images: ['/images/phone.jpg'],
      inStock: true,
      stockCount: 10,
    },
  },
  {
    id: 'item-2',
    quantity: 1,
    selected: false,
    product: {
      id: 'prod-2',
      name: 'Wireless Headphones',
      price: 3499,
      images: ['/images/headphones.jpg'],
      inStock: true,
      stockCount: 25,
    },
  },
];

const mockUseCart = vi.fn(() => ({
  items: mockCartItems,
  totalItems: 3,
  totalPrice: 53497,
  addItem: vi.fn(),
  removeItem: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
  toggleSelect: vi.fn(),
  selectedItems: [mockCartItems[0]],
  selectedTotal: 49998,
}));

vi.mock('@/stores/cart-store', () => ({
  useCart: () => mockUseCart(),
}));

describe('Cart Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cart items', async () => {
    const { default: Cart } = await import('@/components/cart/cart');
    render(<Cart />);
    expect(screen.getByText('Smartphone X Pro')).toBeDefined();
    expect(screen.getByText('Wireless Headphones')).toBeDefined();
  });

  it('displays correct total', async () => {
    const { default: Cart } = await import('@/components/cart/cart');
    render(<Cart />);
    expect(screen.getByText(/49,998/)).toBeDefined();
  });

  it('shows empty cart message when no items', async () => {
    mockUseCart.mockReturnValue({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      toggleSelect: vi.fn(),
      selectedItems: [],
      selectedTotal: 0,
    });

    const { default: Cart } = await import('@/components/cart/cart');
    render(<Cart />);
    expect(screen.getByText(/empty/)).toBeDefined();
  });
});
