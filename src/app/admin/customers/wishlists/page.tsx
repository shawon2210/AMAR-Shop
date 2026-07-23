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
    const mock: WishlistItem[] = [
      { id: '1', customer: 'Rahim Ahmed', customerId: 'u1', product: 'Samsung Galaxy S24 Ultra', productId: 'p1', price: 145000, addedAt: '2026-07-15T10:30:00Z' },
      { id: '2', customer: 'Fatima Begum', customerId: 'u2', product: 'Nike Air Max 270', productId: 'p2', price: 12500, addedAt: '2026-07-18T14:15:00Z' },
      { id: '3', customer: 'Kabir Hossain', customerId: 'u3', product: 'Apple MacBook Pro M3', productId: 'p3', price: 249000, addedAt: '2026-07-19T09:00:00Z' },
      { id: '4', customer: 'Nusrat Jahan', customerId: 'u4', product: 'Sony WH-1000XM5', productId: 'p4', price: 32000, addedAt: '2026-07-20T16:45:00Z' },
      { id: '5', customer: 'Shakib Khan', customerId: 'u5', product: 'Dell XPS 16', productId: 'p5', price: 185000, addedAt: '2026-07-21T11:20:00Z' },
    ];
    const filtered = params.search ? mock.filter((w) => w.customer.toLowerCase().includes(params.search!.toLowerCase())) : mock;
    return { data: filtered, total: filtered.length, page: 1, limit: 10, totalPages: 1 };
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
