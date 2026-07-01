import { api } from '@/services/api';

// ─── Dashboard ────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  revenueChart: { date: string; revenue: number }[];
  recentOrders: unknown[];
  pendingSellerApprovals: number;
  lowStockAlerts: number;
}

export function fetchDashboard(): Promise<DashboardStats> {
  return api.get<DashboardStats>('/admin/dashboard');
}

// ─── Users ────────────────────────────────────────────────

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

export interface PaginatedUsers {
  users: UserSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function fetchUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<PaginatedUsers> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.search) search.set('search', params.search);
  if (params.role) search.set('role', params.role);
  return api.get<PaginatedUsers>(`/admin/users?${search.toString()}`);
}

export function updateUser(
  id: string,
  data: { isActive?: boolean; role?: string; isVerified?: boolean },
): Promise<unknown> {
  return api.put(`/admin/users/${id}`, data);
}

// ─── Sellers ──────────────────────────────────────────────

export interface SellerSummary {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  isActive: boolean;
  createdAt: string;
  store: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    followerCount: number;
    rating: number;
  } | null;
  sellerProfile: {
    id: string;
    isKycVerified: boolean;
    kycSubmittedAt: string | null;
    kycVerifiedAt: string | null;
    kycRejectedReason: string | null;
    level: string;
    performanceScore: number;
    totalOrders: number;
    totalRevenue: number;
  } | null;
}

export interface PaginatedSellers {
  sellers: SellerSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

// ─── Products ─────────────────────────────────────────────

export interface AdminProduct {
  id: string;
  name: string;
  status: string;
  price: number;
  stockCount: number;
  soldCount: number;
  images: string[];
  createdAt: string;
  category: { id: string; name: string } | null;
  store: { id: string; name: string } | null;
}

export interface PaginatedProducts {
  products: AdminProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function fetchProducts(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  category?: string;
}): Promise<PaginatedProducts> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.status) search.set('status', params.status);
  if (params.search) search.set('search', params.search);
  if (params.category) search.set('category', params.category);
  return api.get<PaginatedProducts>(`/admin/products?${search.toString()}`);
}

export function approveProduct(id: string): Promise<unknown> {
  return api.post(`/admin/products/${id}/approve`, {});
}

export function rejectProduct(id: string, reason: string): Promise<unknown> {
  return api.post(`/admin/products/${id}/reject`, { reason });
}

// ─── Orders ───────────────────────────────────────────────

export interface AdminOrder {
  id: string;
  orderNumber?: string;
  status: string;
  total: number;
  paymentStatus: boolean;
  createdAt: string;
  user: { id: string; name: string; phone: string };
  items: {
    id: string;
    quantity: number;
    price: number;
    product: { id: string; name: string; images: string[] };
  }[];
  address?: unknown;
}

export interface PaginatedOrders {
  orders: AdminOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

// ─── Payments ─────────────────────────────────────────────

export interface AdminPayment {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  order: { id: string; orderNumber: string } | null;
  user: { id: string; name: string };
}

export interface PaginatedPayments {
  payments: AdminPayment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

// ─── Flash Sales ──────────────────────────────────────────

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
  store: { id: string; name: string } | null;
  products: {
    id: string;
    flashSalePrice: number;
    quantity: number;
    sold: number;
    product: { id: string; name: string; images: string[]; price: number };
  }[];
}

export function fetchFlashSales(): Promise<FlashSaleCampaign[]> {
  return api.get<FlashSaleCampaign[]>('/admin/flash-sales');
}

export function createFlashSale(data: unknown): Promise<FlashSaleCampaign> {
  return api.post<FlashSaleCampaign>('/admin/flash-sales', data);
}

// ─── Categories ───────────────────────────────────────────

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
  parentId: string | null;
  _count: { products: number };
  parent: { id: string; name: string } | null;
}

export function fetchCategories(): Promise<AdminCategory[]> {
  return api.get<AdminCategory[]>('/admin/categories');
}

