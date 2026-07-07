'use client';

import { useState } from 'react';
import { useAdminPage } from '@/lib/api/hooks';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/lib/api/admin';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import type { AdminCoupon } from '@/types';
import { getErrorMessage } from '@/lib/error-helper';

const tabs = ['Active', 'Upcoming', 'Expired'] as const;

function getStatus(c: AdminCoupon): string {
  const now = new Date();
  if (c.expiresAt && new Date(c.expiresAt) < now) return 'Expired';
  if (c.startsAt && new Date(c.startsAt) > now) return 'Upcoming';
  if (!c.isActive) return 'Inactive';
  return 'Active';
}

function formatDate(d: string | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatBDT(v: number): string {
  return `৳${v.toLocaleString('en-IN')}`;
}

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    code: '', type: 'PERCENTAGE', value: '', minPurchase: '', maxUses: '', maxPerUser: '1',
    startsAt: '', expiresAt: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, error, refetch, page, setPage } = useAdminPage(
    ({ page, limit }) => fetchCoupons({ page, limit }),
    [],
  );

  const filtered = !data ? [] : activeTab === 'All'
    ? data.coupons
    : data.coupons.filter((c) => getStatus(c) === activeTab);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) return;
    setSubmitting(true);
    try {
      await createCoupon({
        code: form.code,
        type: form.type,
        value: form.value,
        minPurchase: form.minPurchase || '0',
        maxUses: form.maxUses || null,
        maxPerUser: form.maxPerUser || '1',
        startsAt: form.startsAt || undefined,
        expiresAt: form.expiresAt || undefined,
      });
      setShowCreate(false);
      setForm({ code: '', type: 'PERCENTAGE', value: '', minPurchase: '', maxUses: '', maxPerUser: '1', startsAt: '', expiresAt: '' });
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to create coupon'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (c: AdminCoupon) => {
    try {
      await updateCoupon(c.id, { isActive: !c.isActive });
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to update coupon'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await deleteCoupon(id);
      refetch();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete coupon'));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Coupons</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Create Coupon</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[{ label: 'All', value: 'All' }, ...tabs.map((t) => ({ label: t, value: t }))].map((tab) => (
          <button key={tab.value} onClick={() => setActiveTab(tab.value)}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${activeTab === tab.value ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {error && <AdminError message={error} onRetry={refetch} />}

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Create Coupon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Code *</label>
              <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none uppercase" placeholder="e.g. SAVE50" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Value *</label>
              <input value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="50" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Min Purchase</label>
              <input value={form.minPurchase} onChange={(e) => setForm((f) => ({ ...f, minPurchase: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="500" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="1000" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Max Per User</label>
              <input type="number" value={form.maxPerUser} onChange={(e) => setForm((f) => ({ ...f, maxPerUser: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="1" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Start Date</label>
              <input type="date" value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">End Date</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <AdminLoading />
      ) : filtered.length === 0 ? (
        <AdminEmpty message="No coupons found" />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Code</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Min Purchase</th>
                  <th className="p-3">Uses</th>
                  <th className="p-3">Expiry</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const status = getStatus(c);
                  const usagePct = c.maxUses ? Math.min(100, ((c as AdminCoupon & { usedCount?: number }).usedCount || 0) / c.maxUses * 100) : 0;
                  return (
                    <tr key={c.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                      <td className="p-3 font-mono font-bold text-[#333]">{c.code}</td>
                      <td className="p-3 text-[#666]">{c.type}</td>
                      <td className="p-3 font-medium">{c.type === 'PERCENTAGE' ? `${c.value}%` : formatBDT(c.value)}</td>
                      <td className="p-3 text-[#666]">{c.minPurchase > 0 ? formatBDT(c.minPurchase) : '—'}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span>{(c as AdminCoupon & { usedCount?: number }).usedCount || 0}/{c.maxUses || '∞'}</span>
                          {c.maxUses && (
                            <div className="w-16 h-1.5 bg-[#eee] rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${usagePct}%` }} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-[#888] text-xs">{formatDate(c.expiresAt)}</td>
                      <td className="p-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          status === 'Active' ? 'bg-green-100 text-green-700' :
                          status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>{status}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button onClick={() => handleToggleActive(c)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title={c.isActive ? 'Deactivate' : 'Activate'}>
                            <span className="material-symbols-outlined text-[18px] text-[#666]">{c.isActive ? 'toggle_on' : 'toggle_off'}</span>
                          </button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
                            <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {filtered.map((c) => {
              const status = getStatus(c);
              return (
                <div key={c.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-[#333]">{c.code}</span>
                    <div className="flex gap-1">
                      <button onClick={() => handleToggleActive(c)} className="p-1 rounded-lg hover:bg-[#f5f5f5]">
                        <span className="material-symbols-outlined text-[18px] text-[#666]">{c.isActive ? 'toggle_on' : 'toggle_off'}</span>
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-1 rounded-lg hover:bg-[#f5f5f5]">
                        <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#666]">{c.type} · {c.type === 'PERCENTAGE' ? `${c.value}%` : formatBDT(c.value)}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      status === 'Active' ? 'bg-green-100 text-green-700' :
                      status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>{status}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#999]">
                    <span>{(c as AdminCoupon & { usedCount?: number }).usedCount || 0}/{c.maxUses || '∞'} uses · Min: {c.minPurchase > 0 ? formatBDT(c.minPurchase) : '—'}</span>
                    <span>{formatDate(c.expiresAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
