'use client';

import { useAdminData } from '@/lib/api/hooks';
import { fetchRFMAnalysis } from '@/lib/api/admin';

function formatBDT(v: number): string {
  return `৳${v.toLocaleString('en-IN')}`;
}

export default function RfmPage() {
  const { data: segments, loading, error } = useAdminData(fetchRFMAnalysis);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#222]">RFM Analysis</h1>
          <p className="text-sm text-[#888] mt-1">Customer segmentation by Recency, Frequency, and Monetary value</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
          <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
        </div>
      ) : !segments || segments.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">No RFM data available</div>
      ) : (
        <div className="space-y-3">
          {segments.map((s, i) => {
            const colors = ['bg-green-100', 'bg-blue-100', 'bg-amber-100', 'bg-orange-100', 'bg-red-100'];
            return (
              <div key={s.segment} className="bg-white rounded-xl border border-[#eee] p-5">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[i % colors.length]}`}>
                      <span className="material-symbols-outlined text-[20px] text-[#333]">group</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#222]">{s.segment}</h3>
                      <p className="text-xs text-[#888]">{s.count} customers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#888]">Avg LTV</p>
                    <p className="font-semibold text-[#333]">{formatBDT(s.avgMonetary)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#eee]">
                  <div>
                    <p className="text-xs text-[#888]">Avg Recency</p>
                    <p className="text-sm font-semibold text-[#333]">{s.avgRecency} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#888]">Avg Frequency</p>
                    <p className="text-sm font-semibold text-[#333]">{s.avgFrequency} orders</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#888]">Avg Monetary</p>
                    <p className="text-sm font-semibold text-[#333]">{formatBDT(s.avgMonetary)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}