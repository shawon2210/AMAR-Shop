export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DateRange {
  from?: string;
  to?: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ApiError {
  message: string;
  status: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'RETURNED';

export type PaymentMethod = 'bkash' | 'nagad' | 'cod' | 'sslcommerz';

export type PaymentStatus = 'PAID' | 'UNPAID' | 'REFUNDED' | 'PARTIALLY_REFUNDED';

export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN' | 'LOGISTICS' | 'MODERATOR';

export const ORDER_STATUS_COLORS: Record<string, string> = {
  DELIVERED: 'bg-green-100 text-green-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  PENDING: 'bg-amber-100 text-amber-700',
  CANCELLED: 'bg-red-100 text-red-700',
  CONFIRMED: 'bg-sky-100 text-sky-700',
  REFUNDED: 'bg-orange-100 text-orange-700',
  RETURNED: 'bg-pink-100 text-pink-700',
} as const;

export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-IN')}`;
}

export function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
