'use client';

import { api } from './api';
import { useQuery } from '@tanstack/react-query';

export const AFFILIATE_QUERY_KEYS = {
  stats: 'affiliate-stats',
  clicks: 'affiliate-clicks',
  topProducts: 'affiliate-top-products',
  referral: 'affiliate-referral',
};

export interface AffiliateStat {
  label: string;
  value: string;
  icon: string;
  change: string;
  color: string;
}

export interface AffiliateStatsResponse {
  stats: AffiliateStat[];
  totalEarnings: number;
  availableBalance: number;
  pendingAmount: number;
  paidAmount: number;
}

export interface AffiliateClick {
  product: string;
  commission: string;
  time: string;
  converted: boolean;
}

export interface AffiliateTopProduct {
  name: string;
  clicks: number;
  conversions: number;
  revenue: string;
}

export interface AffiliateReferral {
  code: string;
}

async function fetchStats(): Promise<AffiliateStatsResponse> {
  try {
    return await api.get<AffiliateStatsResponse>('/affiliate/stats');
  } catch {
    return {
      stats: [],
      totalEarnings: 0,
      availableBalance: 0,
      pendingAmount: 0,
      paidAmount: 0,
    };
  }
}

async function fetchClicks(): Promise<AffiliateClick[]> {
  try {
    const data = await api.get<{ clicks: AffiliateClick[] }>('/affiliate/clicks');
    return data.clicks || [];
  } catch {
    return [];
  }
}

async function fetchTopProducts(): Promise<AffiliateTopProduct[]> {
  try {
    const data = await api.get<{ products: AffiliateTopProduct[] }>('/affiliate/top-products');
    return data.products || [];
  } catch {
    return [];
  }
}

async function fetchReferral(): Promise<AffiliateReferral> {
  try {
    return await api.get<AffiliateReferral>('/affiliate/referral');
  } catch {
    return { code: '' };
  }
}

export function useGetAffiliateStats() {
  return useQuery({
    queryKey: [AFFILIATE_QUERY_KEYS.stats],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 2,
  });
}

export function useGetAffiliateClicks() {
  return useQuery({
    queryKey: [AFFILIATE_QUERY_KEYS.clicks],
    queryFn: fetchClicks,
    staleTime: 1000 * 60,
  });
}

export function useGetAffiliateTopProducts() {
  return useQuery({
    queryKey: [AFFILIATE_QUERY_KEYS.topProducts],
    queryFn: fetchTopProducts,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetAffiliateReferral() {
  return useQuery({
    queryKey: [AFFILIATE_QUERY_KEYS.referral],
    queryFn: fetchReferral,
    staleTime: 1000 * 60 * 5,
  });
}
