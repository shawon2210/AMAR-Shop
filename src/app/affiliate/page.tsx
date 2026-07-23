'use client';

import Link from 'next/link';
import { useGetAffiliateStats, useGetAffiliateClicks, useGetAffiliateTopProducts, useGetAffiliateReferral } from '@/services/affiliate';

export default function AffiliateDashboard() {
  const { data: statsData } = useGetAffiliateStats();
  const { data: clicks = [] } = useGetAffiliateClicks();
  const { data: topProducts = [] } = useGetAffiliateTopProducts();
  const { data: referral } = useGetAffiliateReferral();

  const stats = statsData?.stats ?? [];
  const availableBalance = statsData?.availableBalance ?? 0;
  const pendingAmount = statsData?.pendingAmount ?? 0;
  const paidAmount = statsData?.paidAmount ?? 0;
  const referralCode = referral?.code ?? 'AMAR7F3K';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Affiliate Dashboard</h1>
        <Link href="/affiliate/links" className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
          Create Tracking Link
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-[#eee]">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-[#888]">{s.icon}</span>
              <span className={`text-xs font-semibold ${s.color}`}>{s.change}</span>
            </div>
            <p className="text-2xl font-bold text-[#222]">{s.value}</p>
            <p className="text-sm text-[#888] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#eee]">
          <div className="p-5 border-b border-[#eee] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#222]">Recent Clicks</h2>
            <Link href="/affiliate/analytics" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          {clicks.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#888]">No clicks yet</div>
          ) : (
            <div className="divide-y divide-[#f5f5f5]">
              {clicks.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-[#fafafa]">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      c.converted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">
                        {c.converted ? 'check' : 'ads_click'}
                      </span>
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#333]">{c.product}</p>
                      <p className="text-xs text-[#888]">{c.time}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{c.commission}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Earnings Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#888]">Available Balance</p>
                <p className="text-3xl font-bold text-[#222]">৳{availableBalance.toLocaleString('en-IN')}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#fafafa] rounded-lg p-3">
                  <p className="text-xs text-[#888]">Pending</p>
                  <p className="text-lg font-bold text-amber-600">৳{pendingAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-[#fafafa] rounded-lg p-3">
                  <p className="text-xs text-[#888]">Paid</p>
                  <p className="text-lg font-bold text-green-600">৳{paidAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
                Request Payout
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Referral Code</h2>
            <div className="bg-[#fafafa] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary tracking-wider">{referralCode}</p>
              <p className="text-xs text-[#888] mt-1">Share this code with your audience</p>
            </div>
          </div>
        </div>
      </div>

      {topProducts.length > 0 && (
        <div className="bg-white rounded-xl border border-[#eee]">
          <div className="p-5 border-b border-[#eee]">
            <h2 className="text-lg font-semibold text-[#222]">Top Performing Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-[#888] text-xs uppercase tracking-wider border-b border-[#eee]">
                <th className="p-3">Product</th><th className="p-3">Clicks</th>
                <th className="p-3">Conversions</th><th className="p-3">Revenue</th><th className="p-3">Rate</th>
              </tr></thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.name} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{p.name}</td>
                    <td className="p-3 text-[#555]">{p.clicks}</td>
                    <td className="p-3 text-[#555]">{p.conversions}</td>
                    <td className="p-3 font-semibold">{p.revenue}</td>
                    <td className="p-3">
                      <span className="text-green-600 font-medium">{Math.round((p.conversions / p.clicks) * 100)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}