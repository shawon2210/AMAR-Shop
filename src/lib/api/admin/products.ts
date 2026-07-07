import { api } from '@/services/api';
import type { PaginatedProducts } from '@/types';

export function fetchProducts(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  category?: string;
}): Promise<PaginatedProducts> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.status) search.set('status', params.status);
  if (params.search) search.set('search', params.search);
  if (params.category) search.set('category', params.category);
  return api.get<PaginatedProducts>(`/admin/products?${search.toString()}`);
}

export function approveProduct(id: string): Promise<unknown> {
  return api.post(`/admin/products/${id}/approve`, {});
}

export function rejectProduct(id: string, reason: string): Promise<unknown> {
  return api.post(`/admin/products/${id}/reject`, { reason });
}

export function createProduct(data: unknown): Promise<unknown> {
  return api.post('/admin/products', data);
}

export function updateProduct(id: string, data: unknown): Promise<unknown> {
  return api.put(`/admin/products/${id}`, data);
}

export function deleteProduct(id: string): Promise<unknown> {
  return api.delete(`/admin/products/${id}`);
}
