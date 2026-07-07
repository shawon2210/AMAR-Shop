'use client';

import { useState } from 'react';
import { useAdminPage } from '@/lib/api/hooks';
import { fetchOrders, updateOrderStatus, addOrderNote } from '@/lib/api/admin';
import type { AdminOrder, OrderItem } from '@/types';
import { ORDER_STATUS_COLORS, formatBDT, formatDate } from '@/types';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';

const tabs = ['All', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [detailOrder, setDetailOrder] = useState<AdminOrder | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');

  const { data, loading, error, refetch, page, setPage } = useAdminPage(
    ({ page, limit }) =>
      fetchOrders({
        page,
        limit,
        status: activeTab !== 'All' ? activeTab : undefined,
      }),
    [activeTab],
  );

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setStatusUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      refetch();
      if (detailOrder?.id === orderId) {
        setDetailOrder((prev) => prev ? { ...prev, status: newStatus } : prev);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update order status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleAddNote = async (orderId: string) => {
    if (!newNote.trim()) return;
    try {
      await addOrderNote(orderId, newNote.trim());
      setNewNote('');
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add note');
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Orders</h1>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'
            }`}
          >
            {tab === 'All' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {error && <AdminError message={error} onRetry={refetch} />}

      {loading ? (
        <AdminLoading />
      ) : !data || data.orders.length === 0 ? (
        <AdminEmpty message="No orders found" />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((o: AdminOrder) => (
                  <tr key={o.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">#{o.orderNumber || o.id.slice(-6)}</td>
                    <td className="p-3 text-[#555]">{o.user?.name || 'N/A'}</td>
                    <td className="p-3 font-medium">{formatBDT(o.total)}</td>
                    <td className="p-3 text-[#666]">{o.items?.length || 0}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-[#888]">{formatDate(o.createdAt)}</td>
                    <td className="p-3">
                      <button onClick={() => setDetailOrder(o)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="View Details">
                        <span className="material-symbols-outlined text-[18px] text-[#666]">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {data.orders.map((o: AdminOrder) => (
              <div key={o.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-[#333]">#{o.orderNumber || o.id.slice(-6)}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>
                    {o.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#666]">
                  <span>{o.user?.name || 'N/A'} · {o.items?.length || 0} items</span>
                  <span className="font-semibold text-[#333]">{formatBDT(o.total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#999]">{formatDate(o.createdAt)}</span>
                  <button onClick={() => setDetailOrder(o)} className="text-xs text-primary font-medium">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#888]">
            Page {page} of {data.totalPages} ({data.total} total)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-white border border-[#ddd] rounded-lg disabled:opacity-50 hover:bg-[#f5f5f5]"
            >
              Previous
            </button>
            <button
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 bg-white border border-[#ddd] rounded-lg disabled:opacity-50 hover:bg-[#f5f5f5]"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#eee] flex items-center justify-between">
              <h3 className="text-lg font-semibold">Order #{detailOrder.orderNumber || detailOrder.id.slice(-6)}</h3>
              <button onClick={() => setDetailOrder(null)}>
                <span className="material-symbols-outlined text-[#888]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#888] text-xs mb-1">Customer</p>
                  <p className="font-medium">{detailOrder.user?.name || 'N/A'}</p>
                  <p className="text-[#666]">{detailOrder.user?.phone || ''}</p>
                </div>
                <div>
                  <p className="text-[#888] text-xs mb-1">Status</p>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[detailOrder.status] || 'bg-gray-100 text-gray-700'}`}>
                    {detailOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-[#888] text-xs mb-1">Total</p>
                  <p className="font-semibold text-lg">{formatBDT(detailOrder.total)}</p>
                </div>
                <div>
                  <p className="text-[#888] text-xs mb-1">Date</p>
                  <p className="text-[#444]">{formatDate(detailOrder.createdAt)}</p>
                </div>
              </div>

              {detailOrder.note && (
                <div>
                  <p className="text-[#888] text-xs mb-1">Order Note</p>
                  <p className="text-[#444] bg-[#fafafa] rounded-lg p-3 whitespace-pre-wrap">{detailOrder.note}</p>
                </div>
              )}

              <div>
                <p className="text-[#888] text-xs mb-2">Items ({detailOrder.items?.length || 0})</p>
                <div className="space-y-2">
                  {(detailOrder.items || []).map((item: OrderItem) => (
                    <div key={item.id} className="flex items-center justify-between bg-[#fafafa] rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f0f0f0] flex items-center justify-center overflow-hidden">
                          {item.product?.images?.[0] ? (
                            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-[#888]">inventory_2</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#333]">{item.product?.name || 'Product'}</p>
                          <p className="text-[#888] text-xs">Qty: {item.quantity} × {formatBDT(item.price)}</p>
                        </div>
                      </div>
                      <span className="font-semibold">{formatBDT(item.quantity * item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#eee] pt-4 space-y-3">
                <p className="text-sm font-medium text-[#333]">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                    <button
                      key={s}
                      disabled={statusUpdating === detailOrder.id}
                      onClick={() => handleStatusChange(detailOrder.id, s)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                        detailOrder.status === s
                          ? 'bg-primary text-white'
                          : 'bg-white border border-[#ddd] text-[#666] hover:bg-[#f5f5f5]'
                      } disabled:opacity-50`}
                    >
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(detailOrder.id); }}
                  />
                  <button
                    onClick={() => handleAddNote(detailOrder.id)}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:brightness-110"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
