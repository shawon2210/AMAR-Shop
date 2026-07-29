'use client';

import { useState, useMemo } from 'react';

const allOrders = [
  { id: '#ORD-7821', customer: 'Rahim Mia', product: 'Smartphone X Pro', qty: 1, total: 45000, status: 'Delivered', date: '14 Jul 2026', address: '123 Gulshan Ave, Dhaka 1212', items: [{ name: 'Smartphone X Pro', qty: 1, price: '৳45,000' }], timeline: ['Order placed', 'Payment confirmed', 'Processing', 'Shipped', 'Delivered'] },
  { id: '#ORD-7816', customer: 'Tahmina Akter', product: 'Winter Jacket', qty: 2, total: 9600, status: 'Processing', date: '13 Jul 2026', address: '56 Banani Rd, Dhaka 1213', items: [{ name: 'Winter Jacket - Blue', qty: 1, price: '৳4,800' }, { name: 'Winter Jacket - Black', qty: 1, price: '৳4,800' }], timeline: ['Order placed', 'Payment confirmed', 'Processing'] },
  { id: '#ORD-7808', customer: 'Shahidul Islam', product: 'Gaming Mouse', qty: 1, total: 2500, status: 'Shipped', date: '12 Jul 2026', address: '78 Mirpur Rd, Dhaka 1216', items: [{ name: 'Gaming Mouse RGB', qty: 1, price: '৳2,500' }], timeline: ['Order placed', 'Payment confirmed', 'Processing', 'Shipped'] },
  { id: '#ORD-7795', customer: 'Nusrat Jahan', product: 'Leather Wallet', qty: 1, total: 950, status: 'Pending', date: '11 Jul 2026', address: '34 Uttara, Dhaka 1230', items: [{ name: 'Premium Leather Wallet', qty: 1, price: '৳950' }], timeline: ['Order placed', 'Payment pending'] },
  { id: '#ORD-7782', customer: 'Kamal Hossain', product: 'Bluetooth Speaker', qty: 1, total: 1800, status: 'Delivered', date: '10 Jul 2026', address: '92 Dhanmondi, Dhaka 1209', items: [{ name: 'Bluetooth Speaker X2', qty: 1, price: '৳1,800' }], timeline: ['Order placed', 'Payment confirmed', 'Processing', 'Shipped', 'Delivered'] },
  { id: '#ORD-7770', customer: 'Fatima Begum', product: 'USB-C Hub', qty: 2, total: 2800, status: 'Delivered', date: '09 Jul 2026', address: '15 Mohakhali, Dhaka 1212', items: [{ name: 'USB-C Hub 7-in-1', qty: 2, price: '৳1,400' }], timeline: ['Order placed', 'Payment confirmed', 'Processing', 'Shipped', 'Delivered'] },
  { id: '#ORD-7755', customer: 'Jahangir Alam', product: 'Smart Watch', qty: 1, total: 15000, status: 'Cancelled', date: '08 Jul 2026', address: '67 Wari, Dhaka 1203', items: [{ name: 'Smart Watch Series 3', qty: 1, price: '৳15,000' }], timeline: ['Order placed', 'Payment confirmed', 'Cancelled'] },
  { id: '#ORD-7740', customer: 'Parvin Akhter', product: 'Laptop Stand', qty: 1, total: 1500, status: 'Processing', date: '07 Jul 2026', address: '23 Bashundhara, Dhaka 1229', items: [{ name: 'Laptop Stand Pro', qty: 1, price: '৳1,500' }], timeline: ['Order placed', 'Payment confirmed', 'Processing'] },
  { id: '#ORD-7722', customer: 'Hasan Mahmud', product: 'Wireless Earbuds', qty: 1, total: 2800, status: 'Shipped', date: '06 Jul 2026', address: '45 Lalmatia, Dhaka 1207', items: [{ name: 'Wireless Earbuds Pro', qty: 1, price: '৳2,800' }], timeline: ['Order placed', 'Payment confirmed', 'Processing', 'Shipped'] },
  { id: '#ORD-7705', customer: 'Shamima Sultana', product: 'Smartphone Case', qty: 3, total: 2100, status: 'Delivered', date: '05 Jul 2026', address: '89 Motijheel, Dhaka 1000', items: [{ name: 'Phone Case - Clear', qty: 3, price: '৳700' }], timeline: ['Order placed', 'Payment confirmed', 'Processing', 'Shipped', 'Delivered'] },
];

