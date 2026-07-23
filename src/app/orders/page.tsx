'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/services/api';
import { AuthGuard } from '@/components/auth/auth-guard';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { id: string; name: string; images: string[] };
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
  createdAt: string;
  items: OrderItem[];
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  skip: number;
  take: number;
}

const tabs = ['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'text-amber-600 bg-amber-50' },
  CONFIRMED: { label: 'Confirmed', color: 'text-blue-600 bg-blue-50' },
  PROCESSING: { label: 'Processing', color: 'text-purple-600 bg-purple-50' },
  SHIPPED: { label: 'Shipped', color: 'text-info bg-info-container/30' },
  DELIVERED: { label: 'Delivered', color: 'text-green-600 bg-green-50' },
  CANCELLED: { label: 'Cancelled', color: 'text-error bg-error-container' },
};

function statusToTab(s: string): string {
  if (s === 'PENDING') return 'Pending';
  if (s === 'CONFIRMED') return 'Confirmed';
  if (s === 'PROCESSING') return 'Processing';
  if (s === 'SHIPPED') return 'Shipped';
  if (s === 'DELIVERED') return 'Delivered';
  if (s === 'CANCELLED') return 'Cancelled';
  return 'All';
}

export default function OrdersPage() {
  const router = useRouter();
  const token = useAuthStore(s => s.accessToken);
  const addToast = useUIStore(s => s.addToast);
  const hydrated = useAuthHydrated();

  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated || !token) { setLoading(false); return; }

    setLoading(true);
    const statusParam = activeTab === 'All' ? undefined : activeTab.toUpperCase();

    api
      .get<OrdersResponse>(`/orders${statusParam ? `?status=${statusParam}` : ''}`)
      .then(data => setOrders(data.orders))
      .catch(() => {
        try {
          const local = JSON.parse(localStorage.getItem('amarshop-orders') || '[]');
          setOrders(local);
        } catch { setOrders([]); }
      })
      .finally(() => setLoading(false));
  }, [hydrated, token, activeTab, router, addToast]);

  function filteredOrders() {
    if (activeTab === 'All') return orders;
    return orders.filter(o => o.status === activeTab.toUpperCase());
  }

  const displayOrders = filteredOrders();

  return (
    <AuthGuard>
    <div className="app-container py-6 pb-24">
      <h1 className="text-responsive-subheading font-bold mb-6">My Orders</h1>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-1 border-b border-outline-variant -mx-[clamp(12px,2.5vw,40px)] px-[clamp(12px,2.5vw,40px)]">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-md py-2 font-label-bold text-sm transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="mt-md space-y-md">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-3xl text-secondary mb-3">
              progress_activity
            </span>
            <p className="text-secondary text-sm">Loading orders...</p>
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined text-5xl text-secondary mb-3">receipt_long</span>
            <p className="text-secondary">No orders found</p>
            <Link href="/" className="mt-4 text-primary font-label-bold text-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          displayOrders.map(order => {
            const cfg = statusConfig[order.status] || statusConfig.PENDING;
            const firstItem = order.items[0];
            return (
              <div
                key={order.id}
                className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden"
              >
                <div className="px-md py-sm bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-secondary text-lg">
                      receipt_long
                    </span>
                    <span className="font-medium font-mono text-xs">{order.orderNumber || order.id}</span>
                  </div>
                  <span
                    className={`text-[10px] font-label-bold px-2 py-0.5 rounded-full ${cfg.color}`}
                  >
                    {cfg.label}
                  </span>
                </div>

                <div className="p-md flex gap-md">
                  {firstItem && (
                    <div className="w-16 h-16 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        src={firstItem.product.images?.[0] || '/placeholder.png'}
                        alt={firstItem.product.name}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-title-sm text-title-sm truncate">
                      {firstItem ? firstItem.product.name : `${order.items.length} item(s)`}
                    </p>
                    {order.items.length > 1 && (
                      <p className="text-xs text-secondary mt-0.5">
                        +{order.items.length - 1} more item(s)
                      </p>
                    )}
                    <p className="text-xs text-secondary mt-0.5">Qty: {order.items.reduce((s, i) => s + i.quantity, 0)}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="font-price-lg text-primary">
                        ৳{order.total.toLocaleString('en-BD')}
                      </span>
                      <span className="text-[10px] text-secondary">
                        {new Date(order.createdAt).toLocaleDateString('en-BD')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-md py-sm border-t border-outline-variant flex justify-end gap-2">
                  <Link
                    href={`/orders/${order.id}`}
                    className="px-md py-1.5 border border-outline rounded-lg text-xs font-label-bold hover:bg-surface-container transition-colors"
                  >
                    View Details
                  </Link>
                  {order.status === 'PENDING' && (
                    <button className="px-md py-1.5 bg-primary text-on-primary rounded-lg text-xs font-label-bold hover:brightness-110 transition-colors">
                      Pay Now
                    </button>
                  )}
                  {order.status === 'DELIVERED' && (
                    <button className="px-md py-1.5 bg-primary text-on-primary rounded-lg text-xs font-label-bold hover:brightness-110 transition-colors">
                      Review
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
    </AuthGuard>
  );
}
