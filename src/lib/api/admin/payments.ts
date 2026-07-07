import { api } from '@/services/api';
import type { PaginatedPayments } from '@/types';

export function fetchPayments(params: {
  page?: number;
  limit?: number;
  status?: string;
  from?: string;
  to?: string;
}): Promise<PaginatedPayments> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.status) search.set('status', params.status);
  if (params.from) search.set('from', params.from);
  if (params.to) search.set('to', params.to);
  return api.get<PaginatedPayments>(`/admin/payments?${search.toString()}`);
}
