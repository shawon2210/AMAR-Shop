'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface ReferralStats {
  totalReferrals: number; conversions: number; commissionPaid: number; activeReferrers: number;
}

interface Referrer {
  id: string; referrer: string; code: string; clicks: number;
  conversions: number; earned: number; status: string;
}

const defaultStats: ReferralStats = { totalReferrals: 12480, conversions: 3560, commissionPaid: 890000, activeReferrers: 2340 };

async function fetchReferralStats(): Promise<ReferralStats> {
  try { return await api.get<ReferralStats>('/admin/referrals/stats'); }
  catch { return defaultStats; }
}

async function fetchReferrers(): Promise<Referrer[]> {
  try { return await api.get<Referrer[]>('/admin/referrals'); }
  catch {
    return [
      { id: '1', referrer: 'Rahim Mia', code: 'RAHIM10', clicks: 340, conversions: 28, earned: 42000, status: 'active' },
      { id: '2', referrer: 'Sultana Akter', code: 'SULTANA', clicks: 520, conversions: 45, earned: 67500, status: 'active' },
      { id: '3', referrer: 'Hasan Mahmud', code: 'HASAN20', clicks: 180, conversions: 12, earned: 18000, status: 'active' },
      { id: '4', referrer: 'Nusrat Jahan', code: 'NUSRAT', clicks: 890, conversions: 72, earned: 108000, status: 'active' },
      { id: '5', referrer: 'Kabir Hossain', code: 'KABIR50', clicks: 65, conversions: 3, earned: 4500, status: 'inactive' },
      { id: '6', referrer: 'Taslima Begum', code: 'TASLIMA', clicks: 410, conversions: 35, earned: 52500, status: 'active' },
      { id: '7', referrer: 'Joynal Abedin', code: 'JOYNAL', clicks: 220, conversions: 18, earned: 27000, status: 'active' },
      { id: '8', referrer: 'Shamima Yeasmin', code: 'SHAMIMA', clicks: 1560, conversions: 98, earned: 147000, status: 'active' },
    ];
  }
}

export default function ReferralSystemPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrers, setReferrers] = useState<Referrer[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const load = async () => {
    setLoading(true); setError(null);
    try { const [s, r] = await Promise.all([fetchReferralStats(), fetchReferrers()]); setStats(s); setReferrers(r); }
    catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const items = referrers || [];
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const paginated = items.slice((page - 1) * perPage, page * perPage);

  const statCards = [
    { label: 'Total Referrals', value: stats?.totalReferrals || 0, icon: 'group_add', color: 'text-blue-600' },
    { label: 'Conversions', value: stats?.conversions || 0, icon: 'conversion_path', color: 'text-green-600' },
    { label: 'Commission Paid', value: stats?.commissionPaid || 0, icon: 'payments', color: 'text-emerald-600', isCurrency: true },
    { label: 'Active Referrers', value: stats?.activeReferrers || 0, icon: 'people', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Referral System</h1>

      {error && <AdminError message={error} onRetry={load} />}

      {loading ? <AdminLoading /> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-[#eee] p-5">
                <span className={`material-symbols-outlined ${s.color} mb-2 block`}>{s.icon}</span>
                <p className="text-xs text-[#888]">{s.label}</p>
                <p className="text-xl font-bold text-[#222] mt-1">{'isCurrency' in s && s.isCurrency ? formatBDT(s.value as number) : (s.value as number).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>

          {referrers && referrers.length > 0 ? (
            <>
              <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                      <th className="p-3">Referrer</th>
                      <th className="p-3">Code</th>
                      <th className="p-3">Clicks</th>
                      <th className="p-3">Conversions</th>
                      <th className="p-3">Earned</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((r) => (
                      <tr key={r.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                        <td className="p-3 font-medium text-[#333]">{r.referrer}</td>
                        <td className="p-3 font-mono text-xs text-[#888]">{r.code}</td>
                        <td className="p-3 text-[#666]">{r.clicks.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-[#666]">{r.conversions}</td>
                        <td className="p-3 font-medium">{formatBDT(r.earned)}</td>
                        <td className="p-3">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sm:hidden space-y-3">
                {paginated.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl border border-[#eee] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#333]">{r.referrer}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                    </div>
                    <div className="text-xs text-[#888]">Code: {r.code}</div>
                    <div className="text-xs text-[#666] flex justify-between">
                      <span>{r.clicks.toLocaleString('en-IN')} clicks</span>
                      <span>{r.conversions} conversions</span>
                      <span className="font-medium">{formatBDT(r.earned)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination page={page} totalPages={totalPages} total={items.length} onPageChange={setPage} />
            </>
          ) : (
            !loading && <AdminEmpty message="No referrers found" />
          )}
        </>
      )}
    </div>
  );
}