export function createCategory(data: unknown): Promise<AdminCategory> {
  return api.post<AdminCategory>('/admin/categories', data);
}

// ─── Banners ──────────────────────────────────────────────

export interface AdminBanner {
  id: string;
  title: string;
  image: string;
  link: string | null;
  position: string;
  sortOrder: number;
  isActive: boolean;
}

export function fetchBanners(): Promise<AdminBanner[]> {
  return api.get<AdminBanner[]>('/admin/banners');
}

export function createBanner(data: unknown): Promise<AdminBanner> {
  return api.post<AdminBanner>('/admin/banners', data);
}

// ─── Coupons ──────────────────────────────────────────────

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

export interface PaginatedCoupons {
  coupons: AdminCoupon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

// ─── Analytics & Reports ──────────────────────────────────

export interface AdminAnalytics {
  revenueChart: { date: string; revenue: number }[];
  orderStats: { status: string; _count: { id: number } }[];
  userStats: { role: string; _count: { id: number } }[];
  topCategories: {
    categoryId: string;
    categoryName: string;
    productCount: number;
    totalSold: number;
  }[];
  topSellers: {
    id: string;
    name: string;
    followerCount: number;
    rating: number;
    _count: { products: number };
  }[];
}

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

// ─── Settings ─────────────────────────────────────────────

export function updateSettings(data: unknown): Promise<unknown> {
  return api.put('/admin/settings', data);
}

// ─── Support Tickets ──────────────────────────────────────

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string | null;
  status: string;
  priority: string;
  assignedTo: string | null;
  createdAt: string;
  user: { id: string; name: string; phone: string; avatar: string | null };
  messages?: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string; avatar: string | null };
}

export interface PaginatedTickets {
  tickets: SupportTicket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function fetchSupportTickets(params: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
}): Promise<PaginatedTickets> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.status) search.set('status', params.status);
  if (params.priority) search.set('priority', params.priority);
  return api.get<PaginatedTickets>(`/admin/support-tickets?${search.toString()}`);
}

export function fetchSupportTicket(id: string): Promise<SupportTicket> {
  return api.get<SupportTicket>(`/admin/support-tickets/${id}`);
}

export function replyToSupportTicket(id: string, content: string): Promise<SupportMessage> {
  return api.post<SupportMessage>(`/admin/support-tickets/${id}/reply`, { content });
}

export function updateSupportTicket(
  id: string,
  data: { status?: string; priority?: string; assignedTo?: string },
): Promise<SupportTicket> {
  return api.put<SupportTicket>(`/admin/support-tickets/${id}`, data);
}

// ─── New endpoints (Phase 1) ───────────────────────────

export function createProduct(data: unknown): Promise<unknown> {
  return api.post('/admin/products', data);
}

export function updateProduct(id: string, data: unknown): Promise<unknown> {
  return api.put(`/admin/products/${id}`, data);
}

export function deleteProduct(id: string): Promise<unknown> {
  return api.delete(`/admin/products/${id}`);
}

export function updateOrderStatus(
  id: string,
  status: string,
): Promise<unknown> {
  return api.put(`/admin/orders/${id}/status`, { status });
}

export function addOrderNote(id: string, note: string): Promise<unknown> {
  return api.post(`/admin/orders/${id}/notes`, { note });
}

export function updateSeller(
  id: string,
  data: unknown,
): Promise<unknown> {
  return api.put(`/admin/sellers/${id}`, data);
}

export function toggleStoreStatus(id: string): Promise<unknown> {
  return api.put(`/admin/sellers/${id}/store-status`, {});
}

export function createAdminUser(data: {
  name: string;
  phone: string;
  password: string;
  email?: string;
}): Promise<unknown> {
  return api.post('/admin/users', data);
}

// ─── Phase 2: Categories ─────────────────────────────────

export function updateCategory(id: string, data: unknown): Promise<unknown> {
  return api.put(`/admin/categories/${id}`, data);
}

