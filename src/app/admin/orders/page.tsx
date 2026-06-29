'use client';

import { useState } from 'react';

const mockOrders = [
  { id: '#ORD-28471', customer: 'Rahima Begum', email: 'rahima@email.com', phone: '+8801712345601', amount: '৳2,450', method: 'bKash', items: 2, status: 'Delivered', date: '28 Jun 2026', address: 'Dhaka, Mirpur 12, Block C', paymentStatus: 'Paid', timeline: ['Ordered 20 Jun', 'Confirmed 21 Jun', 'Shipped 23 Jun', 'Delivered 28 Jun'] },
  { id: '#ORD-28472', customer: 'Karim Hossain', email: 'karim@email.com', phone: '+8801712345602', amount: '৳5,200', method: 'COD', items: 3, status: 'Processing', date: '28 Jun 2026', address: 'Chittagong, Agrabad, Road 5', paymentStatus: 'Pending', timeline: ['Ordered 28 Jun', 'Confirmed 28 Jun'] },
  { id: '#ORD-28473', customer: 'Fatima Akhter', email: 'fatima@email.com', phone: '+8801712345603', amount: '৳890', method: 'Nagad', items: 1, status: 'Shipped', date: '27 Jun 2026', address: 'Sylhet, Zindabazar, Lane 3', paymentStatus: 'Paid', timeline: ['Ordered 25 Jun', 'Confirmed 26 Jun', 'Shipped 27 Jun'] },
  { id: '#ORD-28474', customer: 'Nurul Islam', email: 'nurul@email.com', phone: '+8801712345604', amount: '৳12,400', method: 'SSLCommerz', items: 5, status: 'Pending', date: '27 Jun 2026', address: 'Rajshahi, Shaheb Bazar', paymentStatus: 'Pending', timeline: ['Ordered 27 Jun'] },
  { id: '#ORD-28475', customer: 'Sharmin Sultana', email: 'sharmin@email.com', phone: '+8801712345605', amount: '৳3,600', method: 'bKash', items: 2, status: 'Delivered', date: '26 Jun 2026', address: 'Khulna, Sonadanga', paymentStatus: 'Paid', timeline: ['Ordered 18 Jun', 'Confirmed 19 Jun', 'Shipped 22 Jun', 'Delivered 26 Jun'] },
  { id: '#ORD-28476', customer: 'Jahid Hasan', email: 'jahid@email.com', phone: '+8801712345606', amount: '৳8,750', method: 'COD', items: 4, status: 'Cancelled', date: '26 Jun 2026', address: 'Dhaka, Gulshan 2', paymentStatus: 'Refunded', timeline: ['Ordered 22 Jun', 'Confirmed 22 Jun', 'Cancelled 25 Jun'] },
  { id: '#ORD-28477', customer: 'Morshed Alam', email: 'morshed@email.com', phone: '+8801712345607', amount: '৳1,200', method: 'Nagad', items: 1, status: 'Delivered', date: '25 Jun 2026', address: 'Barisal, Sadar Road', paymentStatus: 'Paid', timeline: ['Ordered 17 Jun', 'Confirmed 18 Jun', 'Shipped 20 Jun', 'Delivered 25 Jun'] },
  { id: '#ORD-28478', customer: 'Parvin Akhter', email: 'parvin@email.com', phone: '+8801712345608', amount: '৳15,000', method: 'bKash', items: 6, status: 'Processing', date: '25 Jun 2026', address: 'Rangpur, Station Road', paymentStatus: 'Paid', timeline: ['Ordered 25 Jun', 'Confirmed 25 Jun'] },
  { id: '#ORD-28479', customer: 'Shahidul Islam', email: 'shahidul@email.com', phone: '+8801712345609', amount: '৳4,300', method: 'SSLCommerz', items: 2, status: 'Shipped', date: '24 Jun 2026', address: 'Mymensingh, Kewatkhali', paymentStatus: 'Paid', timeline: ['Ordered 21 Jun', 'Confirmed 22 Jun', 'Shipped 24 Jun'] },
  { id: '#ORD-28480', customer: 'Taslima Nasrin', email: 'taslima@email.com', phone: '+8801712345610', amount: '৳980', method: 'COD', items: 1, status: 'Pending', date: '24 Jun 2026', address: 'Dhaka, Uttara Sector 7', paymentStatus: 'Pending', timeline: ['Ordered 24 Jun'] },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const;

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [detailOrder, setDetailOrder] = useState<typeof mockOrders[0] | null>(null);
  const [refundConfirm, setRefundConfirm] = useState<string | null>(null);

  const filtered = activeTab === 'All' ? mockOrders : mockOrders.filter((o) => o.status === activeTab);

  const statusCounts = mockOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Orders</h1>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'
            }`}
          >
            {tab === 'All' ? 'All' : tab}
            {tab !== 'All' && statusCounts[tab] && (
              <span className="ml-1.5 text-xs opacity-70">({statusCounts[tab]})</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Items</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                <td className="p-3 font-medium text-[#333]">{o.id}</td>
                <td className="p-3 text-[#555]">{o.customer}</td>
                <td className="p-3 font-medium">{o.amount}</td>
                <td className="p-3 text-[#666]">{o.method}</td>
                <td className="p-3 text-[#666]}">{o.items}</td>
                <td className="p-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusColors[o.status]}`}>{o.status}</span>
                </td>
                <td className="p-3 text-[#888]">{o.date}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setDetailOrder(o)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="View Details">
                      <span className="material-symbols-outlined text-[18px] text-[#666]">visibility</span>
                    </button>
                    {o.status === 'Pending' && (
                      <button className="text-[11px] bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600">Process</button>
                    )}
                    {o.status === 'Processing' && (
                      <button className="text-[11px] bg-purple-500 text-white px-2 py-1 rounded-md hover:bg-purple-600">Ship</button>
                    )}
                    {o.status === 'Shipped' && (
                      <button className="text-[11px] bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">Deliver</button>
                    )}
                    {(o.status === 'Pending' || o.status === 'Processing') && (
                      <button className="text-[11px] bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">Cancel</button>
                    )}
                    {o.paymentStatus === 'Paid' && o.status !== 'Cancelled' && (
                      <button onClick={() => setRefundConfirm(o.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Refund">
                        <span className="material-symbols-outlined text-[18px] text-[#666]">currency_exchange</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detailOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#eee] flex items-center justify-between">
              <h3 className="text-lg font-semibold">Order {detailOrder.id}</h3>
              <button onClick={() => setDetailOrder(null)}>
                <span className="material-symbols-outlined text-[#888]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#888] text-xs mb-1">Customer</p>
                  <p className="font-medium">{detailOrder.customer}</p>
                  <p className="text-[#666]">{detailOrder.email}</p>
                  <p className="text-[#666]">{detailOrder.phone}</p>
                </div>
                <div>
                  <p className="text-[#888] text-xs mb-1">Payment</p>
                  <p className="font-medium">{detailOrder.method}</p>
                  <p className="text-[#666]">{detailOrder.paymentStatus}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[#888] text-xs mb-1">Shipping Address</p>
                  <p className="text-[#444]">{detailOrder.address}</p>
                </div>
              </div>

              <div>
                <p className="text-[#888] text-xs mb-2">Order Timeline</p>
                <div className="space-y-2">
                  {detailOrder.timeline.map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${i === detailOrder.timeline.length - 1 ? 'bg-green-500' : 'bg-[#ddd]'}`} />
                      <span className={i === detailOrder.timeline.length - 1 ? 'text-[#333] font-medium' : 'text-[#888]'}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[#888] text-xs mb-2">Items ({detailOrder.items})</p>
                <div className="bg-[#fafafa] rounded-lg p-3 text-[#666]">
                  {detailOrder.items} item(s) - Total: {detailOrder.amount}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#eee]">
                <select className="bg-white border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none flex-1">
                  <option>Change Status...</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
                {detailOrder.paymentStatus === 'Paid' && (
                  <button className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600">Refund</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {refundConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-[#222] mb-2">Confirm Refund</h3>
            <p className="text-sm text-[#888] mb-4">Are you sure you want to refund this order? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setRefundConfirm(null)} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
              <button onClick={() => setRefundConfirm(null)} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600">Confirm Refund</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
