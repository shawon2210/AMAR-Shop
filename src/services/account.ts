'use client';

import { api } from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Product } from '@/types';

export const ACCOUNT_QUERY_KEYS = {
  wishlist: 'account-wishlist',
  reviews: 'account-reviews',
  profile: 'account-profile',
};

/* ─── Wishlist ─── */

interface WishlistResponse {
  items: Product[];
  total: number;
}

async function fetchWishlist(): Promise<WishlistResponse> {
  try {
    return await api.get<WishlistResponse>('/account/wishlist');
  } catch {
    return { items: [], total: 0 };
  }
}

async function addToWishlist(productId: string): Promise<void> {
  await api.post('/account/wishlist', { productId });
}

async function removeFromWishlist(productId: string): Promise<void> {
  await api.delete(`/account/wishlist/${productId}`);
}

export function useGetWishlist() {
  return useQuery({
    queryKey: [ACCOUNT_QUERY_KEYS.wishlist],
    queryFn: fetchWishlist,
    staleTime: 1000 * 60,
  });
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => addToWishlist(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ACCOUNT_QUERY_KEYS.wishlist] }),
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ACCOUNT_QUERY_KEYS.wishlist] }),
  });
}

/* ─── Reviews ─── */

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsResponse {
  reviews: Review[];
  total: number;
}

async function fetchReviews(): Promise<ReviewsResponse> {
  try {
    return await api.get<ReviewsResponse>('/account/reviews');
  } catch {
    return { reviews: [], total: 0 };
  }
}

export function useGetReviews() {
  return useQuery({
    queryKey: [ACCOUNT_QUERY_KEYS.reviews],
    queryFn: fetchReviews,
    staleTime: 1000 * 60 * 2,
  });
}

/* ─── Profile Settings ─── */

async function updateProfile(data: { name: string; email: string }): Promise<void> {
  await api.put('/auth/profile', data);
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; email: string }) => updateProfile(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ACCOUNT_QUERY_KEYS.profile] }),
  });
}
