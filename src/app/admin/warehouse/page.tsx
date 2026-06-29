'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Dashboard {
  warehouseId: string;
  warehouseName: string;
  totalBins: number;
  totalInventoryItems: number;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  activePicks: number;
  todayPicks: number;
  todayPacks: number;
  lowStockItems: number;
  pickRate: number;
  packRate: number;
  accuracy: number;
  throughput: number;
}

const defaultDashboard: Dashboard = {
  warehouseId: 'wh-1',
  warehouseName: 'Dhaka Warehouse',
  totalBins: 128,
  totalInventoryItems: 345,
  totalStock: 12450,
  reservedStock: 2340,
  availableStock: 10110,
  activePicks: 12,
  todayPicks: 89,
  todayPacks: 67,
  lowStockItems: 5,
  pickRate: 89,
  packRate: 67,
  accuracy: 97.5,
  throughput: 156,
};

export default function WarehousePage() {
  const [dashboard] = useState<Dashboard>(defaultDashboard);

  const statCards = [
    { label: 'Total Stock', value: dashboard.totalStock.toLocaleString(), icon: 'inventory_2', color: 'text-primary' },
    { label: 'Available', value: dashboard.availableStock.toLocaleString(), icon: 'check_circle', color: 'text-green-600' },
    { label: 'Reserved', value: dashboard.reservedStock.toLocaleString(), icon: 'lock', color: 'text-amber-600' },
    { label: 'Active Picks', value: dashboard.activePicks, icon: 'assignment', color: 'text-blue-600' },
    { label: 'Today Picks', value: dashboard.todayPicks, icon: 'checklist', color: 'text-purple-600' },
    { label: 'Today Packs', value: dashboard.todayPacks, icon: 'inventory', color: 'text-teal-600' },
    { label: 'Low Stock Alerts', value: dashboard.lowStockItems, icon: 'warning', color: 'text-red-600' },
    { label: 'Bins', value: dashboard.totalBins, icon: 'shelves', color: 'text-indigo-600' },
  ];

  const quickLinks = [
    { label: 'Inventory by Bin', href: '/admin/warehouse/inventory', icon: 'view_list' },
    { label: 'Inbound Orders', href: '/admin/warehouse/inbound', icon: 'move_in' },
    { label: 'Pick Lists', href: '/admin/warehouse/pick-lists', icon: 'assignment' },
    { label: 'Transfer Stock', href: '/admin/warehouse', icon: 'swap_horiz' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md text-on-surface">Warehouse Management</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">{dashboard.warehouseName}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium hover:bg-primary-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Inbound
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-outline text-on-surface rounded-lg text-body-sm font-medium hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">scan</span>
            Scan Barcode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className="bg-surface rounded-xl border border-outline-variant p-4">
            <div className="flex items-center gap-3">
              <div className={`${card.color}`}>
                <span className="material-symbols-outlined text-2xl">{card.icon}</span>
              </div>
              <div>
                <p className="text-body-sm text-on-surface-variant">{card.label}</p>
                <p className="text-title-sm text-on-surface font-semibold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <h2 className="text-title-sm text-on-surface font-semibold mb-4">Performance KPIs</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-body-sm mb-1">
                <span className="text-on-surface-variant">Pick Rate (today)</span>
                <span className="text-on-surface font-medium">{dashboard.pickRate} picks</span>
              </div>
              <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, dashboard.pickRate)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-body-sm mb-1">
                <span className="text-on-surface-variant">Pack Rate (today)</span>
                <span className="text-on-surface font-medium">{dashboard.packRate} packs</span>
              </div>
              <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${Math.min(100, dashboard.packRate)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-body-sm mb-1">
                <span className="text-on-surface-variant">Accuracy</span>
                <span className="text-on-surface font-medium">{dashboard.accuracy}%</span>
              </div>
              <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${dashboard.accuracy}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-body-sm mb-1">
                <span className="text-on-surface-variant">Throughput</span>
                <span className="text-on-surface font-medium">{dashboard.throughput} units</span>
              </div>
              <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(100, dashboard.throughput / 2)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant p-5">
          <h2 className="text-title-sm text-on-surface font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-outline-variant hover:bg-primary/5 transition-colors text-center">
                <span className="material-symbols-outlined text-2xl text-primary">{link.icon}</span>
                <span className="text-body-sm text-on-surface font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant p-5">
        <h2 className="text-title-sm text-on-surface font-semibold mb-4">Low Stock Alerts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left py-3 px-3 text-on-surface-variant font-medium">Product</th>
                <th className="text-left py-3 px-3 text-on-surface-variant font-medium">Current Stock</th>
                <th className="text-left py-3 px-3 text-on-surface-variant font-medium">Reorder Point</th>
                <th className="text-left py-3 px-3 text-on-surface-variant font-medium">Status</th>
                <th className="text-left py-3 px-3 text-on-surface-variant font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Samsung Galaxy S25', stock: 3, reorder: 10 },
                { name: 'iPhone 16 Pro Max', stock: 5, reorder: 15 },
                { name: 'Sony WH-1000XM6', stock: 2, reorder: 8 },
                { name: 'MacBook Air M4', stock: 1, reorder: 5 },
                { name: 'AirPods Pro 3', stock: 4, reorder: 20 },
              ].map((item, i) => (
                <tr key={i} className="border-b border-outline-variant/50 hover:bg-surface-container-low">
                  <td className="py-3 px-3 text-on-surface">{item.name}</td>
                  <td className="py-3 px-3">
                    <span className="text-error font-semibold">{item.stock}</span>
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant">{item.reorder}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-error-container text-on-error-container rounded-full text-label-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-error" />
                      Critical
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button className="text-primary text-body-sm font-medium hover:underline">Reorder</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
