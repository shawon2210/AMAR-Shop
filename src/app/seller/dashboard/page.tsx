'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSellerDashboard } from '@/services/seller';

const weeklyRevenue = [12, 19, 15, 22, 18, 25, 20];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const maxRev = Math.max(...weeklyRevenue);

const statusStyles: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Processing: 'bg-blue-100 text-blue-700',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function SellerDashboard() {
  const [showRevenue, setShowRevenue] = useState(true);
  const { data, isLoading, error } = useSellerDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-on-surface-variant">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
        <p className="text-on-surface-variant">Failed to load dashboard data</p>
        <button onClick={() => typeof window !== 'undefined' && window.location.reload()} className="mt-3 text-sm text-primary font-medium hover:underline">Try Again</button>
      </div>
    );
  }

  const { totalProducts, totalOrders, totalRevenue, totalFollowers, sellerProfile, recentOrders } = data;

  const stats = [
    { label: 'Total Products', value: totalProducts.toLocaleString(), icon: 'inventory_2', color: 'bg-primary', change: `${totalProducts > 0 ? '+' : ''}${totalProducts} total` },
    { label: 'Total Orders', value: totalOrders.toLocaleString(), icon: 'receipt_long', color: 'bg-tertiary', change: `${totalOrders} completed` },
    { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString('en-IN')}`, icon: 'payments', color: 'bg-green-600', change: 'Lifetime earnings' },
    { label: 'Total Followers', value: totalFollowers.toLocaleString(), icon: 'favorite', color: 'bg-amber-600', change: 'Store followers' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Dashboard</h1>
          <p className="text-sm text-on-surface-variant">Welcome back! Here&apos;s your overview.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRevenue(!showRevenue)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-outline text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-lg">{showRevenue ? 'visibility' : 'visibility_off'}</span>
            {showRevenue ? 'Hide Revenue' : 'Show Revenue'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-surface-container-high shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-on-surface-variant">{stat.label}</p>
                <p className="text-2xl font-bold text-on-surface mt-1">{showRevenue || stat.label !== 'Total Revenue' ? stat.value : '••••••'}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-2.5 rounded-lg`}>
                <span className="material-symbols-outlined text-white text-xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-on-surface">Weekly Revenue</h3>
            <span className="text-xs text-on-surface-variant">This week vs last week</span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {weeklyRevenue.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-on-surface-variant font-medium">{val}k</span>
                <div
                  className="w-full bg-primary/20 rounded-t-md relative"
                  style={{ height: `${(val / maxRev) * 100}%` }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all duration-500"
                    style={{ height: `${(val / maxRev) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-on-surface-variant">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Score */}
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <h3 className="font-semibold text-on-surface mb-4">Performance Score</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none" stroke="#a63600" strokeWidth="3"
                  strokeDasharray={`${sellerProfile.performanceScore * 2.44} ${100 * 2.44}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-on-surface">{sellerProfile.performanceScore}</p>
                  <p className="text-xs text-on-surface-variant">/100</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 w-full">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">On-time Delivery</span>
                <span className="text-green-600 font-medium">{sellerProfile.onTimeDelivery}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Response Rate</span>
                <span className="text-green-600 font-medium">{sellerProfile.responseRate}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Cancellation Rate</span>
                <span className="text-amber-600 font-medium">{sellerProfile.cancellationRate}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Returns</span>
                <span className="text-green-600 font-medium">{sellerProfile.returnsRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-surface-container-high shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-surface-container-high">
            <h3 className="font-semibold text-on-surface">Recent Orders</h3>
            <Link href="/seller/orders" className="text-xs text-primary font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-on-surface-variant text-xs border-b border-surface-container-high">
                  <th className="p-3 font-medium">Order</th>
                  <th className="p-3 font-medium">Customer</th>
                  <th className="p-3 font-medium">Product</th>
                  <th className="p-3 font-medium">Total</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={6} className="p-6 text-center text-on-surface-variant text-sm">No recent orders</td></tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                      <td className="p-3 font-medium text-on-surface">{order.id}</td>
                      <td className="p-3 text-on-surface">{order.customer}</td>
                      <td className="p-3 text-on-surface">{order.product}</td>
                      <td className="p-3 font-medium text-on-surface">৳{typeof order.total === 'number' ? order.total.toLocaleString('en-IN') : order.total}</td>
                      <td className="p-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-on-surface-variant">{order.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <h3 className="font-semibold text-on-surface mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/seller/products/new"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">add_circle</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Add Product</p>
                <p className="text-xs text-on-surface-variant">Create a new listing</p>
              </div>
            </Link>
            <Link
              href="/seller/orders"
              className="flex items-center gap-3 p-3 rounded-lg bg-tertiary/5 hover:bg-tertiary/10 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-tertiary/10 text-tertiary">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface group-hover:text-tertiary transition-colors">View Orders</p>
                <p className="text-xs text-on-surface-variant">Manage pending orders</p>
              </div>
            </Link>
            <Link
              href="/seller/store"
              className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 hover:bg-amber-500/10 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                <span className="material-symbols-outlined">edit</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface group-hover:text-amber-600 transition-colors">Edit Store</p>
                <p className="text-xs text-on-surface-variant">Update store info</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
