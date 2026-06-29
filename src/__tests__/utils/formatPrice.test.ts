import { describe, it, expect } from 'vitest';

describe('formatPrice', () => {
  const formatPrice = (price: number, currency = 'BDT'): string => {
    const formatter = new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(price);
  };

  it('formats whole numbers correctly', () => {
    expect(formatPrice(24999)).toBe('BDT\u00a024,999');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('BDT\u00a00');
  });

  it('formats large numbers with commas', () => {
    expect(formatPrice(1000000)).toBe('BDT\u00a010,00,000');
  });

  it('handles decimal prices', () => {
    expect(formatPrice(99.99)).toBe('BDT\u00a0100');
  });

  it('formats with different currency', () => {
    expect(formatPrice(100, 'USD')).toBe('USD\u00a0100');
  });

  it('handles negative numbers', () => {
    expect(formatPrice(-500)).toBe('-BDT\u00a0500');
  });
});
