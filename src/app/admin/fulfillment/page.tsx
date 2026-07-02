'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminData } from '@/lib/api/hooks';
import { fetchCourierPerformance, fetchFulfillmentShipments } from '@/lib/api/admin';
import type { CourierPerformance, Shipment } from '@/lib/api/admin';

const statusColors: Record<string, string> = {
  DELIVERED: 'bg-green-100 text-green-700',
  IN_TRANSIT: 'bg-blue-100 text-blue-700',
  PICKUP_SCHEDULED: 'bg-amber-100 text-amber-700',
  PENDING: 'bg-gray-100 text-gray-700',
};

export default function FulfillmentPage() {
  const { data: couriers, loading: loadingCouriers } = useAdminData(() => fetchCourierPerformance());
  const { data: shipmentsData, loading: loadingShipments } = useAdminData(() => fetchFulfillmentShipments({ limit: 10 }));

  const stats = [
    { label: 'Active Shipments', value: (shipmentsData?.shipments?.filter((s) => s.status === 'IN_TRANSIT').length || 0).toString(), icon: 'local_shipping', color: 'text-primary' },
    { label: 'Pending Pickup', value: (shipmentsData?.shipments?.filter((s) => s.status === 'PICKUP_SCHEDULED').length || 0).toString(), icon: 'schedule', color: 'text-amber-600' },
    { label: 'In Transit', value: (shipmentsData?.shipments?.filter((s) => s.status === 'IN_TRANSIT').length || 0).toString(), icon: 'route', color: 'text-blue-600' },
    { label: 'Delivered', value: (shipmentsData?.shipments?.filter((s) => s.status === 'DELIVERED').length || 0).toString(), icon: 'check_circle', color: 'text-green-600' },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Fulfillment Network</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#eee] p-4">
            <div className="flex items-center gap-3">
              <div className={s.color}><span className="material-symbols-outlined text-2xl">{s.icon}</span></div>
              <div>
                <p className="text-xs text-[#888]">{s.label}</p>
                <p className="text-lg font-semibold text-[#222]">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#222]">Courier Performance</h2>
            <Link href="/admin/fulfillment/courier" className="text-primary text-sm">View All</Link>
          </div>
          {loadingCouriers ? (
            <div className="text-center text-[#888] py-4">
              <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
            </div>
          ) : !couriers || couriers.length === 0 ? (
            <p className="text-sm text-[#888] text-center py-4">No courier data</p>
          ) : (
            <div className="space-y-3">
              {couriers.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#eee]/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#333]">{c.name}</p>
                    <p className="text-xs text-[#888]">{c.delivered}/{c.shipments} delivered</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">{c.rate}%</p>
                    <p className="text-xs text-[#888]">{c.onTime}% on-time</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="font-semibold text-[#222] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Create Shipment', icon: 'add_circle', href: '/admin/fulfillment' },
              { label: 'Schedule Pickup', icon: 'calendar_today', href: '/admin/fulfillment/pickup' },
              { label: 'Track Order', icon: 'pin_drop', href: '/admin/fulfillment/tracking' },
              { label: 'SLA Calculator', icon: 'timer', href: '/admin/fulfillment' },
            ].map((link, i) => (
              <Link key={i} href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#eee] hover:border-primary/30 hover:bg-primary/5 transition-colors text-center">
                <span className="material-symbols-outlined text-2xl text-primary">{link.icon}</span>
                <span className="text-sm font-medium text-[#333]">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#eee] p-5">
        <h2 className="font-semibold text-[#222] mb-4">Recent Shipments</h2>
        {loadingShipments ? (
          <div className="text-center text-[#888] py-4">
            <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
          </div>
        ) : !shipmentsData?.shipments || shipmentsData.shipments.length === 0 ? (
          <p className="text-sm text-[#888] text-center py-4">No shipments found</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#eee]">
                    <th className="text-left py-3 px-3 text-[#888] font-medium">Tracking ID</th>
                    <th className="text-left py-3 px-3 text-[#888] font-medium">Courier</th>
                    <th className="text-left py-3 px-3 text-[#888] font-medium">Status</th>
                    <th className="text-left py-3 px-3 text-[#888] font-medium">Est. Delivery</th>
                    <th className="text-left py-3 px-3 text-[#888] font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shipmentsData.shipments.map((s) => (
                    <tr key={s.trackingId} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                      <td className="py-3 px-3 font-mono text-sm font-medium text-[#333]">{s.trackingId}</td>
                      <td className="py-3 px-3 text-[#666]">{s.courier}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusColors[s.status] || 'bg-gray-100 text-gray-700'}`}>
                          {s.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#888] text-xs">{s.estimatedDelivery ? new Date(s.estimatedDelivery).toLocaleDateString() : '—'}</td>
                      <td className="py-3 px-3">
                        <button className="text-primary text-sm font-medium hover:underline">Track</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-2">
              {shipmentsData.shipments.map((s) => (
                <div key={s.trackingId} className="border border-[#eee] rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-[#333]">{s.trackingId}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[s.status] || 'bg-gray-100 text-gray-700'}`}>
                      {s.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-[#888]">
                    <span>{s.courier}</span>
                    <span>{s.estimatedDelivery ? new Date(s.estimatedDelivery).toLocaleDateString() : '—'}</span>
                  </div>
                  <button className="mt-2 text-xs text-primary font-medium hover:underline">Track</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}