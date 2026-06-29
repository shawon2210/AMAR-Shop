'use client';

import { useState } from 'react';

const allOrders = [
  { id: 'ORD-7821', customer: 'Rahim Miah', product: 'iPhone 15 Pro Max', qty: 1, total: '৳1,29,999', status: 'Delivered', date: '2026-06-28', items: [{ name: 'iPhone 15 Pro Max', qty: 1, price: '৳1,29,999', image: 'https://picsum.photos/seed/o1/40/40' }], address: '123 Elephant Road, Dhaka 1205', timeline: ['Order Placed', 'Confirmed', 'Shipped', 'Delivered'] },
  { id: 'ORD-7820', customer: 'Fatima Begum', product: 'Samsung TV 55"', qty: 1, total: '৳72,500', status: 'Shipped', date: '2026-06-27', items: [{ name: 'Samsung TV 55"', qty: 1, price: '৳72,500', image: 'https://picsum.photos/seed/o2/40/40' }], address: '456 Gulshan Avenue, Dhaka 1212', timeline: ['Order Placed', 'Confirmed', 'Shipped'] },
  { id: 'ORD-7819', customer: 'Karim Hossain', product: 'Air Jordan Sneakers', qty: 2, total: '৳25,600', status: 'Processing', date: '2026-06-27', items: [{ name: 'Air Jordan Sneakers', qty: 2, price: '৳12,800', image: 'https://picsum.photos/seed/o3/40/40' }], address: '789 Mirpur Road, Dhaka 1216', timeline: ['Order Placed', 'Confirmed'] },
  { id: 'ORD-7818', customer: 'Nasrin Akter', product: 'Wooden Dining Table', qty: 1, total: '৳35,200', status: 'Pending', date: '2026-06-26', items: [{ name: 'Wooden Dining Table', qty: 1, price: '৳35,200', image: 'https://picsum.photos/seed/o4/40/40' }], address: '321 Uttara Sector 7, Dhaka 1230', timeline: ['Order Placed'] },
  { id: 'ORD-7817', customer: 'Jamil Ahmed', product: 'Wireless Earbuds', qty: 1, total: '৳3,999', status: 'Cancelled', date: '2026-06-26', items: [{ name: 'Wireless Earbuds', qty: 1, price: '৳3,999', image: 'https://picsum.photos/seed/o5/40/40' }], address: '555 Bashundhara R/A, Dhaka 1229', timeline: ['Order Placed', 'Cancelled'] },
  { id: 'ORD-7816', customer: 'Shahin Alam', product: 'Gaming Chair', qty: 1, total: '৳28,500', status: 'Delivered', date: '2026-06-25', items: [{ name: 'Gaming Chair', qty: 1, price: '৳28,500', image: 'https://picsum.photos/seed/o6/40/40' }], address: '888 Dhanmondi 32, Dhaka 1209', timeline: ['Order Placed', 'Confirmed', 'Shipped', 'Delivered'] },
  { id: 'ORD-7815', customer: 'Rokeya Sultana', product: 'Canon EOS R50', qty: 1, total: '৳85,000', status: 'Processing', date: '2026-06-25', items: [{ name: 'Canon EOS R50', qty: 1, price: '৳85,000', image: 'https://picsum.photos/seed/o7/40/40' }], address: '444 Mohammadpur, Dhaka 1207', timeline: ['Order Placed', 'Confirmed'] },
];

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

  const filtered = allOrders.filter((o) => {
    if (filter !== 'All' && o.status !== filter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
              <span className="ml-1.5 text-xs opacity-60">({allOrders.filter((o) => o.status === s).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border border-surface-container-high shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-on-surface-variant text-xs border-b border-surface-container-high bg-surface-container-low">
                <th className="p-3 font-medium">Order ID</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium">Qty</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <>
                  <tr
                    key={order.id}
                    className="border-b border-surface-container-high hover:bg-surface-container-low cursor-pointer transition-colors"
                    onClick={() => toggleRow(order.id)}
                  >
                    <td className="p-3 font-medium text-primary">{order.id}</td>
                    <td className="p-3 text-on-surface">{order.customer}</td>
                    <td className="p-3 text-on-surface">{order.product}</td>
                    <td className="p-3 text-on-surface">{order.qty}</td>
                    <td className="p-3 font-medium text-on-surface">{order.total}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-on-surface-variant">{order.date}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {order.status === 'Processing' && (
                          <button className="text-xs px-2 py-1 rounded bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors">
                            Mark Shipped
                          </button>
                        )}
                        {order.status === 'Shipped' && (
                          <button className="text-xs px-2 py-1 rounded bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
                            Mark Delivered
                          </button>
                        )}
                        <button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors">
                          <span className="material-symbols-outlined text-lg">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === order.id && (
                    <tr key={`${order.id}-details`}>
                      <td colSpan={8} className="p-0">
                        <div className="bg-surface-container-low px-4 py-4 border-b border-surface-container-high">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Order Items</h4>
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 mb-2">
                                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover bg-surface-container-high" />
                                  <div className="flex-1">
                                    <p className="text-sm text-on-surface">{item.name}</p>
                                    <p className="text-xs text-on-surface-variant">Qty: {item.qty} × {item.price}</p>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
