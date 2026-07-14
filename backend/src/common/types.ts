export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  TIMEOUT = 'TIMEOUT',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  PARTIALLY_SHIPPED = 'PARTIALLY_SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  BKASH = 'BKASH',
  NAGAD = 'NAGAD',
  COD = 'COD',
  SSLCOMMERZ = 'SSLCOMMERZ',
  WALLET = 'WALLET',
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  avatar?: string;
}

export interface Address {
  id: string;
  label?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  area?: string;
  district?: string;
  division?: string;
  zipCode?: string;
  isDefault: boolean;
  userId: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  images: string[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productId: string;
  product?: Product;
  variantId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: boolean;
  paidAt?: Date;
  note?: string;
  trackingNumber?: string;
  userId: string;
  addressId: string;
  couponId?: string;
  createdAt: Date;
  updatedAt: Date;
}
