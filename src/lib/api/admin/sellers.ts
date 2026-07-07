import { api } from '@/services/api';
import type { PaginatedSellers } from '@/types';

export function fetchSellers(params: {
  page?: number;
  limit?: number;
  search?: string;
  kycStatus?: string;
}): Promise<PaginatedSellers> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.search) search.set('search', params.search);
  if (params.kycStatus) search.set('kycStatus', params.kycStatus);
  return api.get<PaginatedSellers>(`/admin/sellers?${search.toString()}`);
}

export function approveSeller(id: string): Promise<unknown> {
  return api.post(`/admin/sellers/${id}/approve`, {});
}

export function rejectSeller(id: string, reason: string): Promise<unknown> {
  return api.post(`/admin/sellers/${id}/reject`, { reason });
}

export function updateSeller(id: string, data: unknown): Promise<unknown> {
  return api.put(`/admin/sellers/${id}`, data);
}

export function toggleStoreStatus(id: string): Promise<unknown> {
  return api.put(`/admin/sellers/${id}/store-status`, {});
}
