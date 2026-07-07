import { api } from '@/services/api';
import type { AdminAnalytics } from '@/types';

export function fetchAnalytics(): Promise<AdminAnalytics> {
  return api.get<AdminAnalytics>('/admin/analytics');
}

export function fetchReport(
  type: string,
  params?: { from?: string; to?: string },
): Promise<unknown> {
  const search = new URLSearchParams();
  if (params?.from) search.set('from', params.from);
  if (params?.to) search.set('to', params.to);
  const qs = search.toString();
  return api.get(`/admin/reports/${type}${qs ? `?${qs}` : ''}`);
}
