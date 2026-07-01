'use client';

import { useState } from 'react';
import { useAdminData } from '@/lib/api/hooks';
import { fetchAdminCreators } from '@/lib/api/admin';

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CreatorsPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useAdminData(
    () => fetchAdminCreators({ page, limit: 20 }),
    [page],
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#222]">Creators</h1>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Reviews</th>
              <th className="p-3">Followers</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-[#888]">
                <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
              </td></tr>
            ) : !data?.creators || data.creators.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-[#888]">No creators found</td></tr>
            ) : (
              data.creators.map((c) => (
                <tr key={c.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333]">{c.name}</td>
                  <td className="p-3 text-[#555]">{c.email}</td>
                  <td className="p-3 text-[#555]">{c.phone || '—'}</td>
                  <td className="p-3 text-[#555]">{c._count.reviews}</td>
                  <td className="p-3 text-[#555]">{c._count.storeFollowers}</td>
                  <td className="p-3 text-[#888] text-xs">{formatDate(c.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#888]">Page {data.page} of {data.totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 bg-white border border-[#ddd] rounded-lg disabled:opacity-50 hover:bg-[#f5f5f5]">Previous</button>
            <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 bg-white border border-[#ddd] rounded-lg disabled:opacity-50 hover:bg-[#f5f5f5]">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
