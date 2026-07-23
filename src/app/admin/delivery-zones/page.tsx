'use client';

import { useState } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate } from '@/types';
import { api } from '@/services/api';

interface DeliveryZone {
  id: string;
  name: string;
  cities: string[];
  methodsCount: number;
  isActive: boolean;
  createdAt: string;
}

interface ZoneResponse {
  zones: DeliveryZone[];
  total: number;
  page: number;
  totalPages: number;
}

const defaultForm = { name: '', cities: '' };

async function fetchZones(page: number, limit: number): Promise<ZoneResponse> {
  try {
    return await api.get<ZoneResponse>(`/admin/delivery-zones?page=${page}&limit=${limit}`);
  } catch {
    const mock: DeliveryZone[] = [
      { id: 'z1', name: 'Dhaka City', cities: ['Dhaka', 'Mirpur', 'Uttara', 'Banani', 'Gulshan'], methodsCount: 3, isActive: true, createdAt: '2024-01-01T10:00:00Z' },
      { id: 'z2', name: 'Chittagong', cities: ['Chittagong City', 'Nasirabad', 'Agrabad'], methodsCount: 2, isActive: true, createdAt: '2024-01-02T10:00:00Z' },
      { id: 'z3', name: 'Sylhet', cities: ['Sylhet City', 'Zindabazar', 'Shahjalal'], methodsCount: 2, isActive: true, createdAt: '2024-01-03T10:00:00Z' },
      { id: 'z4', name: 'Rajshahi', cities: ['Rajshahi City', 'Shaheb Bazar'], methodsCount: 1, isActive: true, createdAt: '2024-01-04T10:00:00Z' },
      { id: 'z5', name: 'Khulna', cities: ['Khulna City', 'Sonadanga'], methodsCount: 2, isActive: false, createdAt: '2024-01-05T10:00:00Z' },
    ];
    const start = (page - 1) * limit;
    return { zones: mock.slice(start, start + limit), total: mock.length, page, totalPages: Math.ceil(mock.length / limit) };
  }
}

export default function DeliveryZonesPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ZoneResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchZones(p, 20);
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useState(() => { load(page); });

  const resetForm = () => { setForm(defaultForm); setEditId(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const payload = { name: form.name, cities: form.cities.split(',').map((c) => c.trim()).filter(Boolean) };
      if (editId) {
        await api.put(`/admin/delivery-zones/${editId}`, payload);
      } else {
        await api.post('/admin/delivery-zones', payload);
      }
      resetForm();
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to save delivery zone'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (z: DeliveryZone) => {
    setEditId(z.id);
    setForm({ name: z.name, cities: z.cities.join(', ') });
    setShowForm(true);
  };

  const handleToggle = async (z: DeliveryZone) => {
    try {
      await api.patch(`/admin/delivery-zones/${z.id}`, { isActive: !z.isActive });
      load(page);
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to toggle zone'));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Delivery Zones</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Add Zone</button>
      </div>

      {error && <AdminError message={error} onRetry={() => load(page)} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{editId ? 'Edit Delivery Zone' : 'Add Delivery Zone'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Zone Name *</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="e.g. Dhaka City" required />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Cities (comma separated)</label>
              <input value={form.cities} onChange={(e) => setForm((f) => ({ ...f, cities: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="Dhaka, Mirpur, Uttara" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              {submitting ? 'Saving...' : editId ? 'Update Zone' : 'Add Zone'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <AdminLoading />
      ) : !data || data.zones.length === 0 ? (
        <AdminEmpty message="No delivery zones found" icon="map" />
      ) : (
        <>
          <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">Name</th>
                  <th className="p-3">Cities</th>
                  <th className="p-3">Methods</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.zones.map((z) => (
                  <>
                    <tr key={z.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                      <td className="p-3">
                        <button onClick={() => setExpandedId(expandedId === z.id ? null : z.id)} className="flex items-center gap-1 font-medium text-[#333]">
                          <span className="material-symbols-outlined text-[16px] text-[#888]">{expandedId === z.id ? 'expand_more' : 'chevron_right'}</span>
                          {z.name}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1 flex-wrap">
                          {z.cities.slice(0, 3).map((city) => (
                            <span key={city} className="text-[11px] bg-[#f0f0f0] text-[#666] px-2 py-0.5 rounded-full">{city}</span>
                          ))}
                          {z.cities.length > 3 && <span className="text-[11px] text-[#888]">+{z.cities.length - 3}</span>}
                        </div>
                      </td>
                      <td className="p-3 text-[#666]">{z.methodsCount}</td>
                      <td className="p-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${z.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {z.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button onClick={() => handleToggle(z)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Toggle">
                            <span className="material-symbols-outlined text-[18px] text-[#666]">{z.isActive ? 'toggle_on' : 'toggle_off'}</span>
                          </button>
                          <button onClick={() => handleEdit(z)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                            <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === z.id && (
                      <tr key={`${z.id}-expanded`}>
                        <td colSpan={5} className="p-3 bg-[#fafafa]">
                          <div className="flex flex-wrap gap-2">
                            {z.cities.map((city) => (
                              <span key={city} className="text-xs bg-white border border-[#eee] px-3 py-1 rounded-lg">{city}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3">
            {data.zones.map((z) => (
              <div key={z.id} className="bg-white rounded-xl border border-[#eee] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#333] text-sm">{z.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${z.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {z.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {z.cities.map((city) => (
                    <span key={city} className="text-[10px] bg-[#f0f0f0] text-[#666] px-2 py-0.5 rounded-full">{city}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-[#888]">
                  <span>{z.methodsCount} shipping methods</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => handleToggle(z)} className="flex-1 text-xs py-1.5 rounded-lg border border-[#ddd] hover:bg-[#f5f5f5]">{z.isActive ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => handleEdit(z)} className="flex-1 text-xs py-1.5 rounded-lg border border-[#ddd] hover:bg-[#f5f5f5]">Edit</button>
                </div>
              </div>
            ))}
          </div>

          {data && <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={(p) => { setPage(p); load(p); }} />}
        </>
      )}
    </div>
  );
}
