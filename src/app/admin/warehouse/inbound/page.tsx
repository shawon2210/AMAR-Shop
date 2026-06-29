'use client';

import { useState } from 'react';

export default function InboundPage() {
  const [showForm, setShowForm] = useState(false);

  const orders = [
    { id: 'IN-000001', supplier: 'Samsung Bangladesh', status: 'COMPLETED', items: 3, received: '2026-06-28' },
    { id: 'IN-000002', supplier: 'Apple Distributor', status: 'RECEIVING', items: 5, received: '2026-06-29' },
    { id: 'IN-000003', supplier: 'Sony Electronics', status: 'PENDING', items: 2, received: '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Inbound Orders</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium hover:bg-primary-container transition-colors">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Inbound
        </button>
      </div>

      {showForm && (
        <div className="bg-surface rounded-xl border border-outline-variant p-5 space-y-4">
          <h2 className="text-title-sm text-on-surface font-semibold">Create Inbound Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-label-bold text-on-surface-variant block mb-1">Warehouse</label>
              <select className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-sm">
                <option>Dhaka Warehouse</option>
                <option>Chattogram Warehouse</option>
              </select>
            </div>
            <div>
              <label className="text-label-bold text-on-surface-variant block mb-1">Supplier</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-sm" placeholder="Supplier name" />
            </div>
          </div>
          <div className="border border-outline-variant rounded-lg p-4">
            <p className="text-body-sm text-on-surface-variant mb-3">Add products to receive</p>
            <div className="flex gap-2">
              <select className="flex-1 px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-sm">
                <option>Select product...</option>
                <option>Samsung Galaxy S25</option>
                <option>iPhone 16 Pro</option>
              </select>
              <input type="number" placeholder="Qty" className="w-24 px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-sm" />
              <input type="number" placeholder="Cost" className="w-28 px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-sm" />
              <button className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-body-sm font-medium">Add</button>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-outline-variant text-on-surface rounded-lg text-body-sm">Cancel</button>
            <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium">Create Order</button>
          </div>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <table className="w-full text-body-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Order #</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Supplier</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Items</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Status</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Received</th>
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={i} className="border-b border-outline-variant/50 hover:bg-surface-container-low">
                <td className="py-3 px-4 text-on-surface font-medium">{o.id}</td>
                <td className="py-3 px-4 text-on-surface-variant">{o.supplier}</td>
                <td className="py-3 px-4 text-on-surface">{o.items}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-bold ${o.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : o.status === 'RECEIVING' ? 'bg-amber-100 text-amber-700' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${o.status === 'COMPLETED' ? 'bg-green-500' : o.status === 'RECEIVING' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                    {o.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-on-surface-variant">{o.received}</td>
                <td className="py-3 px-4">
                  <button className="text-primary text-body-sm font-medium hover:underline">
                    {o.status === 'PENDING' ? 'Receive' : 'View'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
