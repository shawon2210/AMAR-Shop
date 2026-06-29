'use client';

import { useState } from 'react';

export default function TaxPage() {
  const [quarter, setQuarter] = useState('1');
  const [year, setYear] = useState('2026');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Tax Reports</h1>
        <button className="flex items-center gap-1.5 px-3 py-2 border border-outline text-on-surface rounded-lg text-body-sm font-medium">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export PDF
        </button>
      </div>

      <div className="flex gap-3 items-end">
        <div>
          <label className="text-label-bold text-on-surface-variant block mb-1">Quarter</label>
          <select value={quarter} onChange={e => setQuarter(e.target.value)} className="px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-sm">
            <option value="1">Q1 (Jan-Mar)</option>
            <option value="2">Q2 (Apr-Jun)</option>
            <option value="3">Q3 (Jul-Sep)</option>
            <option value="4">Q4 (Oct-Dec)</option>
          </select>
        </div>
        <div>
          <label className="text-label-bold text-on-surface-variant block mb-1">Year</label>
          <select value={year} onChange={e => setYear(e.target.value)} className="px-3 py-2 rounded-lg border border-outline-variant bg-surface text-on-surface text-body-sm">
            <option>2025</option>
            <option>2026</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium">Generate Report</button>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-6">
        <div className="text-center pb-4 border-b border-outline-variant">
          <p className="text-label-bold text-on-surface-variant uppercase">VAT / Tax Report</p>
          <p className="text-headline-md text-on-surface font-bold">Q{quarter} {year}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: '৳12,45,000' },
            { label: 'VAT Rate', value: '15%' },
            { label: 'Total VAT', value: '৳1,86,750' },
            { label: 'Total Orders', value: '1,234' },
          ].map((item, i) => (
            <div key={i} className="text-center p-3 bg-surface-container-low rounded-lg">
              <p className="text-label-bold text-on-surface-variant">{item.label}</p>
              <p className="text-title-sm text-on-surface font-semibold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="border border-outline-variant rounded-lg overflow-hidden">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="text-left py-2.5 px-4 text-on-surface-variant font-medium">Month</th>
                <th className="text-right py-2.5 px-4 text-on-surface-variant font-medium">Revenue</th>
                <th className="text-right py-2.5 px-4 text-on-surface-variant font-medium">Taxable</th>
                <th className="text-right py-2.5 px-4 text-on-surface-variant font-medium">VAT (15%)</th>
              </tr>
            </thead>
            <tbody>
              {['January', 'February', 'March'].map((m, i) => {
                const rev = 400000 + Math.random() * 100000;
                return (
                  <tr key={i} className="border-t border-outline-variant/50">
                    <td className="py-2.5 px-4 text-on-surface">{m}</td>
                    <td className="py-2.5 px-4 text-right text-on-surface">৳{Math.round(rev).toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-on-surface">৳{Math.round(rev).toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-on-surface font-semibold">৳{Math.round(rev * 0.15).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
