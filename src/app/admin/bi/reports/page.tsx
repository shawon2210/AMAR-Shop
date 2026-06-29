'use client';

import { useState } from 'react';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'builder' | 'scheduled'>('builder');

  const scheduledReports = [
    { name: 'Weekly Executive Summary', type: 'Executive', cron: '0 8 * * 1', format: 'PDF', status: 'Active' },
    { name: 'Monthly Seller Performance', type: 'Seller', cron: '0 9 1 * *', format: 'EXCEL', status: 'Active' },
    { name: 'Daily Revenue Report', type: 'Custom', cron: '0 7 * * *', format: 'PDF', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Custom Reports</h1>
        <div className="flex gap-2 bg-surface-container p-1 rounded-lg">
          <button onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-md text-body-sm font-medium transition-colors ${activeTab === 'builder' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
            Report Builder
          </button>
          <button onClick={() => setActiveTab('scheduled')}
            className={`px-3 py-1.5 rounded-md text-body-sm font-medium transition-colors ${activeTab === 'scheduled' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
            Scheduled Reports
          </button>
        </div>
      </div>

      {activeTab === 'builder' ? (
        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
          <h2 className="text-title-sm text-on-surface font-semibold">Build Custom Report</h2>

          <div>
            <label className="text-label-bold text-on-surface-variant block mb-1">Report Name</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-sm" placeholder="My Custom Report" />
          </div>

          <div>
            <label className="text-label-bold text-on-surface-variant block mb-1">Metrics</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Revenue', 'Orders', 'Users', 'Products Sold', 'GMV', 'Settlements'].map(m => (
                <label key={m} className="flex items-center gap-2 p-2 rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-container-low">
                  <input type="checkbox" defaultChecked className="accent-primary" />
                  <span className="text-body-sm text-on-surface">{m}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-label-bold text-on-surface-variant block mb-1">Date Range</label>
              <div className="flex gap-2">
                <input type="date" className="flex-1 px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-sm" />
                <input type="date" className="flex-1 px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-sm" />
              </div>
            </div>
            <div>
              <label className="text-label-bold text-on-surface-variant block mb-1">Group By</label>
              <select className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-sm">
                <option>None</option>
                <option>Day</option>
                <option>Week</option>
                <option>Month</option>
                <option>Seller</option>
                <option>Category</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-outline text-on-surface rounded-lg text-body-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">preview</span>
              Preview
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Generate
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {scheduledReports.map((r, i) => (
            <div key={i} className="bg-surface rounded-xl border border-outline-variant p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                </div>
                <div>
                  <p className="text-body-md text-on-surface font-semibold">{r.name}</p>
                  <p className="text-body-sm text-on-surface-variant">{r.type} · {r.cron} · {r.format}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-label-bold">Active</span>
                <button className="px-3 py-1.5 border border-outline text-on-surface rounded-lg text-body-sm font-medium">Edit</button>
              </div>
            </div>
          ))}
          <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium w-fit">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Schedule New Report
          </button>
        </div>
      )}
    </div>
  );
}
