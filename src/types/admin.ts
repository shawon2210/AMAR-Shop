import type { PaginatedResponse, OrderStatus } from './common';

// ─── Dashboard ──────────────────────────────────────────

export interface RecentOrder {
  id: string;
  orderNumber?: string;
  status: string;
  total: number;
  createdAt: string;
  user: { id: string; name: string; phone: string };
}

export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  revenueChart: { date: string; revenue: number }[];
  recentOrders: RecentOrder[] | null;
  pendingSellerApprovals: number;
  lowStockAlerts: number;
}

// ─── Users ──────────────────────────────────────────────

export interface UserSummary {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: string;
  isSeller: boolean;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  avatar: string | null;
}

export type PaginatedUsers = PaginatedResponse<UserSummary> & { users: UserSummary[] };

// ─── Sellers ────────────────────────────────────────────

export interface SellerStore {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  followerCount: number;
  rating: number;
  _count?: { products: number };
}

export interface SellerProfile {
  id: string;
  isKycVerified: boolean;
  kycSubmittedAt: string | null;
  kycVerifiedAt: string | null;
  kycRejectedReason: string | null;
  level: string;
  performanceScore: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface SellerSummary {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  isActive: boolean;
  createdAt: string;
  store: SellerStore | null;
  sellerProfile: SellerProfile | null;
}

export type PaginatedSellers = PaginatedResponse<SellerSummary> & { sellers: SellerSummary[] };

// ─── Products ───────────────────────────────────────────

export interface AdminProductCategory {
  id: string;
  name: string;
}

export interface AdminProductStore {
  id: string;
  name: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  title?: string;
  status: string;
  price: number;
  stockCount: number;
  soldCount: number;
  images: string[];
  createdAt: string;
  category: AdminProductCategory | null;
  store: AdminProductStore | null;
}

export type PaginatedProducts = PaginatedResponse<AdminProduct> & { products: AdminProduct[] };

// ─── Orders ─────────────────────────────────────────────

export interface OrderUser {
  id: string;
  name: string;
  phone: string;
}

export interface OrderItemProduct {
  id: string;
  name: string;
  images: string[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: OrderItemProduct;
}

export interface AdminOrder {
  id: string;
  orderNumber?: string;
  status: string;
  total: number;
  paymentStatus: boolean;
  createdAt: string;
  user: OrderUser;
  items: OrderItem[];
  note?: string;
  address?: unknown;
}

export type PaginatedOrders = PaginatedResponse<AdminOrder> & { orders: AdminOrder[] };

// ─── Payments ───────────────────────────────────────────

export interface PaymentOrder {
  id: string;
  orderNumber: string;
}

export interface PaymentUser {
  id: string;
  name: string;
}

export interface AdminPayment {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  orderId?: string;
  order: PaymentOrder | null;
  user: PaymentUser;
}

export type PaginatedPayments = PaginatedResponse<AdminPayment> & { payments: AdminPayment[] };

// ─── Categories ─────────────────────────────────────────

export interface CategoryParent {
  id: string;
  name: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  bnName?: string | null;
  slug: string;
  icon: string | null;
  sortOrder: number;
  parentId: string | null;
  _count: { products: number };
  parent: CategoryParent | null;
  children?: AdminCategory[];
}

// ─── Analytics ──────────────────────────────────────────

export interface AnalyticsTopCategory {
  categoryId: string;
  categoryName: string;
  productCount: number;
  totalSold: number;
}

export interface AnalyticsTopSeller {
  id: string;
  name: string;
  followerCount: number;
  rating: number;
  _count: { products: number };
}

export interface AdminAnalytics {
  revenueChart: { date: string; revenue: number }[];
  orderStats: { status: string; _count: { id: number } }[];
  userStats: { role: string; _count: { id: number } }[];
  topCategories: AnalyticsTopCategory[];
  topSellers: AnalyticsTopSeller[];
}

// ─── Reviews ────────────────────────────────────────────

export interface ReviewUser {
  id: string;
  name: string;
  avatar: string | null;
}

export interface ReviewProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
}

export interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  status: string;
  reported: boolean;
  createdAt: string;
  user: ReviewUser;
  product: ReviewProduct;
}

export type PaginatedReviews = PaginatedResponse<AdminReview> & { reviews: AdminReview[] };

// ─── Affiliates ─────────────────────────────────────────

export interface AffiliateUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

export interface AffiliateCounts {
  clicks: number;
  conversions: number;
  commissions: number;
}

export interface AdminAffiliate {
  id: string;
  referralCode: string;
  status: string;
  totalEarned: number;
  createdAt: string;
  user: AffiliateUser;
  _count: AffiliateCounts;
}

export type PaginatedAffiliates = PaginatedResponse<AdminAffiliate> & { affiliates: AdminAffiliate[] };

// ─── Creators ───────────────────────────────────────────

export interface CreatorCounts {
  reviews: number;
  storeFollowers: number;
}

export interface AdminCreator {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  createdAt: string;
  _count: CreatorCounts;
}

export type PaginatedCreators = PaginatedResponse<AdminCreator> & { creators: AdminCreator[] };

// ─── Reports ────────────────────────────────────────────

export interface ReportData {
  totalSales?: number;
  totalOrders?: number;
  avgOrderValue?: number;
  orders?: unknown[];
  products?: AdminProduct[];
  sellers?: SellerSummary[];
  totalProducts?: number;
  totalSold?: number;
  totalSellers?: number;
  period?: { from: string; to: string };
}
