'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { Pagination } from '@/components/ui/pagination';
import { getErrorMessage } from '@/lib/error-helper';
import { formatBDT, formatDate, ORDER_STATUS_COLORS } from '@/types';
import { api } from '@/services/api';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  createdAt: string;
  members: TeamMember[];
}

interface TeamsResponse {
  data: Team[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function fetchTeams(params: { page: number; limit: number }): Promise<TeamsResponse> {
  try {
    const q = new URLSearchParams();
    q.set('page', String(params.page));
    q.set('limit', String(params.limit));
    return await api.get<TeamsResponse>(`/admin/teams?${q.toString()}`);
  } catch {
    return { data: [], total: 0, page: params.page, limit: params.limit, totalPages: 1 };
  }
}

export default function TeamsPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<TeamsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTeams({ page, limit: 10 });
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '' }); setShowModal(true); };
  const openEdit = (t: Team) => { setEditing(t); setForm({ name: t.name, description: t.description }); setShowModal(true); };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/admin/teams/${editing.id}`, form);
      } else {
        await api.post('/admin/teams', form);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team?')) return;
    try {
      await api.delete(`/admin/teams/${id}`);
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Teams</h1>
        <button onClick={openCreate}
          className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">add</span> Create Team
        </button>
      </div>

      {error && <AdminError message={error} onRetry={fetchData} />}

      {loading ? <AdminLoading /> : !data || data.data.length === 0 ? (
        <AdminEmpty message="No teams found" />
      ) : (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Members</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((t) => (
                <>
                  <tr key={t.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] cursor-pointer"
                    onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
                    <td className="p-3 font-medium text-[#333]">{t.name}</td>
                    <td className="p-3 text-[#666] max-w-[240px] truncate">{t.description}</td>
                    <td className="p-3 text-[#333]">{t.membersCount}</td>
                    <td className="p-3 text-[#888] text-xs">{formatDate(t.createdAt)}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Delete">
                          <span className="material-symbols-outlined text-[18px] text-red-500">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === t.id && (
                    <tr key={`${t.id}-detail`}>
                      <td colSpan={5} className="p-4 bg-[#fafafa] border-b border-[#f0f0f0]">
                        <div className="space-y-3">
                          <p className="font-medium text-[#333] text-sm">Team Members ({t.members.length})</p>
                          {t.members.length === 0 ? (
                            <p className="text-sm text-[#888]">No members in this team.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {t.members.map((m) => (
                                <div key={m.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#eee]">
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold uppercase">
                                    {m.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-[#333]">{m.name}</p>
                                    <p className="text-xs text-[#888]">{m.email} · <span className="text-primary">{m.role}</span></p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} total={data.total} onPageChange={setPage} />
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#222]">{editing ? 'Edit Team' : 'Create Team'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-[#f5f5f5] rounded-lg">
                <span className="material-symbols-outlined text-[#888]">close</span>
              </button>
            </div>
            <input placeholder="Team name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none focus:border-primary min-h-[60px]" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-[#666] border border-[#ddd] rounded-lg hover:bg-[#f5f5f5]">Cancel</button>
              <button onClick={handleSave}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
