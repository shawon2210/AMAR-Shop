'use client';

import { formatBDT } from '@/types';

interface RevenuePoint {
  date: string;
  revenue: number;
}

interface OrderStatusStat {
  status: string;
  _count: { id: number };
}

interface AdminAnalyticsChartsProps {
  revChart: RevenuePoint[];
  maxRev: number;
  orderStats: OrderStatusStat[];
  statusColors: Record<string, string>;
}

export function AdminAnalyticsCharts({
  revChart,
  maxRev,
  orderStats,
  statusColors,
}: AdminAnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 bg-white rounded-xl border border-[#eee] p-5">
        <h2 className="text-base font-semibold text-[#222] mb-4">Revenue (30 days)</h2>
        <div className="flex items-end gap-[3px] h-40">
          {revChart.map((r, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
              <div
                className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-colors relative group"
                style={{ height: `${(r.revenue / maxRev) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#222] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                  {formatBDT(r.revenue)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-base font-semibold text-[#222] mb-4">Order Status</h2>
          <div className="space-y-3">
            {orderStats.map((o) => {
              const totalOrders = orderStats.reduce((s, x) => s + x._count.id, 0);
              const pct = totalOrders > 0 ? Math.round((o._count.id / totalOrders) * 100) : 0;
              return (
                <div key={o.status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#666]">{o.status}</span>
                    <span className="font-medium text-[#333]">
                      {o._count.id} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${(statusColors[o.status] || 'bg-gray-300').split(' ')[0]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
