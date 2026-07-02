'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminData } from '@/lib/api/hooks';
import { fetchWarehouseDashboard, fetchStockAlerts } from '@/lib/api/admin';

function formatBDT(v: number): string {
  return `৳${v.toLocaleString('en-IN')}`;
}

export default function WarehousePage() {
  const { data: dashboard, loading, error } = useAdminData(() => fetchWarehouseDashboard());
  const { data: alerts } = useAdminData(() => fetchStockAlerts());

  if (loading) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-[#222]">Warehouse Management</h1>
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
          <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-[#222]">Warehouse Management</h1>
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Stock', value: dashboard?.totalStock?.toLocaleString() || '0', icon: 'inventory_2', color: 'text-primary' },
    { label: 'Available', value: dashboard?.availableStock?.toLocaleString() || '0', icon: 'check_circle', color: 'text-green-600' },
    { label: 'Reserved', value: dashboard?.reservedStock?.toLocaleString() || '0', icon: 'lock', color: 'text-amber-600' },
    { label: 'Active Picks', value: String(dashboard?.activePicks || 0), icon: 'assignment', color: 'text-blue-600' },
    { label: 'Today Picks', value: String(dashboard?.todayPicks || 0), icon: 'checklist', color: 'text-purple-600' },
    { label: 'Today Packs', value: String(dashboard?.todayPacks || 0), icon: 'inventory', color: 'text-teal-600' },
    { label: 'Low Stock Alerts', value: String(dashboard?.lowStockItems || 0), icon: 'warning', color: 'text-red-600' },
    { label: 'Bins', value: String(dashboard?.totalBins || 0), icon: 'shelves', color: 'text-indigo-600' },
  ];

  const quickLinks = [
    { label: 'Inventory by Bin', href: '/admin/warehouse/inventory', icon: 'view_list' },
    { label: 'Inbound Orders', href: '/admin/warehouse/inbound', icon: 'move_in' },
    { label: 'Pick Lists', href: '/admin/warehouse/pick-lists', icon: 'assignment' },
    { label: 'Transfer Stock', href: '/admin/warehouse', icon: 'swap_horiz' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#222]">Warehouse Management</h1>
          <p className="text-sm text-[#888] mt-1">{dashboard?.warehouseName || 'Loading...'}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Inbound
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-[#ddd] text-[#666] text-sm rounded-lg hover:bg-[#f5f5f5]">
            <span className="material-symbols-outlined text-[18px]">scan</span>
            Scan Barcode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-[#eee] p-4">
            <div className="flex items-center gap-3">
              <div className={card.color}>
                <span className="material-symbols-outlined text-2xl">{card.icon}</span>
              </div>
              <div>
                <p className="text-xs text-[#888]">{card.label}</p>
                <p className="text-lg font-semibold text-[#222]">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="font-semibold text-[#222] mb-4">Performance KPIs</h2>
          <div className="space-y-4">
            {[
              { label: 'Pick Rate (today)', value: `${dashboard?.pickRate || 0} picks`, pct: Math.min(100, dashboard?.pickRate || 0), color: 'bg-primary' },
              { label: 'Pack Rate (today)', value: `${dashboard?.packRate || 0} packs`, pct: Math.min(100, dashboard?.packRate || 0), color: 'bg-teal-500' },
              { label: 'Accuracy', value: `${dashboard?.accuracy || 0}%`, pct: dashboard?.accuracy || 0, color: 'bg-green-500' },
              { label: 'Throughput', value: `${dashboard?.throughput || 0} units`, pct: Math.min(100, (dashboard?.throughput || 0) / 2), color: 'bg-purple-500' },
            ].map((kpi) => (
              <div key={kpi.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#888]">{kpi.label}</span>
                  <span className="font-medium text-[#333]">{kpi.value}</span>
                </div>
                <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${kpi.color}`} style={{ width: `${kpi.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="font-semibold text-[#222] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#eee] hover:border-primary/30 hover:bg-primary/5 transition-colors text-center">
                <span className="material-symbols-outlined text-2xl text-primary">{link.icon}</span>
                <span className="text-sm font-medium text-[#333]">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#eee] p-5">
        <h2 className="font-semibold text-[#222] mb-4">Low Stock Alerts</h2>
        {!alerts || alerts.length === 0 ? (
          <p className="text-sm text-[#888] text-center py-4">No low stock alerts</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#eee]">
                    <th className="text-left py-3 px-3 text-[#888] font-medium">Product</th>
                    <th className="text-left py-3 px-3 text-[#888] font-medium">Current Stock</th>
                    <th className="text-left py-3 px-3 text-[#888] font-medium">Reorder Point</th>
                    <th className="text-left py-3 px-3 text-[#888] font-medium">Status</th>
                    <th className="text-left py-3 px-3 text-[#888] font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((item) => (
                    <tr key={item.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                      <td className="py-3 px-3 font-medium text-[#333]">{item.productName}</td>
                      <td className="py-3 px-3">
                        <span className="text-red-500 font-semibold">{item.currentStock}</span>
                      </td>
                      <td className="py-3 px-3 text-[#888]">{item.reorderPoint}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          Critical
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button className="text-primary text-sm font-medium hover:underline">Reorder</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-2">
              {alerts.map((item) => (
                <div key={item.id} className="border border-[#eee] rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#333]">{item.productName}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Critical
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-[#888]">
                    <span>Stock: <span className="font-semibold text-red-500">{item.currentStock}</span></span>
                    <span>Reorder at: {item.reorderPoint}</span>
                  </div>
                  <button className="mt-2 text-xs text-primary font-medium hover:underline">Reorder</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}