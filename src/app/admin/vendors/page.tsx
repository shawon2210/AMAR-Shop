'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface Vendor {
  id: string;
  storeName: string;
  owner: string;
  phone: string;
  email: string;
  productsCount: number;
  totalRevenue: number;
  isActive: boolean;
  createdAt: string;
}

interface VendorsResponse {
  vendors: Vendor[];
  total: number;
  page: number;
  totalPages: number;
}

async function fetchVendors(page: number, limit: number, search: string): Promise<VendorsResponse> {
  try {
    return await api.get<VendorsResponse>(`/admin/vendors?page=${page}&limit=${limit}&search=${search}`);
  } catch {
    return { vendors: [], total: 0, page, totalPages: 0 };
  }
}

export default function VendorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<VendorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (p: number, s: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchVendors(p, 20, s);
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page, search); }, [page, search]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
    load(1, val);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-[#222]">Vendors</h1>
        <div className="relative flex-1 max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#888] text-[18px]">search</span>
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search vendors..."
            className="w-full border border-[#ddd] rounded-lg pl-9 pr-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      {error && <AdminError message={error} onRetry={() => load(page, search)} />}

      {loading ? (
        <AdminLoading />
      ) : !data || data.vendors.length === 0 ? (
        <AdminEmpty message="No vendors found" icon="store" />
      ) : (
        <>
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">ID</th>
                  <th className="p-3">Store Name</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Products</th>
                  <th className="p-3">Revenue</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.vendors.map((v) => (
                  <tr key={v.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 text-xs font-mono text-[#888]">{v.id}</td>
                    <td className="p-3 font-medium text-[#333] whitespace-nowrap">{v.storeName}</td>
                    <td className="p-3 text-[#555] whitespace-nowrap">{v.owner}</td>
                    <td className="p-3 text-[#666]">{v.phone}</td>
                    <td className="p-3 text-[#666]">{v.productsCount.toLocaleString()}</td>
                    <td className="p-3 font-medium">{formatBDT(v.totalRevenue)}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {v.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-[#888]">{formatDate(v.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3">
            {data.vendors.map((v) => (
              <div key={v.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#333] text-sm">{v.storeName}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {v.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-[#555]">{v.owner}</p>
                <div className="flex items-center justify-between text-xs text-[#888]">
                  <span>{v.productsCount} products</span>
                  <span className="font-medium text-[#333]">{formatBDT(v.totalRevenue)}</span>
                </div>
                <p className="text-[10px] text-[#999]">ID: {v.id} · {formatDate(v.createdAt)}</p>
              </div>
            ))}
          </div>

          {data && <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={(p) => { setPage(p); load(p, search); }} />}
        </>
      )}
    </div>
  );
}
