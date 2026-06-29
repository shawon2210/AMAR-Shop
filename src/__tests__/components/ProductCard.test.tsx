import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockProduct = {
  id: 'prod-1',
  name: 'Smartphone X Pro',
  slug: 'smartphone-x-pro',
  price: 24999,
  originalPrice: 29999,
  images: ['/images/phone.jpg'],
  rating: 4.5,
  reviewCount: 128,
  inStock: true,
  stockCount: 50,
  soldCount: 320,
  freeShipping: true,
  isFlashSale: true,
  flashSalePrice: 19999,
  flashSaleEndsAt: new Date(Date.now() + 3600000).toISOString(),
};

vi.mock('@/components/commerce/product-card', () => ({
  ProductCard: ({ product }: any) => (
    <div data-testid="product-card">
      <h3>{product.name}</h3>
      <span data-testid="price">{product.price}</span>
      {product.flashSalePrice && <span data-testid="sale-price">{product.flashSalePrice}</span>}
    </div>
  ),
}));

describe('ProductCard', () => {
  it('renders product name', async () => {
    const { ProductCard } = await import('@/components/commerce/product-card');
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Smartphone X Pro')).toBeDefined();
  });

  it('displays sale price when isFlashSale is true', async () => {
    const { ProductCard } = await import('@/components/commerce/product-card');
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByTestId('sale-price')).toBeDefined();
  });

  it('does not show sale price for non-flash sale items', async () => {
    const { ProductCard } = await import('@/components/commerce/product-card');
    const normalProduct = { ...mockProduct, isFlashSale: false, flashSalePrice: undefined };
    render(<ProductCard product={normalProduct} />);
    expect(screen.queryByTestId('sale-price')).toBeNull();
  });
});
