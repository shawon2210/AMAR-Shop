import { api } from '@/services/api';
import type { PaginatedUsers } from '@/types';

export function fetchUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<PaginatedUsers> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.search) search.set('search', params.search);
  if (params.role) search.set('role', params.role);
  return api.get<PaginatedUsers>(`/admin/users?${search.toString()}`);
}

export function updateUser(
  id: string,
  data: { isActive?: boolean; role?: string; isVerified?: boolean },
): Promise<unknown> {
  return api.put(`/admin/users/${id}`, data);
}

export function createAdminUser(data: {
  name: string;
  phone: string;
  password: string;
  email?: string;
}): Promise<unknown> {
  return api.post('/admin/users', data);
}
