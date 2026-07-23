'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSellerOrders, useUpdateOrderStatus, formattedPrice } from '@/services/seller';

const statusFilter = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function SellerOrders() {
  const [filter, setFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useSellerOrders({
    status: filter === 'All' ? undefined : filter,
    search: search || undefined,
  });
  const updateStatus = useUpdateOrderStatus();

  const orders = data?.orders || [];

  const statusCounts = (status: string) => {
    if (status === 'All') return '';
    return ` (${orders.filter((o) => o.status === status).length})`;
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-on-surface">Orders</h1>
        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-lg">search</span>
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 bg-surface-container-high rounded-lg p-1 overflow-x-auto">
        {statusFilter.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`whitespace-nowrap px-3 py-1.5 text-sm rounded-md transition-colors ${
              filter === s ? 'bg-white text-on-surface shadow-sm font-medium' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {s}
            {s !== 'All' && (
              <span className="ml-1.5 text-xs opacity-60">{statusCounts(s)}</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-on-surface-variant">Loading orders...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
          <p className="text-on-surface-variant">Failed to load orders</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-surface-container-high shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left text-on-surface-variant text-xs border-b border-surface-container-high bg-surface-container-low">
                  <th className="p-3 font-medium whitespace-nowrap">Order ID</th>
                  <th className="p-3 font-medium whitespace-nowrap">Customer</th>
                  <th className="p-3 font-medium whitespace-nowrap hidden lg:table-cell">Product</th>
                  <th className="p-3 font-medium whitespace-nowrap">Qty</th>
                  <th className="p-3 font-medium whitespace-nowrap">Total</th>
                  <th className="p-3 font-medium whitespace-nowrap">Status</th>
                  <th className="p-3 font-medium whitespace-nowrap hidden lg:table-cell">Date</th>
                  <th className="p-3 font-medium whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={8} className="p-6 text-center text-on-surface-variant text-sm">No orders found</td></tr>
                ) : (
                  orders.map((order) => (
                    <>
                      <tr
                        key={order.id}
                        className="border-b border-surface-container-high hover:bg-surface-container-low cursor-pointer transition-colors"
                        onClick={() => toggleRow(order.id)}
                      >
                        <td className="p-3 font-medium text-primary whitespace-nowrap">{order.id}</td>
                        <td className="p-3 text-on-surface whitespace-nowrap">{order.customer}</td>
                        <td className="p-3 text-on-surface whitespace-nowrap hidden lg:table-cell">{order.product}</td>
                        <td className="p-3 text-on-surface whitespace-nowrap">{order.qty}</td>
                        <td className="p-3 font-medium text-on-surface whitespace-nowrap">{typeof order.total === 'number' ? formattedPrice(order.total) : order.total}</td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[order.status] || 'bg-gray-100 text-gray-600'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 text-on-surface-variant whitespace-nowrap hidden lg:table-cell">{order.date}</td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {order.status === 'Processing' && (
                              <button
                                onClick={() => updateStatus.mutate({ id: order.id, status: 'Shipped' })}
                                className="text-xs px-2 py-1 rounded bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors"
                              >
                                Mark Shipped
                              </button>
                            )}
                            {order.status === 'Shipped' && (
                              <button
                                onClick={() => updateStatus.mutate({ id: order.id, status: 'Delivered' })}
                                className="text-xs px-2 py-1 rounded bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                              >
                                Mark Delivered
                              </button>
                            )}
                            <button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors" aria-label="More options">
                              <span className="material-symbols-outlined text-lg">more_vert</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRow === order.id && order.items && (
                        <tr key={`${order.id}-details`}>
                          <td colSpan={8} className="p-0">
                            <div className="bg-surface-container-low px-4 py-4 border-b border-surface-container-high">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                  <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Order Items</h4>
                                  {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 mb-2">
                                      <Image src={item.image || 'https://picsum.photos/seed/default/40/40'} alt={item.name} width={40} height={40} className="w-10 h-10 rounded object-cover bg-surface-container-high" />
                                      <div className="flex-1">
                                        <p className="text-sm text-on-surface">{item.name}</p>
                                        <p className="text-xs text-on-surface-variant">Qty: {item.qty} x {item.price}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Shipping Address</h4>
                                  <p className="text-sm text-on-surface">{order.address}</p>
                                </div>
                                <div>
                                  <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Order Timeline</h4>
                                  <div className="space-y-2">
                                    {order.timeline.map((step, i) => (
                                      <div key={i} className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${i === order.timeline.length - 1 ? 'bg-primary' : 'bg-green-500'}`} />
                                        <span className={`text-xs ${i === order.timeline.length - 1 ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>
                                          {step}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
