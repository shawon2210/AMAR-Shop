import { api } from '@/services/api';
import type { AdminCategory } from '@/types';

export function fetchCategories(): Promise<AdminCategory[]> {
  return api.get<AdminCategory[]>('/admin/categories');
}

export function createCategory(data: unknown): Promise<AdminCategory> {
  return api.post<AdminCategory>('/admin/categories', data);
}

export function updateCategory(id: string, data: unknown): Promise<unknown> {
  return api.put(`/admin/categories/${id}`, data);
}

export function deleteCategory(id: string): Promise<unknown> {
  return api.delete(`/admin/categories/${id}`);
}
