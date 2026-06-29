'use client';

const chartData = [45, 52, 38, 65, 48, 72, 58, 63, 55, 78, 62, 85, 70, 74, 68, 90, 82, 76, 88, 92, 78, 84, 96, 88, 102, 94, 110, 98, 105, 95];
const conversionData = [3, 5, 2, 6, 4, 7, 5, 6, 4, 8, 6, 9, 7, 7, 5, 10, 8, 7, 9, 11, 8, 9, 12, 10, 13, 11, 14, 12, 13, 11];
const revenueData = [1200, 2100, 800, 2800, 1600, 3500, 2400, 2500, 1800, 4000, 3000, 4500, 3200, 3100, 2000, 5000, 3800, 3200, 4200, 5500, 3600, 4200, 6000, 4800, 6500, 5200, 7000, 5600, 6200, 5100];

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const w = 600, h = 120;
  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h * 0.85 - 10}`).join(' ');
  const area = `M0,${h} ${points} ${w},${h}Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AffiliateAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Performance Analytics</h1>
        <select className="px-3 py-2 border border-[#ddd] rounded-lg text-sm">
          <option>Last 30 Days</option><option>Last 7 Days</option><option>Last 90 Days</option><option>Custom Range</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[#eee] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#222]">Clicks</h2>
          <span className="text-sm font-medium text-green-600">+12.3%</span>
        </div>
        <MiniChart data={chartData} color="#a63600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#222]">Conversions</h2>
            <span className="text-sm font-medium text-green-600">+8.7%</span>
          </div>
          <MiniChart data={conversionData} color="#22c55e" />
        </div>
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#222]">Revenue</h2>
            <span className="text-sm font-medium text-green-600">+15.2%</span>
          </div>
          <MiniChart data={revenueData} color="#6366f1" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">By Device</h2>
          <div className="space-y-3">
            {[
              { name: 'Mobile', value: 68, color: '#a63600' },
              { name: 'Desktop', value: 22, color: '#6366f1' },
              { name: 'Tablet', value: 10, color: '#22c55e' },
            ].map((d) => (
              <div key={d.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#555]">{d.name}</span>
                  <span className="font-medium text-[#333]">{d.value}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#eee] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">By Location</h2>
          <div className="space-y-3">
            {[
              { name: 'Dhaka', value: 42 },
              { name: 'Chattogram', value: 18 },
              { name: 'Sylhet', value: 12 },
              { name: 'Khulna', value: 10 },
              { name: 'Rajshahi', value: 8 },
            ].map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="text-[#555]">{d.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-[#eee] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${d.value}%` }} />
                  </div>
                  <span className="font-medium text-[#333] w-8 text-right">{d.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Top Traffic Sources</h2>
          <div className="space-y-2">
            {[
              { source: 'YouTube', clicks: 456, pct: 35 },
              { source: 'Facebook', clicks: 324, pct: 25 },
              { source: 'Instagram', clicks: 212, pct: 16 },
              { source: 'Blog', clicks: 156, pct: 12 },
              { source: 'WhatsApp', clicks: 136, pct: 10 },
            ].map((s) => (
              <div key={s.source} className="flex items-center justify-between p-2 bg-[#fafafa] rounded-lg">
                <span className="text-sm text-[#555]">{s.source}</span>
                <span className="text-sm font-medium">{s.clicks} <span className="text-xs text-[#888]">({s.pct}%)</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
