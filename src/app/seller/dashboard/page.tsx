'use client';

import { useState } from 'react';
import Link from 'next/link';

const stats = [
  { label: 'Total Products', value: '156', icon: 'inventory_2', color: 'bg-primary', change: '+12 this month' },
  { label: 'Total Orders', value: '1,284', icon: 'receipt_long', color: 'bg-tertiary', change: '+8.3% vs last month' },
  { label: 'Total Revenue', value: '৳4,52,800', icon: 'payments', color: 'bg-green-600', change: '+15.2% vs last month' },
  { label: 'Total Followers', value: '3,842', icon: 'favorite', color: 'bg-amber-600', change: '+124 this week' },
];

const recentOrders = [
  { id: '#ORD-7821', customer: 'Rahim Miah', product: 'iPhone 15 Pro', total: '৳1,29,999', status: 'Delivered', date: '2026-06-28' },
  { id: '#ORD-7820', customer: 'Fatima Begum', product: 'Samsung TV 55"', total: '৳72,500', status: 'Shipped', date: '2026-06-27' },
  { id: '#ORD-7819', customer: 'Karim Hossain', product: 'Air Jordan Sneakers', total: '৳12,800', status: 'Processing', date: '2026-06-27' },
  { id: '#ORD-7818', customer: 'Nasrin Akter', product: 'Wooden Dining Table', total: '৳35,200', status: 'Pending', date: '2026-06-26' },
  { id: '#ORD-7817', customer: 'Jamil Ahmed', product: 'Wireless Earbuds', total: '৳3,999', status: 'Delivered', date: '2026-06-26' },
];

const statusStyles: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Processing: 'bg-blue-100 text-blue-700',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const weeklyRevenue = [12, 19, 15, 22, 18, 25, 20];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const maxRev = Math.max(...weeklyRevenue);

export default function SellerDashboard() {
  const [showRevenue, setShowRevenue] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Dashboard</h1>
          <p className="text-sm text-on-surface-variant">Welcome back, ShopZone! Here&apos;s your overview.</p>
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
                  strokeDasharray={`${85 * 2.44} ${100 * 2.44}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-on-surface">85</p>
                  <p className="text-xs text-on-surface-variant">/100</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 w-full">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">On-time Delivery</span>
                <span className="text-green-600 font-medium">94%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Cancellation Rate</span>
                <span className="text-amber-600 font-medium">2.1%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Returns</span>
                <span className="text-green-600 font-medium">1.3%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Response Time</span>
                <span className="text-green-600 font-medium">&lt;1 hr</span>
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
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                    <td className="p-3 font-medium text-on-surface">{order.id}</td>
                    <td className="p-3 text-on-surface">{order.customer}</td>
                    <td className="p-3 text-on-surface">{order.product}</td>
                    <td className="p-3 font-medium text-on-surface">{order.total}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-on-surface-variant">{order.date}</td>
                  </tr>
                ))}
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