export function deleteCategory(id: string): Promise<unknown> {
  return api.delete(`/admin/categories/${id}`);
}

// ─── Phase 2: Coupons ────────────────────────────────────

export function updateCoupon(id: string, data: unknown): Promise<unknown> {
  return api.put(`/admin/coupons/${id}`, data);
}

export function deleteCoupon(id: string): Promise<unknown> {
  return api.delete(`/admin/coupons/${id}`);
}

// ─── Phase 2: Banners ────────────────────────────────────

export function updateBanner(id: string, data: unknown): Promise<unknown> {
  return api.put(`/admin/banners/${id}`, data);
}

export function deleteBanner(id: string): Promise<unknown> {
  return api.delete(`/admin/banners/${id}`);
}

// ─── Phase 2: Flash Sales ────────────────────────────────

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

// ─── Phase 2: CMS Pages ──────────────────────────────────

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function fetchCMSPages(): Promise<CMSPage[]> {
  return api.get<CMSPage[]>('/admin/cms/pages');
}

export function createCMSPage(data: {
  title: string;
  slug?: string;
  content?: string;
  metaTitle?: string;
  metaDesc?: string;
}): Promise<CMSPage> {
  return api.post<CMSPage>('/admin/cms/pages', data);
}

export function updateCMSPage(id: string, data: unknown): Promise<CMSPage> {
  return api.put<CMSPage>(`/admin/cms/pages/${id}`, data);
}

export function deleteCMSPage(id: string): Promise<unknown> {
  return api.delete(`/admin/cms/pages/${id}`);
}

// ─── Phase 2: Announcements ──────────────────────────────

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export function fetchAnnouncements(): Promise<Announcement[]> {
  return api.get<Announcement[]>('/admin/cms/announcements');
}

export function createAnnouncement(data: {
  title: string;
  message: string;
  type?: string;
  expiresAt?: string;
}): Promise<Announcement> {
  return api.post<Announcement>('/admin/cms/announcements', data);
}

export function updateAnnouncement(
  id: string,
  data: unknown,
): Promise<Announcement> {
  return api.put<Announcement>(`/admin/cms/announcements/${id}`, data);
}

export function deleteAnnouncement(id: string): Promise<unknown> {
  return api.delete(`/admin/cms/announcements/${id}`);
}

// ─── Phase 3: Finance ──────────────────────────────────

export interface FinanceDashboard {
  totalRevenue: number;
  pendingSettlementAmount: number;
  totalCommission: number;
  netCashFlow: number;
  pendingSettlements: Array<{
    id: string;
    settlementNumber: string;
    grossAmount: number;
    netAmount: number;
    status: string;
    createdAt: string;
    seller: { id: string; name: string };
  }>;
}

export function fetchFinanceDashboard(): Promise<FinanceDashboard> {
  return api.get<FinanceDashboard>('/admin/finance/dashboard');
}

export interface Settlement {
  id: string;
  settlementNumber: string;
  sellerId: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  commission: number;
  fee: number;
  netAmount: number;
  status: string;
  createdAt: string;
  seller: { id: string; name: string };
}

export interface PaginatedSettlements {
  settlements: Settlement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function fetchSettlements(params: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PaginatedSettlements> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.status) search.set('status', params.status);
  return api.get<PaginatedSettlements>(`/admin/finance/settlements?${search.toString()}`);
}

export function generateSettlement(data: {
  sellerId: string;
  periodStart: string;
  periodEnd: string;
}): Promise<Settlement> {
  return api.post<Settlement>('/admin/finance/settlements', data);
}

export function processSettlement(id: string, data: { status: string }): Promise<unknown> {
  return api.put(`/admin/finance/settlements/${id}`, data);
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  sellerId: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  dueDate: string | null;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
  seller: { id: string; name: string };
  order: { id: string; orderNumber: string };
}

export interface PaginatedInvoices {
  invoices: Invoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function fetchInvoices(params: {
  page?: number;
  limit?: number;
}): Promise<PaginatedInvoices> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  return api.get<PaginatedInvoices>(`/admin/finance/invoices?${search.toString()}`);
}

