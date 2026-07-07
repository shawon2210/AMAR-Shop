'use client';

import { useState } from 'react';
import { useAdminData } from '@/lib/api/hooks';
import { fetchCohortAnalysis } from '@/lib/api/admin';
import type { CohortRow } from '@/types';

function getCohortValue(c: CohortRow, col: string): number {
  const val = (c as unknown as Record<string, unknown>)[col];
  return typeof val === 'number' ? val : parseInt(val as string) || 0;
}

export default function CohortsPage() {
  const [period, setPeriod] = useState('month');
  const { data: cohorts, loading, error } = useAdminData(
    () => fetchCohortAnalysis(period),
    [period],
  );

  const cols = cohorts && cohorts.length > 0 ? Object.keys(cohorts[0]).filter((k) => k.startsWith('period_')) : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#222]">Cohort Analysis</h1>
          <p className="text-sm text-[#888] mt-1">Monthly customer retention cohorts</p>
        </div>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-1.5 border border-[#ddd] rounded-lg text-sm bg-white outline-none">
          <option value="month">Monthly</option>
          <option value="quarter">Quarterly</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
          <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
        </div>
      ) : !cohorts || cohorts.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">No cohort data available</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#eee]">
                  <th className="text-left py-3 px-4 text-[#888] font-medium">Cohort</th>
                  <th className="text-center py-3 px-4 text-[#888] font-medium">Users</th>
                  {cols.map((_, i) => (
                    <th key={i} className="text-center py-3 px-4 text-[#888] font-medium">Period {i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohorts.map((c, i) => (
                  <tr key={i} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="py-3 px-4 font-medium text-[#333]">{c.cohort}</td>
                    <td className="py-3 px-4 text-center text-[#555]">{c.base}</td>
                    {cols.map((col, j) => {
                      const pct = getCohortValue(c, col);
                      return (
                        <td key={j} className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            pct >= 40 ? 'bg-green-100 text-green-700' : pct >= 30 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {pct}%
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {cohorts.map((c, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#eee] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-[#333]">{c.cohort}</span>
                  <span className="text-xs text-[#888]">{c.base} users</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {cols.map((col, j) => {
                    const pct = getCohortValue(c, col);
                    return (
                      <div key={j} className="flex items-center justify-between p-2 bg-[#fafafa] rounded-lg">
                        <span className="text-xs text-[#888]">P{j}</span>
                        <span className={`text-xs font-semibold ${pct >= 40 ? 'text-green-600' : pct >= 30 ? 'text-amber-600' : 'text-gray-600'}`}>
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Retention Curve */}
          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="font-semibold text-[#222] mb-4">Retention Curve (Average)</h2>
            <div className="flex items-end gap-3 h-48">
              {['Period 0', 'Period 1', 'Period 2', 'Period 3'].map((p, i) => {
                const vals = cohorts.map((c) => getCohortValue(c, cols[i])).filter((v) => !isNaN(v));
                const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 100 - i * 18;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-primary rounded-t transition-all" style={{ height: `${avg * 1.5}px` }} />
                    <span className="text-sm font-medium text-[#333]">{avg.toFixed(0)}%</span>
                    <span className="text-xs text-[#888]">{p}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
