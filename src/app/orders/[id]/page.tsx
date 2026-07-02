'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/services/api';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { id: string; name: string; images: string[] };
}

interface OrderAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  area: string | null;
  label: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  paymentMethod: string;
  note: string | null;
  createdAt: string;
  items: OrderItem[];
  address: OrderAddress;
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: 'Pending', color: 'text-amber-600 bg-amber-50', icon: 'hourglass_empty' },
  CONFIRMED: { label: 'Confirmed', color: 'text-blue-600 bg-blue-50', icon: 'check_circle' },
  PROCESSING: { label: 'Processing', color: 'text-purple-600 bg-purple-50', icon: 'manufacturing' },
  SHIPPED: { label: 'Shipped', color: 'text-info bg-info-container/30', icon: 'local_shipping' },
  DELIVERED: { label: 'Delivered', color: 'text-green-600 bg-green-50', icon: 'verified' },
  CANCELLED: { label: 'Cancelled', color: 'text-error bg-error-container', icon: 'cancel' },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const token = useAuthStore(s => s.accessToken);
  const addToast = useUIStore(s => s.addToast);
  const hydrated = useAuthHydrated();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.push(`/auth/login?redirect=/orders/${params.id}`);
      return;
    }

    api
      .get<Order>(`/orders/${params.id}`)
      .then(setOrder)
      .catch(err => {
        addToast(err.message || 'Failed to load order', 'error');
        router.push('/orders');
      })
      .finally(() => setLoading(false));
  }, [hydrated, token, params.id, router, addToast]);

  if (loading) {
    return (
      <div className="px-container-margin pt-md pb-24">
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined animate-spin text-3xl text-secondary mb-3">
            progress_activity
          </span>
          <p className="text-secondary text-sm">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const cfg = statusConfig[order.status] || statusConfig.PENDING;

  return (
    <div className="px-container-margin pt-md pb-24 space-y-md">
      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-md flex items-start gap-3">
        <span className="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
        <div>
          <h2 className="font-title-md text-title-md text-green-800">Order Placed Successfully!</h2>
          <p className="text-sm text-green-700 mt-0.5">
            Your order <span className="font-mono font-bold">{order.orderNumber}</span> has been placed.
          </p>
        </div>
      </div>

      {/* Back Link */}
      <Link
        href="/orders"
        className="flex items-center gap-1 text-sm text-primary font-label-bold w-fit"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to Orders
      </Link>

      {/* Order Info */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="px-md py-sm bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">receipt_long</span>
            <span className="font-title-sm text-title-sm">Order Info</span>
          </div>
          <span className={`text-xs font-label-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${cfg.color}`}>
            <span className="material-symbols-outlined text-base">{cfg.icon}</span>
            {cfg.label}
          </span>
        </div>
        <div className="p-md space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary">Order Number</span>
            <span className="font-mono font-medium">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Payment</span>
            <span>{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Date</span>
            <span>{new Date(order.createdAt).toLocaleString('en-BD')}</span>
          </div>
        </div>
      </section>

      {/* Shipping Address */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="px-md py-sm bg-surface-container-low flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">location_on</span>
          <span className="font-title-sm text-title-sm">Shipping Address</span>
        </div>
        <div className="p-md text-sm space-y-1">
          <p className="font-medium">{order.address.fullName}</p>
          <p className="text-secondary">{order.address.phone}</p>
          <p className="text-secondary">
            {order.address.street}, {order.address.area && `${order.address.area}, `}{order.address.city}
          </p>
        </div>
      </section>

      {/* Order Items */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="px-md py-sm bg-surface-container-low flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">shopping_bag</span>
          <span className="font-title-sm text-title-sm">Items ({order.items.length})</span>
        </div>
        <div className="p-md space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-14 h-14 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src={item.product.images?.[0] || '/placeholder.png'}
                  alt={item.product.name}
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.product.id}`}
                  className="text-sm font-medium truncate block hover:text-primary"
                >
                  {item.product.name}
                </Link>
                <p className="text-xs text-secondary mt-0.5">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">
                ৳{(item.price * item.quantity).toLocaleString('en-BD')}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Note */}
      {order.note && (
        <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
          <div className="p-md text-sm">
            <span className="font-medium block mb-1">Order Note</span>
            <p className="text-secondary">{order.note}</p>
          </div>
        </section>
      )}

      {/* Price Summary */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="p-md space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary">Subtotal ({order.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span>৳{order.subtotal.toLocaleString('en-BD')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Shipping</span>
            <span className={order.shipping === 0 ? 'text-green-600 font-medium' : ''}>
              {order.shipping === 0 ? 'Free' : `৳${order.shipping}`}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-secondary">Discount</span>
              <span className="text-error">-৳{order.discount.toLocaleString('en-BD')}</span>
            </div>
          )}
          <div className="flex justify-between font-title-sm text-title-sm border-t border-outline-variant pt-2">
            <span>Total</span>
            <span className="text-primary">৳{order.total.toLocaleString('en-BD')}</span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/orders"
          className="flex-1 py-3 text-center border border-outline rounded-lg font-label-bold text-sm hover:bg-surface-container transition-colors"
        >
          All Orders
        </Link>
        <Link
          href="/"
          className="flex-1 py-3 text-center bg-primary text-on-primary rounded-lg font-label-bold text-sm hover:brightness-110 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
