export * from './common';
export * from './admin';
export * from './marketing';
export * from './finance';
export * from './support';
export * from './cms';
export * from './operations';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  images: string[];
  category: string;
  categoryId: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isFlashSale?: boolean;
  isMall?: boolean;
  isNew?: boolean;
  freeShipping?: boolean;
  flashSaleEndsAt?: string;
  soldPercent?: number;
  seller?: {
    id: string;
    name: string;
    isOfficial: boolean;
  };
  colors?: string[];
  sizes?: string[];
  specifications?: Record<string, string>;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  bnName: string;
  icon: string;
  slug: string;
  productCount: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selected: boolean;
  sellerName: string;
  sellerId: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  area: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  paymentMethod: 'bkash' | 'nagad' | 'cod' | 'sslcommerz';
  address: Address;
  createdAt: string;
  trackingNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
  isSeller: boolean;
}

export interface FlashSale {
  id: string;
  title: string;
  endsAt: string;
  products: Product[];
  status: 'active' | 'upcoming' | 'ended';
  startsAt?: string;
  interestedCount?: number;
}