export function createInvoice(data: {
  orderId: string;
  sellerId: string;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  dueDate?: string;
  notes?: string;
}): Promise<Invoice> {
  return api.post<Invoice>('/admin/finance/invoices', data);
}

export function updateInvoice(id: string, data: unknown): Promise<Invoice> {
  return api.put<Invoice>(`/admin/finance/invoices/${id}`, data);
}

export interface TaxReport {
  quarter: number;
  year: number;
  totalRevenue: number;
  vatRate: number;
  totalVat: number;
  totalOrders: number;
  monthly: Array<{ month: string; revenue: number; taxable: number; vat: number }>;
  period: { from: string; to: string };
}

export function fetchTaxReport(quarter: string, year: string): Promise<TaxReport> {
  return api.get<TaxReport>(`/admin/finance/tax?quarter=${quarter}&year=${year}`);
}

export interface EscrowTransaction {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  heldAt: string;
  releasedAt: string | null;
  order: { id: string; orderNumber: string; total: number };
}

export interface PaginatedEscrow {
  transactions: EscrowTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function fetchEscrowTransactions(params: {
  page?: number;
  limit?: number;
}): Promise<PaginatedEscrow> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  return api.get<PaginatedEscrow>(`/admin/finance/escrow?${search.toString()}`);
}

export interface CreditNote {
  id: string;
  creditNoteNumber: string;
  amount: number;
  reason: string | null;
  status: string;
  createdAt: string;
  order: { id: string; orderNumber: string; total: number };
  returnRequest: { id: string; reason: string } | null;
}

export function fetchCreditNotes(): Promise<CreditNote[]> {
  return api.get<CreditNote[]>('/admin/finance/credit-notes');
}

export interface CommissionEntry {
  id: string;
  orderId: string;
  sellerId: string;
  amount: number;
  rate: number;
  status: string;
  createdAt: string;
  seller: { id: string; name: string };
  order: { id: string; orderNumber: string };
}

export interface PaginatedCommissions {
  commissions: CommissionEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function fetchCommissions(params: {
  page?: number;
  limit?: number;
}): Promise<PaginatedCommissions> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  return api.get<PaginatedCommissions>(`/admin/finance/commissions?${search.toString()}`);
}

// ─── Phase 4: Reviews ─────────────────────────────────

export interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  status: string;
  reported: boolean;
  createdAt: string;
  user: { id: string; name: string; avatar: string | null };
  product: { id: string; name: string; slug: string; price: number };
}

export interface PaginatedReviews {
  reviews: AdminReview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

// ─── Phase 4: Affiliates (admin) ──────────────────────

export interface AdminAffiliate {
  id: string;
  referralCode: string;
  status: string;
  totalEarned: number;
  createdAt: string;
  user: { id: string; name: string; email: string; phone: string; avatar: string | null };
  _count: { clicks: number; conversions: number; commissions: number };
}

export interface PaginatedAffiliates {
  affiliates: AdminAffiliate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

// ─── Phase 4: Creators (admin) ────────────────────────

export interface AdminCreator {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  createdAt: string;
  _count: { reviews: number; storeFollowers: number };
}

export interface PaginatedCreators {
  creators: AdminCreator[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function fetchAdminCreators(params: {
  page?: number;
  limit?: number;
}): Promise<PaginatedCreators> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  return api.get<PaginatedCreators>(`/admin/creators?${search.toString()}`);
}

// ─── Phase 4: Compliance ──────────────────────────────

export interface ComplianceDashboard {
  totalSellers: number;
  kycVerified: number;
  pendingVerification: number;
  flaggedProducts: number;
  openDisputes: number;
  returnRequests: number;
  recentReports: number;
  lastUpdated: string;
}

export function fetchComplianceDashboard(): Promise<ComplianceDashboard> {
  return api.get<ComplianceDashboard>('/admin/compliance');
}
