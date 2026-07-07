import { api } from '@/services/api';
import type {
  AdminBanner,
  AdminCoupon,
  FlashSaleCampaign,
  PaginatedCoupons,
  AdminReview,
  PaginatedReviews,
  AdminAffiliate,
  PaginatedAffiliates,
  AdminCreator,
  PaginatedCreators,
} from '@/types';

// ─── Coupons ──────────────────────────────────────────────

export function fetchCoupons(params: {
  page?: number;
  limit?: number;
  isActive?: boolean;
}): Promise<PaginatedCoupons> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.isActive !== undefined) search.set('isActive', String(params.isActive));
  return api.get<PaginatedCoupons>(`/admin/coupons?${search.toString()}`);
}

export function createCoupon(data: unknown): Promise<AdminCoupon> {
  return api.post<AdminCoupon>('/admin/coupons', data);
}

export function updateCoupon(id: string, data: unknown): Promise<unknown> {
  return api.put(`/admin/coupons/${id}`, data);
}

export function deleteCoupon(id: string): Promise<unknown> {
  return api.delete(`/admin/coupons/${id}`);
}

// ─── Banners ──────────────────────────────────────────────

export function fetchBanners(): Promise<AdminBanner[]> {
  return api.get<AdminBanner[]>('/admin/banners');
}

export function createBanner(data: unknown): Promise<AdminBanner> {
  return api.post<AdminBanner>('/admin/banners', data);
}

export function updateBanner(id: string, data: unknown): Promise<unknown> {
  return api.put(`/admin/banners/${id}`, data);
}

export function deleteBanner(id: string): Promise<unknown> {
  return api.delete(`/admin/banners/${id}`);
}

// ─── Flash Sales ──────────────────────────────────────────

export function fetchFlashSales(): Promise<FlashSaleCampaign[]> {
  return api.get<FlashSaleCampaign[]>('/admin/flash-sales');
}

export function createFlashSale(data: unknown): Promise<FlashSaleCampaign> {
  return api.post<FlashSaleCampaign>('/admin/flash-sales', data);
}

export function updateFlashSale(id: string, data: unknown): Promise<unknown> {
  return api.put(`/admin/flash-sales/${id}`, data);
}

export function deleteFlashSale(id: string): Promise<unknown> {
  return api.delete(`/admin/flash-sales/${id}`);
}

export function addCampaignProduct(
  campaignId: string,
  data: { productId: string; salePrice?: number; discount?: number; quantity?: number },
): Promise<unknown> {
  return api.post(`/admin/flash-sales/${campaignId}/products`, data);
}

// ─── Reviews ──────────────────────────────────────────────

export function fetchReviews(params: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PaginatedReviews> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.status) search.set('status', params.status);
  return api.get<PaginatedReviews>(`/admin/reviews?${search.toString()}`);
}

export function updateReview(id: string, data: { status?: string; reported?: boolean }): Promise<unknown> {
  return api.put(`/admin/reviews/${id}`, data);
}

export function deleteReview(id: string): Promise<unknown> {
  return api.delete(`/admin/reviews/${id}`);
}

// ─── Affiliates ───────────────────────────────────────────

export function fetchAdminAffiliates(params: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PaginatedAffiliates> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.status) search.set('status', params.status);
  return api.get<PaginatedAffiliates>(`/admin/affiliates?${search.toString()}`);
}

export function updateAdminAffiliate(id: string, data: { status?: string }): Promise<unknown> {
  return api.put(`/admin/affiliates/${id}`, data);
}

// ─── Creators ─────────────────────────────────────────────

export function fetchAdminCreators(params: {
  page?: number;
  limit?: number;
}): Promise<PaginatedCreators> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  return api.get<PaginatedCreators>(`/admin/creators?${search.toString()}`);
}
