'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate, ORDER_STATUS_COLORS } from '@/types';
import { api } from '@/services/api';

interface AddressRecord {
  id: string;
  customer: string;
  customerId: string;
  type: string;
  address: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

interface AddressesResponse {
  data: AddressRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchAddresses(params: { page: number; limit: number; search?: string }): Promise<AddressesResponse> {
  try {
    const q = new URLSearchParams();
    q.set('page', String(params.page));
    q.set('limit', String(params.limit));
    if (params.search) q.set('search', params.search);
    return await api.get<AddressesResponse>(`/admin/addresses?${q.toString()}`);
  } catch {
    return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}

export default function AddressesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<AddressesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { page: number; limit: number; search?: string } = { page, limit: 10 };
      if (search) params.search = search;
      const res = await fetchAddresses(params);
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
      <h1 className="text-2xl font-bold text-[#222]">Customer Addresses</h1>

      {error && <AdminError message={error} onRetry={fetchData} />}

      <div className="flex items-center gap-2 bg-white border border-[#ddd] rounded-lg px-3 py-2 w-full sm:w-64">
        <span className="material-symbols-outlined text-[#888] text-[20px]">search</span>
        <input type="text" placeholder="Search by customer..."
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-transparent border-none outline-none text-sm flex-1" />
      </div>

      {loading ? <AdminLoading /> : !data || data.data.length === 0 ? (
        <AdminEmpty message="No addresses found" />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Customer</th>
                <th className="p-3">Type</th>
                <th className="p-3">Address</th>
                <th className="p-3">City</th>
                <th className="p-3">Phone</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((a) => (
                <tr key={a.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#333]">{a.customer}</span>
                      {a.isDefault && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Default</span>}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded-full">{a.type}</span>
                  </td>
                  <td className="p-3 text-[#666] max-w-[260px] truncate">{a.address}</td>
                  <td className="p-3 text-[#666]">{a.city}</td>
                  <td className="p-3 text-[#666]">{a.phone}</td>
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
