// ─── Domain API functions ─────────────────────────────────
export * from './admin/dashboard';
export * from './admin/users';
export * from './admin/sellers';
export * from './admin/products';
export * from './admin/orders';
export * from './admin/payments';
export * from './admin/categories';
export * from './admin/marketing';
export * from './admin/cms-support';
export * from './admin/finance';
export * from './admin/analytics';
export * from './admin/settings';
export * from './admin/compliance';
export * from './admin/warehouse';
export * from './admin/bi';

// ─── Type re-exports for backward compatibility ───────────
export type {
  DashboardStats,
  UserSummary,
  PaginatedUsers,
  SellerSummary,
  PaginatedSellers,
  AdminProduct,
  PaginatedProducts,
  AdminOrder,
  PaginatedOrders,
  AdminPayment,
  PaginatedPayments,
  FlashSaleCampaign,
  AdminCategory,
  AdminBanner,
  AdminCoupon,
  PaginatedCoupons,
  AdminAnalytics,
  SupportTicket,
  SupportMessage,
  PaginatedTickets,
  CMSPage,
  Announcement,
  FinanceDashboard,
  Settlement,
  PaginatedSettlements,
  Invoice,
  PaginatedInvoices,
  TaxReport,
  EscrowTransaction,
  PaginatedEscrow,
  CreditNote,
  CommissionEntry,
  PaginatedCommissions,
  AdminReview,
  PaginatedReviews,
  AdminAffiliate,
  PaginatedAffiliates,
  AdminCreator,
  PaginatedCreators,
  ComplianceDashboard,
  WarehouseDashboard,
  StockAlert,
  CourierPerformance,
  Shipment,
  RFMSegment,
  CohortRow,
} from '@/types';
