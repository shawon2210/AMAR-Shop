'use client';

import { api } from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const SELLER_QUERY_KEYS = {
  dashboard: 'seller-dashboard',
  products: 'seller-products',
  orders: 'seller-orders',
  inventory: 'seller-inventory',
  analytics: 'seller-analytics',
  finance: 'seller-finance',
  store: 'seller-store',
  campaigns: 'seller-campaigns',
  chat: 'seller-chat',
  kyc: 'seller-kyc',
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalFollowers: number;
  avgRating: number;
  recentOrders: DashboardOrder[];
  revenueChart: { date: string; amount: number }[];
  sellerProfile: {
    level: string;
    performanceScore: number;
    responseRate: number;
    onTimeDelivery: number;
    cancellationRate: number;
    returnsRate: number;
  };
}

export interface DashboardOrder {
  id: string;
  customer: string;
  product: string;
  total: number;
  status: string;
  date: string;
}

export interface SellerProduct {
  id: number;
  name: string;
  images: string[];
  price: number;
  stockCount: number;
  status: string;
  soldCount: number;
  sku: string;
}

export interface SellerProductsResponse {
  products: SellerProduct[];
  total: number;
  totalPages: number;
}

export interface SellerOrder {
  id: string;
  customer: string;
  product: string;
  qty: number;
  total: number;
  status: string;
  date: string;
  items: { name: string; qty: number; price: string; image: string }[];
  address: string;
  timeline: string[];
}

export interface SellerOrdersResponse {
  orders: SellerOrder[];
  total: number;
  totalPages: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  stockCount: number;
  soldCount: number;
  price: number;
  images: string[];
  status: string;
}

export interface InventoryResponse {
  products: InventoryItem[];
  total: number;
  totalPages: number;
  lowStockCount: number;
}

export interface AnalyticsData {
  salesChart: { date: string; sales: number; revenue: number }[];
  topProducts: { id: number; name: string; images: string[]; soldCount: number; revenue: number }[];
  categoryBreakdown: { category: string; count: number; revenue: number }[];
  totalViews: number;
  totalOrders: number;
  conversion: number;
}

export interface FinanceData {
  wallet: { balance: number; totalEarned: number; totalSpent: number };
  pendingPayouts: number;
  pendingPayoutsCount: number;
  commissions: { id: number; amount: number; type: string; status: string; createdAt: string }[];
  payoutHistory: { id: number; amount: number; status: string; createdAt: string }[];
}

export interface StoreData {
  store: {
    id: string;
    name: string;
    slug: string;
    description: string;
    logo: string;
    banner: string;
    isActive: boolean;
    followerCount: number;
  };
  sellerProfile: {
    businessName: string;
    businessAddress: string;
    businessType: string;
    isKycVerified: boolean;
    level: string;
    performanceScore: number;
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalFollowers: number;
    avgRating: number;
    vacationMode: boolean;
    vacationMessage: string;
    vacationUntil: string;
  };
}

