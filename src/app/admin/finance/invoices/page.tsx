'use client';

import { useState } from 'react';
import { useAdminData } from '@/lib/api/hooks';
import { fetchInvoices, updateInvoice } from '@/lib/api/admin';

function formatBDT(v: number): string {
  return `৳${Math.round(v).toLocaleString('en-IN')}`;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const statusStyles: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  SENT: 'bg-blue-100 text-blue-700',
  DRAFT: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function InvoicesPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useAdminData(
    () => fetchInvoices({ page, limit: 20 }),
    [page],
  );

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateInvoice(id, { status });
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to update invoice');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Invoices</h1>
        <a href="/admin/finance" className="flex items-center gap-1.5 px-3 py-2 border border-[#ddd] text-[#666] rounded-lg text-sm font-medium hover:bg-[#f5f5f5]">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Finance
        </a>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-[#eee] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#eee] bg-[#fafafa]">
              <th className="text-left py-3 px-4 text-[#888] font-medium">Invoice #</th>
              <th className="text-left py-3 px-4 text-[#888] font-medium">Order</th>
              <th className="text-left py-3 px-4 text-[#888] font-medium">Seller</th>
              <th className="text-right py-3 px-4 text-[#888] font-medium">Amount</th>
              <th className="text-left py-3 px-4 text-[#888] font-medium">Status</th>
              <th className="text-left py-3 px-4 text-[#888] font-medium">Date</th>
              <th className="text-left py-3 px-4 text-[#888] font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-[#888]">
                <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
              </td></tr>
            ) : !data || data.invoices.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-[#888]">No invoices found</td></tr>
            ) : (
              data.invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[#eee]/50 hover:bg-[#fafafa]">
                  <td className="py-3 px-4 font-medium text-[#333]">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4 text-[#666]">#{inv.order?.orderNumber || inv.orderId.slice(-6)}</td>
                  <td className="py-3 px-4 text-[#555]">{inv.seller?.name || 'N/A'}</td>
                  <td className="py-3 px-4 text-right font-semibold">{formatBDT(inv.total)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[inv.status] || 'bg-gray-100 text-gray-700'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#888]">{formatDate(inv.createdAt)}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {inv.status === 'DRAFT' && (
                        <button onClick={() => handleStatusChange(inv.id, 'SENT')} className="text-xs bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600">Send</button>
                      )}
                      {inv.status === 'SENT' && (
                        <button onClick={() => handleStatusChange(inv.id, 'PAID')} className="text-xs bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">Mark Paid</button>
                      )}
                    </div>
                  </td>
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
