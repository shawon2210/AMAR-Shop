'use client';

import { useState } from 'react';

const salesChartData = [45000, 52000, 38000, 61000, 48000, 55000, 72000, 59000, 63000, 47000, 68000, 81000];

function SalesChart() {
  const max = Math.max(...salesChartData);
  const w = 600, h = 200;
  const barW = (w / salesChartData.length) * 0.7;
  const gap = (w / salesChartData.length) * 0.3;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48">
      {salesChartData.map((v, i) => {
        const barH = (v / max) * h * 0.85;
        const x = (i / salesChartData.length) * w + gap / 2;
        const y = h - barH - 10;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill="#a63600" opacity="0.8" />
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" className="fill-[#888] text-[9px]">{(v / 1000).toFixed(0)}k</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ReportsPage() {
  const [tab, setTab] = useState('sales');

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Reports</h1>

      <div className="flex gap-2 flex-wrap">
        {['sales', 'products', 'sellers'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors capitalize ${tab === t ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {t} Report
          </button>
        ))}
      </div>

      {tab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Sales', value: '৳6,42,00,000' },
              { label: 'Order Count', value: '24,890' },
              { label: 'Avg Order Value', value: '৳2,580' },
              { label: 'Conversion Rate', value: '3.2%' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-[#eee]">
                <p className="text-2xl font-bold text-[#222]">{s.value}</p>
                <p className="text-sm text-[#888] mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label className="block text-xs text-[#888] mb-1">From</label>
              <input type="date" className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1">To</label>
              <input type="date" className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <button className="mt-5 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Apply</button>
            <div className="mt-5 flex gap-2 ml-auto">
              <button className="px-3 py-2 border border-[#ddd] text-sm rounded-lg hover:bg-[#f5f5f5]">CSV</button>
              <button className="px-3 py-2 border border-[#ddd] text-sm rounded-lg hover:bg-[#f5f5f5]">PDF</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Sales Trend (Last 30 Days)</h2>
            <SalesChart />
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Top Selling Products</h2>
            <div className="space-y-3">
              {[
                { name: 'Samsung Galaxy S24 Ultra', sold: 2450, revenue: '৳31,60,50,000' },
                { name: 'Men\'s Cotton Panjabi', sold: 8200, revenue: '৳1,54,98,000' },
                { name: 'Wireless Bluetooth Earbuds', sold: 5600, revenue: '৳1,79,20,000' },
                { name: 'Organic Green Tea (100 Pack)', sold: 4200, revenue: '৳35,70,000' },
                { name: 'Smart LED TV 55 Inch', sold: 1800, revenue: '৳11,70,00,000' },
              ].map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#eee] flex items-center justify-center text-[10px] font-bold text-[#888]">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#333]">{p.name}</p>
                    <p className="text-xs text-[#888]">{p.sold.toLocaleString()} sold</p>
                  </div>
                  <p className="text-sm font-semibold">{p.revenue}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#eee] p-5">
              <h2 className="text-lg font-semibold text-[#222] mb-4">Low Stock Products</h2>
              <div className="space-y-2 text-sm">
                {[
                  { name: 'Wireless Bluetooth Earbuds', stock: 3 },
                  { name: 'Handcrafted Vase', stock: 2 },
                  { name: 'Winter Jacket - L Size', stock: 5 },
                  { name: 'Stainless Steel Bottle', stock: 0 },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <span className="text-[#444]">{p.name}</span>
                    <span className={`font-medium ${p.stock === 0 ? 'text-red-500' : 'text-amber-500'}`}>{p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-[#eee] p-5">
              <h2 className="text-lg font-semibold text-[#222] mb-4">Most Viewed</h2>
              <div className="space-y-2 text-sm">
                {[
                  { name: 'Samsung Galaxy S24 Ultra', views: '2,40,000' },
                  { name: 'iPhone 16 Pro Max', views: '1,80,000' },
                  { name: 'Men\'s Cotton Panjabi', views: '1,20,000' },
                  { name: 'Smart LED TV 55 Inch', views: '95,000' },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <span className="text-[#444]">{p.name}</span>
                    <span className="text-[#666]">{p.views}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'sellers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Revenue by Seller</h2>
            <div className="space-y-3">
              {[
                { name: 'TechHaven BD', revenue: '৳28,40,000', commission: '৳1,42,000' },
                { name: 'Fashion Hub', revenue: '৳21,60,000', commission: '৳1,51,200' },
                { name: 'Gadget Pro', revenue: '৳18,90,000', commission: '৳94,500' },
                { name: 'Home Decor Ltd', revenue: '৳15,20,000', commission: '৳1,21,600' },
                { name: 'Book Nook', revenue: '৳12,70,000', commission: '৳1,27,000' },
              ].map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#eee] flex items-center justify-center text-[10px] font-bold text-[#888]">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#333]">{s.name}</p>
                    <p className="text-xs text-[#888]">Commission: {s.commission}</p>
                  </div>
                  <p className="text-sm font-semibold">{s.revenue}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Commission Summary</h2>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Total Commission Earned', value: '৳6,36,300' },
                { label: 'Average Commission Rate', value: '6.8%' },
                { label: 'Highest Commission', value: '৳1,51,200 (Fashion Hub)' },
                { label: 'Pending Payouts', value: '৳2,40,000' },
              ].map((s) => (
                <div key={s.label} className="flex justify-between py-2 border-b border-[#f0f0f0] last:border-0">
                  <span className="text-[#888]">{s.label}</span>
                  <span className="font-medium text-[#333]">{s.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-2 border border-[#ddd] text-sm rounded-lg hover:bg-[#f5f5f5]">Export CSV</button>
              <button className="px-3 py-2 border border-[#ddd] text-sm rounded-lg hover:bg-[#f5f5f5]">Export PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
