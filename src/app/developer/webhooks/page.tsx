'use client';

import { useState } from 'react';

export default function WebhooksPage() {
  const [webhooks] = useState([
    { id: '1', event: 'order.created', url: 'https://api.mystore.com/webhook/orders', isActive: true, lastDelivery: '5 mins ago' },
    { id: '2', event: 'payment.completed', url: 'https://api.mystore.com/webhook/payments', isActive: true, lastDelivery: '1 hour ago' },
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Webhooks</h1>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">Register Webhook</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        {webhooks.map((wh) => (
          <div key={wh.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0">
            <div>
              <p className="font-medium text-gray-900">{wh.event}</p>
              <p className="text-sm text-gray-500 font-mono">{wh.url}</p>
              <p className="text-xs text-gray-400 mt-1">Last delivery: {wh.lastDelivery}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-sm text-orange-600 hover:underline">Test</button>
              <button className="text-sm text-gray-600 hover:underline">Logs</button>
              <button className="text-sm text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Available Events</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p><code className="bg-gray-100 px-2 py-0.5 rounded text-xs">order.created</code> — Triggered when a new order is placed</p>
          <p><code className="bg-gray-100 px-2 py-0.5 rounded text-xs">order.updated</code> — Triggered when order status changes</p>
          <p><code className="bg-gray-100 px-2 py-0.5 rounded text-xs">payment.completed</code> — Triggered when payment is confirmed</p>
          <p><code className="bg-gray-100 px-2 py-0.5 rounded text-xs">product.updated</code> — Triggered when product details change</p>
        </div>
      </div>
    </div>
  );
}
