import type { PaginatedResponse } from './common';

// ─── Coupons ────────────────────────────────────────────

export interface AdminCoupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minPurchase: number;
  maxUses: number | null;
  maxPerUser: number;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export type PaginatedCoupons = PaginatedResponse<AdminCoupon> & { coupons: AdminCoupon[] };

// ─── Flash Sales ────────────────────────────────────────

export interface FlashSaleProductEntry {
  id: string;
  flashSalePrice: number;
  quantity: number;
  sold: number;
  product: {
    id: string;
    name: string;
    images: string[];
    price: number;
  };
}

export interface FlashSaleStore {
  id: string;
  name: string;
}

export interface FlashSaleCampaign {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  description?: string;
  banner?: string;
  discount: number | null;
  maxProducts?: number;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  store: FlashSaleStore | null;
  products: FlashSaleProductEntry[];
}

// ─── Banners ────────────────────────────────────────────

export interface AdminBanner {
  id: string;
  title: string;
  image: string;
  link: string | null;
  position: string;
  sortOrder: number;
  isActive: boolean;
}
