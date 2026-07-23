'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAdminData } from '@/lib/api/hooks';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

// Define the Return type locally since we don't have the exact type from @/types/admin
interface Return {
  id: number;
  orderId: string;
  customer: {
    id: number;
    name: string;
    email: string;
    image?: string;
  };
  product: {
    id: number;
    name: string;
    image: string;
  };
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string | Date;
  images: string[];
}

interface ReturnsResponse {
  data: Return[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchReturns(params: { page: number; limit: number; status?: string }): Promise<ReturnsResponse> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', params.page.toString());
    queryParams.append('limit', params.limit.toString());
    if (params.status) {
      queryParams.append('status', params.status);
    }
    const response = await api.get<ReturnsResponse>(`/admin/returns?${queryParams.toString()}`);
    return response;
  } catch (error) {
    return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}

export default function ReturnsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returnsData, setReturnsData] = useState<ReturnsResponse | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const data = await fetchReturns(params);
      setReturnsData(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, statusFilter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusChange = (status: 'all' | 'pending' | 'approved' | 'rejected') => {
    setStatusFilter(status);
    setPage(1); // Reset to first page when changing filter
  };

  const approveReturn = async (id: number) => {
    // In a real app, we would call an API to approve the return
    // For now, we'll just refetch after a short delay to simulate
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Refetch data
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const rejectReturn = async (id: number, reason: string) => {
    // In a real app, we would call an API to reject the return with a reason
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={fetchData} />;
  if (!returnsData || returnsData.data.length === 0) {
    return <AdminEmpty message="No return requests found." />;
  }

  const { data: returns, total, totalPages } = returnsData;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Return Requests</h1>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleStatusChange('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusChange('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${statusFilter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusChange('approved')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${statusFilter === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Approved
          </button>
          <button
            onClick={() => handleStatusChange('rejected')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${statusFilter === 'rejected' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#fafafa]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {returns.map((ret) => (
              <>
                <tr
                  key={ret.id}
                  className={`${expandedRow === ret.id ? 'bg-[#f8f9ff]' : ''} hover:bg-gray-50`}
                  onClick={() => setExpandedRow(expandedRow === ret.id ? null : ret.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">RET-{ret.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">#{ret.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center space-x-2">
                    <Image src={ret.customer.image || '/placeholder.jpg'} alt={ret.customer.name} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                    <span>{ret.customer.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center space-x-2">
                    <Image src={ret.product.image || '/placeholder.jpg'} alt={ret.product.name} width={32} height={32} className="h-8 w-8 rounded object-cover" />
                    <span>{ret.product.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 line-clamp-2">{ret.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${ret.status === 'approved' ? 'bg-green-100 text-green-800' : ret.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {ret.status.charAt(0).toUpperCase() + ret.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(ret.requestedAt instanceof Date ? ret.requestedAt.toISOString() : String(ret.requestedAt))}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                    <button
                      onClick={() => approveReturn(ret.id)}
                      disabled={loading}
                      className={`px-3 py-1 text-xs rounded-md ${ret.status === 'approved' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        // In a real app, we would open a modal for reason input
                        // For now, we'll use a prompt for simplicity
                        const reason = window.prompt('Please provide a reason for rejection:');
                        if (reason) {
                          rejectReturn(ret.id, reason);
                        }
                      }}
                      disabled={loading}
                      className={`px-3 py-1 text-xs rounded-md ${ret.status === 'rejected' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                    >
                      Reject
                    </button>
                  </td>
                </tr>

                {expandedRow === ret.id && (
                  <tr className="bg-[#f8f9ff]">
                    <td colSpan={8} className="px-6 py-4">
                      <div className="space-y-4">
                        <div className="border-t pt-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Return Reason</h3>
                          <p className="text-gray-700">{ret.reason}</p>
                        </div>
                        <div className="border-t pt-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Return Images</h3>
                          <div className="flex flex-wrap gap-3">
                            {ret.images.map((img: string, index: number) => (
                              <img
                                key={index}
                                src={img}
                                alt={`Return image ${index + 1}`}
                                className="h-32 w-32 object-cover rounded border"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing {returns.length} of {total} return requests
        </p>
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}