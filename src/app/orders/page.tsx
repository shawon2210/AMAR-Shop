'use client';

import { useState } from 'react';

const tabs = ['All', 'To Pay', 'To Ship', 'To Receive', 'Completed', 'Cancelled'];

// Mock orders
const mockOrders = [
  {
    id: 'ORD-20260629-001',
    date: '2026-06-28',
    status: 'to_receive',
    total: 14999,
    items: 1,
    product: 'Premium Smartphone 5G - Midnight Black',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDD-D_n1BtPTJ-wZiQJqzsG6JT-a5SFFmFH24Somtcsod7etEs9LVWYLD5fhkwfvzXPm8L6_paVkdzbrcmH_pQv7tW9XshZcvZ2ms3k9WF_LCfO40AsQ4YuEcTzi_rGHBku71LCC4q2PUiR6vzKZvhodxqdQmxEexsT2vMjKXni0p_yg836pOCYt-fD-KjOz-W86BowILONAgdLMgAyyIQvHB0FW3U7LdfuI3B39oyYtirSeBEzjDkazarLqGTsxSOWeXk7t1lRSg',
    store: 'TechTrendz Official Store',
  },
  {
    id: 'ORD-20260628-002',
    date: '2026-06-26',
    status: 'completed',
    total: 1250,
    items: 1,
    product: 'TWS Noise Cancelling Earbuds Gen 2',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfqA1zQh0DH6QsU9ll2OpACO3mm5kTm6Gbuf5HCTSAHlDJwNbPgvxQwdnC5N7A3vu1_CiAICNU2jXI9Kvt3EPRIUMy8X6hFcxidjoaP4VMwh67yGx7UhAWzwv2_iJhvd9JB_mk8Qwoq9iwbgEtWJ8jC54zArZvvhr9y-yJ9AMKrXPs_Tp0nBgvgVl6_eIs91rMI3lsjwM7SLar2pF4jl-qKFQd8y_8AdeuymAAYMaokR2O2efE4lGLtqEVGsyK17_hcLgyYq5F-w',
    store: 'TechTrendz Official Store',
  },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  to_pay: { label: 'Awaiting Payment', color: 'text-amber-600 bg-amber-50' },
  to_ship: { label: 'To Ship', color: 'text-blue-600 bg-blue-50' },
  to_receive: { label: 'To Receive', color: 'text-primary bg-primary-fixed' },
  completed: { label: 'Completed', color: 'text-green-600 bg-green-50' },
  cancelled: { label: 'Cancelled', color: 'text-error bg-error-container' },
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="px-container-margin pt-md pb-24">
      <h1 className="font-headline-md text-headline-md mb-md">My Orders</h1>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-1 border-b border-outline-variant -mx-container-margin px-container-margin">
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
        {mockOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined text-5xl text-secondary mb-3">receipt_long</span>
            <p className="text-secondary">No orders found</p>
          </div>
        ) : (
          mockOrders.map(order => {
            const status = statusLabels[order.status] || statusLabels.completed;
            return (
              <div key={order.id} className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                <div className="px-md py-sm bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-secondary text-lg">store</span>
                    <span className="font-medium">{order.store}</span>
                  </div>
                  <span className={`text-[10px] font-label-bold px-2 py-0.5 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="p-md flex gap-md">
                  <div className="w-16 h-16 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                    <img className="w-full h-full object-cover" src={order.image} alt={order.product} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-title-sm text-title-sm truncate">{order.product}</p>
                    <p className="text-xs text-secondary mt-0.5">Qty: {order.items}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="font-price-lg text-primary">৳{order.total.toLocaleString('en-BD')}</span>
                      <span className="text-[10px] text-secondary">{order.date}</span>
                    </div>
                  </div>
                </div>

                <div className="px-md py-sm border-t border-outline-variant flex justify-end gap-2">
                  <button className="px-md py-1.5 border border-outline rounded-lg text-xs font-label-bold hover:bg-surface-container transition-colors">
                    View Details
                  </button>
                  {(order.status === 'to_receive') && (
                    <button className="px-md py-1.5 bg-primary text-on-primary rounded-lg text-xs font-label-bold hover:brightness-110 transition-colors">
                      Confirm Received
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
