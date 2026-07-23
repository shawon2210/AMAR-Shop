'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate, ORDER_STATUS_COLORS } from '@/types';
import { api } from '@/services/api';

interface WishlistItem {
  id: string;
  customer: string;
  customerId: string;
  product: string;
  productId: string;
  price: number;
  addedAt: string;
}

interface WishlistResponse {
  data: WishlistItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchWishlists(params: { page: number; limit: number; search?: string }): Promise<WishlistResponse> {
  try {
    const q = new URLSearchParams();
    q.set('page', String(params.page));
    q.set('limit', String(params.limit));
    if (params.search) q.set('search', params.search);
    return await api.get<WishlistResponse>(`/admin/wishlists?${q.toString()}`);
  } catch {
    return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}

export default function WishlistsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<WishlistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { page: number; limit: number; search?: string } = { page, limit: 10 };
      if (search) params.search = search;
      const res = await fetchWishlists(params);
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, search]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Wishlists</h1>

      {error && <AdminError message={error} onRetry={fetchData} />}

      <div className="flex items-center gap-2 bg-white border border-[#ddd] rounded-lg px-3 py-2 w-full sm:w-64">
        <span className="material-symbols-outlined text-[#888] text-[20px]">search</span>
        <input type="text" placeholder="Search by customer..."
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-transparent border-none outline-none text-sm flex-1" />
      </div>

      {loading ? <AdminLoading /> : !data || data.data.length === 0 ? (
        <AdminEmpty message="No wishlist items found" />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Customer</th>
                <th className="p-3">Product</th>
                <th className="p-3">Price</th>
                <th className="p-3">Added Date</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((w) => (
                <tr key={w.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333]">{w.customer}</td>
                  <td className="p-3 text-[#666] max-w-[280px] truncate">{w.product}</td>
                  <td className="p-3 text-[#333]">{formatBDT(w.price)}</td>
                  <td className="p-3 text-[#888] text-xs">{formatDate(w.addedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={setPage} />
      )}
    </div>
  );
}