export interface CampaignData {
  id: number;
  name: string;
  type: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: string;
  usageCount: number;
  budget: number;
  spent: number;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

function formattedPrice(amount: number): string {
  return `৳${amount.toLocaleString('en-IN')}`;
}

async function fetchDashboard(): Promise<DashboardStats> {
  return await api.get<DashboardStats>('/seller/dashboard');
}

async function fetchProducts(params: PaginationParams = {}): Promise<SellerProductsResponse> {
  const { page = 1, limit = 10, status, search: q } = params;
  let path = `/seller/products?page=${page}&limit=${limit}`;
  if (status && status !== 'All') path += `&status=${status}`;
  if (q) path += `&search=${encodeURIComponent(q)}`;
  return api.get<SellerProductsResponse>(path);
}

async function fetchOrders(params: PaginationParams = {}): Promise<SellerOrdersResponse> {
  const { page = 1, limit = 10, status, search: q } = params;
  let path = `/seller/orders?page=${page}&limit=${limit}`;
  if (status && status !== 'All') path += `&status=${status}`;
  if (q) path += `&search=${encodeURIComponent(q)}`;
  return api.get<SellerOrdersResponse>(path);
}

async function fetchInventory(params: { page?: number; limit?: number; lowStock?: boolean } = {}): Promise<InventoryResponse> {
  const { page = 1, limit = 20, lowStock } = params;
  let path = `/seller/inventory?page=${page}&limit=${limit}`;
  if (lowStock) path += '&lowStock=true';
  return api.get<InventoryResponse>(path);
}

async function fetchAnalytics(from?: string, to?: string): Promise<AnalyticsData> {
  let path = '/seller/analytics';
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const qs = params.toString();
  if (qs) path += `?${qs}`;
  return api.get<AnalyticsData>(path);
}

async function fetchFinance(): Promise<FinanceData> {
  return api.get<FinanceData>('/seller/finance');
}

async function fetchStore(): Promise<StoreData> {
  return api.get<StoreData>('/seller/store');
}

async function updateStore(data: Partial<StoreData['store'] & StoreData['sellerProfile']>): Promise<StoreData> {
  return api.put<StoreData>('/seller/store', data);
}

async function fetchCampaigns(): Promise<CampaignData[]> {
  try {
    const path = `${API_BASE}/seller/campaigns`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('amarshop-auth') : null;
    let accessToken = '';
    if (token) {
      try { const p = JSON.parse(token); accessToken = p?.state?.accessToken || ''; } catch {}
    }
    const res = await fetch(path, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function fetchChatMessages(): Promise<unknown[]> {
  try {
    return api.get<unknown[]>('/seller/chat/messages');
  } catch {
    return [];
  }
}

export function useSellerDashboard() {
  return useQuery({
    queryKey: [SELLER_QUERY_KEYS.dashboard],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSellerProducts(params: PaginationParams = {}) {
  return useQuery({
    queryKey: [SELLER_QUERY_KEYS.products, params],
    queryFn: () => fetchProducts(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useSellerOrders(params: PaginationParams = {}) {
  return useQuery({
    queryKey: [SELLER_QUERY_KEYS.orders, params],
    queryFn: () => fetchOrders(params),
    staleTime: 1000 * 30,
  });
}

export function useSellerInventory(params: { page?: number; limit?: number; lowStock?: boolean } = {}) {
  return useQuery({
    queryKey: [SELLER_QUERY_KEYS.inventory, params],
    queryFn: () => fetchInventory(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useSellerAnalytics(from?: string, to?: string) {
  return useQuery({
    queryKey: [SELLER_QUERY_KEYS.analytics, { from, to }],
    queryFn: () => fetchAnalytics(from, to),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSellerFinance() {
  return useQuery({
    queryKey: [SELLER_QUERY_KEYS.finance],
    queryFn: fetchFinance,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSellerStore() {
  return useQuery({
    queryKey: [SELLER_QUERY_KEYS.store],
    queryFn: fetchStore,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSellerCampaigns() {
  return useQuery({
    queryKey: [SELLER_QUERY_KEYS.campaigns],
    queryFn: fetchCampaigns,
    staleTime: 1000 * 60 * 5,
  });
}

export function useChatMessages() {
  return useQuery({
    queryKey: [SELLER_QUERY_KEYS.chat],
    queryFn: fetchChatMessages,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });
}

export function useUpdateSellerStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<StoreData['store'] & StoreData['sellerProfile']>) => updateStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SELLER_QUERY_KEYS.store] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/seller/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SELLER_QUERY_KEYS.orders] });
      queryClient.invalidateQueries({ queryKey: [SELLER_QUERY_KEYS.dashboard] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/seller/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SELLER_QUERY_KEYS.products] });
      queryClient.invalidateQueries({ queryKey: [SELLER_QUERY_KEYS.dashboard] });
    },
  });
}

export { formattedPrice };
