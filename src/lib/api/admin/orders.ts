import { api } from '@/services/api';
import type { PaginatedOrders } from '@/types';

export function fetchOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  from?: string;
  to?: string;
}): Promise<PaginatedOrders> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.status) search.set('status', params.status);
  if (params.from) search.set('from', params.from);
  if (params.to) search.set('to', params.to);
  return api.get<PaginatedOrders>(`/admin/orders?${search.toString()}`);
}

export function updateOrderStatus(id: string, status: string): Promise<unknown> {
  return api.put(`/admin/orders/${id}/status`, { status });
}

export function addOrderNote(id: string, note: string): Promise<unknown> {
  return api.post(`/admin/orders/${id}/notes`, { note });
}
