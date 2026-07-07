import { api } from './api';
import type { Product } from '@/types';
import { MOCK_PRODUCTS, MOCK_FLASH_SALE_PRODUCTS } from '@/data/mock-products';
import { useQuery } from '@tanstack/react-query';

interface ProductsResponse {
  products: Record<string, unknown>[];
  total: number;
  skip: number;
  take: number;
}

function toProduct(raw: Record<string, unknown>): Product {
  return {
    id: raw.id as string,
    name: raw.name as string,
    slug: raw.slug as string,
    description: (raw.description as string) || '',
    price: raw.price as number,
    originalPrice: (raw.originalPrice as number) ?? undefined,
    discount: (raw.originalPrice as number)
      ? Math.round((1 - (raw.price as number) / (raw.originalPrice as number)) * 100)
      : undefined,
    currency: (raw.currency as string) === 'BDT' ? '৳' : (raw.currency as string),
    images: (raw.images as string[]) || [],
    category: ((raw.category as { name?: string })?.name) || '',
    categoryId: raw.categoryId as string,
    brand: ((raw.brand as { name?: string })?.name) || '',
    rating: (raw.rating as number) || 0,
    reviewCount: (raw.reviewCount as number) || 0,
    inStock: raw.inStock as boolean,
    stockCount: (raw.stockCount as number) || 0,
    isFlashSale: (raw.isFlashSale as boolean) ?? false,
    isMall: ((raw.store as { isOfficial?: boolean })?.isOfficial) ?? false,
    isNew: (raw.isNew as boolean) ?? false,
    freeShipping: (raw.freeShipping as boolean) ?? false,
    flashSaleEndsAt: (raw.flashSaleEndsAt as string) || undefined,
    soldPercent: (raw.soldPercent as number) ?? undefined,
    seller: raw.store
      ? {
          id: raw.storeId as string,
          name: (raw.store as { name?: string }).name as string,
          isOfficial: ((raw.store as { isOfficial?: boolean })?.isOfficial) ?? false,
        }
      : undefined,
    createdAt: raw.createdAt as string,
  };
}

export const QUERY_KEYS = {
  products: 'products',
  product: 'product',
  categories: 'categories',
  flashSale: 'flashSaleProducts',
};

async function fetchProducts(skip = 0, take = 20, categorySlug?: string): Promise<Product[]> {
  try {
    let path = `/products?skip=${skip}&take=${take}`;
    if (categorySlug) path += `&category=${categorySlug}`;
    const data = await api.get<ProductsResponse>(path);
    return (data.products || []).map(toProduct);
  } catch {
    return MOCK_PRODUCTS.slice(skip, skip + take);
  }
}

async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const raw = await api.get<Record<string, unknown>>(`/products/${id}`);
    return toProduct(raw);
  } catch {
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  }
}

async function fetchProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const data = await api.get<ProductsResponse>(`/products?categorySlug=${categorySlug}`);
    return (data.products || []).map(toProduct);
  } catch {
    return MOCK_PRODUCTS.filter(p => p.categoryId === categorySlug);
  }
}

async function fetchFlashSaleProducts(): Promise<Product[]> {
  try {
    const data = await api.get<ProductsResponse>('/products?flashSale=true');
    return (data.products || []).map(toProduct);
  } catch {
    return MOCK_FLASH_SALE_PRODUCTS;
  }
}

export function getProducts(skip = 0, take = 20, categorySlug?: string): Promise<Product[]> {
  return fetchProducts(skip, take, categorySlug);
}

export function getFlashSaleProducts(): Promise<Product[]> {
  return fetchFlashSaleProducts();
}

export function useGetProducts(skip = 0, take = 20, categorySlug?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.products, { skip, take, categorySlug }],
    queryFn: () => fetchProducts(skip, take, categorySlug),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.product, id],
    queryFn: () => fetchProductById(id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetProductsByCategory(categorySlug: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.categories, categorySlug],
    queryFn: () => fetchProductsByCategory(categorySlug),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetFlashSaleProducts() {
  return useQuery({
    queryKey: [QUERY_KEYS.flashSale],
    queryFn: fetchFlashSaleProducts,
    staleTime: 1000 * 60 * 5,
  });
}
