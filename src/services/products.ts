import { api } from './api';
import type { Product } from '@/types';
import { MOCK_PRODUCTS, MOCK_FLASH_SALE_PRODUCTS } from '@/data/mock-products';

interface ProductsResponse {
  products: any[];
  total: number;
  skip: number;
  take: number;
}

function toProduct(raw: any): Product {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description || '',
    price: raw.price,
    originalPrice: raw.originalPrice ?? undefined,
    discount: raw.originalPrice ? Math.round((1 - raw.price / raw.originalPrice) * 100) : undefined,
    currency: raw.currency === 'BDT' ? '৳' : raw.currency,
    images: raw.images || [],
    category: raw.category?.name || '',
    categoryId: raw.categoryId,
    brand: raw.brand?.name || '',
    rating: raw.rating || 0,
    reviewCount: raw.reviewCount || 0,
    inStock: raw.inStock,
    stockCount: raw.stockCount || 0,
    isFlashSale: raw.isFlashSale ?? false,
    isMall: raw.store?.isOfficial ?? false,
    isNew: raw.isNew ?? false,
    freeShipping: raw.freeShipping ?? false,
    flashSaleEndsAt: raw.flashSaleEndsAt || undefined,
    soldPercent: raw.soldPercent ?? undefined,
    seller: raw.store
      ? { id: raw.storeId, name: raw.store.name, isOfficial: raw.store.isOfficial ?? false }
      : undefined,
    createdAt: raw.createdAt,
  };
}

export async function getProducts(skip = 0, take = 20, categorySlug?: string): Promise<Product[]> {
  try {
    let path = `/products?skip=${skip}&take=${take}`;
    if (categorySlug) path += `&category=${categorySlug}`;
    const data = await api.get<ProductsResponse>(path);
    return (data.products || []).map(toProduct);
  } catch {
    return MOCK_PRODUCTS.slice(skip, skip + take);
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const raw = await api.get<any>(`/products/${id}`);
    return toProduct(raw);
  } catch {
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  }
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const data = await api.get<ProductsResponse>(`/products?categorySlug=${categorySlug}`);
    return (data.products || []).map(toProduct);
  } catch {
    return MOCK_PRODUCTS.filter(p => p.categoryId === categorySlug);
  }
}

export async function getFlashSaleProducts(): Promise<Product[]> {
  try {
    const data = await api.get<ProductsResponse>('/products?flashSale=true');
    return (data.products || []).map(toProduct);
  } catch {
    return MOCK_FLASH_SALE_PRODUCTS;
  }
}