const statusFilters = [
  { key: 'All', label: 'All Orders', icon: 'receipt_long' },
  { key: 'Pending', label: 'Pending', icon: 'schedule', color: 'text-amber-600 bg-amber-50' },
  { key: 'Processing', label: 'Processing', icon: 'sync', color: 'text-blue-600 bg-blue-50' },
  { key: 'Shipped', label: 'Shipped', icon: 'local_shipping', color: 'text-purple-600 bg-purple-50' },
  { key: 'Delivered', label: 'Delivered', icon: 'check_circle', color: 'text-emerald-600 bg-emerald-50' },
  { key: 'Cancelled', label: 'Cancelled', icon: 'cancel', color: 'text-red-600 bg-red-50' },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-emerald-50 text-emerald-600',
  Processing: 'bg-blue-50 text-blue-600',
  Shipped: 'bg-purple-50 text-purple-600',
  Pending: 'bg-amber-50 text-amber-600',
  Cancelled: 'bg-red-50 text-red-600',
};

function formatBDT(v: number) {
  return `৳${v.toLocaleString('en-IN')}`;
}

export default function SellerOrders() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return allOrders.filter((o) => {
      if (filter !== 'All' && o.status !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!o.id.toLowerCase().includes(q) && !o.customer.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filter, search]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allOrders.forEach((o) => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return counts;
  }, []);

  const orderStats = [
    { label: 'Total Orders', value: allOrders.length, icon: 'receipt_long', color: 'bg-blue-500' },
    { label: 'Delivered', value: allOrders.filter((o) => o.status === 'Delivered').length, icon: 'check_circle', color: 'bg-emerald-500' },
    { label: 'Pending', value: allOrders.filter((o) => o.status === 'Pending').length, icon: 'schedule', color: 'bg-amber-500' },
    { label: 'Revenue', value: formatBDT(allOrders.reduce((s, o) => s + o.total, 0)), icon: 'payments', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage and track your store orders</p>
        </div>
        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-slate-400">search</span>
          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-600 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {orderStats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200/70 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color} shadow-sm`}>
                <span className="material-symbols-outlined text-white text-lg">{s.icon}</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-lg font-bold text-slate-900">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {statusFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === f.key
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-500 bg-white border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{f.icon}</span>
            {f.label}
            {f.key !== 'All' && (
              <span className="text-[10px] opacity-60">({statusCounts[f.key] || 0})</span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50/80 border-b border-slate-100">
                <th className="px-4 py-3 font-medium w-8" />
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Product</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-sm text-slate-400">
                    <span className="material-symbols-outlined text-3xl text-slate-300 mb-2 block">receipt_long</span>
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      onClick={() => setExpandedRow(expandedRow === order.id ? null : order.id)}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <span className={`material-symbols-outlined text-sm text-slate-300 transition-transform duration-200 ${
                          expandedRow === order.id ? 'rotate-90' : ''
                        }`}>
                          chevron_right
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono font-medium text-primary">{order.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                            {order.customer.charAt(0)}
                          </div>
                          <span className="text-xs text-slate-700">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 hidden lg:table-cell max-w-[160px] truncate">{order.product}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-800 text-right">{formatBDT(order.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-slate-100 text-slate-500'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-slate-400 hidden md:table-cell">{order.date}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {order.status === 'Processing' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); /* mark shipped */ }}
                              className="text-[10px] px-2.5 py-1 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-sm"
                            >
                              Ship
                            </button>
                          )}
                          {order.status === 'Shipped' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); /* mark delivered */ }}
                              className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors shadow-sm"
                            >
                              Deliver
                            </button>
                          )}
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                            aria-label="More options"
                          >
                            <span className="material-symbols-outlined text-lg">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === order.id && (
                      <tr key={`${order.id}-detail`}>
                        <td colSpan={8} className="p-0">
                          <div className="bg-slate-50/70 px-4 py-5 border-b border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Order Items</p>
                                <div className="space-y-2">
                                  {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-slate-100">
                                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500 shrink-0">
                                        <span className="material-symbols-outlined text-lg">inventory_2</span>
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-xs font-medium text-slate-700">{item.name}</p>
                                        <p className="text-[10px] text-slate-400">Qty: {item.qty} × {item.price}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Shipping Address</p>
                                <div className="bg-white rounded-lg p-3 border border-slate-100">
                                  <div className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-sm text-slate-400 shrink-0">location_on</span>
                                    <p className="text-xs text-slate-600">{order.address}</p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Order Timeline</p>
                                <div className="space-y-2">
                                  {order.timeline.map((step, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <div className={`relative flex items-center justify-center w-5 h-5 shrink-0`}>
                                        <div className={`w-2 h-2 rounded-full ${
                                          i === order.timeline.length - 1 ? 'bg-primary ring-2 ring-primary/20' : 'bg-emerald-400'
                                        }`} />
                                        {i < order.timeline.length - 1 && (
                                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-px h-3 bg-slate-200" />
                                        )}
                                      </div>
                                      <span className={`text-xs ${i === order.timeline.length - 1 ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
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
    </div>
  );
}