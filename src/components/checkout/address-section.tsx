'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import type { Address } from '@/types';

export function AddressSection({
  selectedAddress,
  onSelect,
}: {
  selectedAddress: string;
  onSelect: (id: string) => void;
}) {
  const addToast = useUIStore((s) => s.addToast);
  const token = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthHydrated();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    label: '',
    fullName: '',
    phone: '',
    street: '',
    city: 'Dhaka',
    area: '',
  });

  const loadLocal = (): Address[] => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('amarshop-addresses') || '[]'); } catch { return []; }
  };
  const saveLocal = (list: Address[]) => {
    try { localStorage.setItem('amarshop-addresses', JSON.stringify(list)); } catch {}
  };

  useEffect(() => {
    if (!hydrated || !token) {
      const local = loadLocal();
      setAddresses(local);
      if (local.length > 0 && !selectedAddress) onSelect(local[0].id);
      setLoading(false);
      return;
    }
    api.get<Address[]>('/addresses')
      .then((data) => {
        setAddresses(data);
        if (data.length > 0 && !selectedAddress) onSelect(data[0].id);
      })
      .catch(() => {
        const local = loadLocal();
        setAddresses(local);
        if (local.length > 0 && !selectedAddress) onSelect(local[0].id);
      })
      .finally(() => setLoading(false));
  }, [hydrated, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!form.fullName || !form.phone || !form.street || !form.area) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    setSaving(true);
    try {
      const addr = await api.post<Address>('/addresses', {
        label: form.label || 'Home',
        fullName: form.fullName,
        phone: form.phone,
        street: form.street,
        city: form.city,
        area: form.area,
      });
      setAddresses((prev) => [...prev, addr]);
      onSelect(addr.id);
      reset();
      addToast('Address added successfully', 'success');
    } catch {
      const addr: Address = {
        id: 'addr-' + Date.now(),
        label: form.label || 'Home',
        fullName: form.fullName,
        phone: form.phone,
        street: form.street,
        city: form.city,
        area: form.area,
        isDefault: false,
      };
      const updated = [...loadLocal(), addr];
      saveLocal(updated);
      setAddresses(updated);
      onSelect(addr.id);
      reset();
      addToast('Address added successfully', 'success');
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setShowForm(false);
    setForm({ label: '', fullName: '', phone: '', street: '', city: 'Dhaka', area: '' });
  };

  const inputClass = 'w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary text-sm';

  return (
    <section className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl">location_on</span>
          <h2 className="font-semibold text-slate-900 dark:text-white">Shipping Address</h2>
        </div>
        {!showForm && addresses.length > 0 && (
          <button onClick={() => setShowForm(true)} className="text-primary font-semibold text-sm hover:underline">
            + Add New
          </button>
        )}
      </div>
      <div className="p-5 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <span className="material-symbols-outlined animate-spin text-slate-400">progress_activity</span>
          </div>
        ) : showForm || addresses.length === 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} className={inputClass} placeholder="Full Name *" disabled={saving} />
              <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} placeholder="Phone Number *" disabled={saving} />
            </div>
            <input type="text" value={form.street} onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))} className={inputClass} placeholder="Street / Area *" disabled={saving} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} className={inputClass} placeholder="Area / Thana *" disabled={saving} />
              <input type="text" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className={inputClass} placeholder="City" disabled={saving} />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-primary text-white font-semibold text-sm rounded-xl hover:brightness-110 transition-all disabled:opacity-70">
                {saving ? 'Saving...' : 'Save Address'}
              </button>
              {addresses.length > 0 && (
                <button onClick={reset} className="py-3 px-6 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          addresses.map((addr) => (
            <label
              key={addr.id}
              className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedAddress === addr.id ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
              }`}
            >
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddress === addr.id}
                onChange={() => onSelect(addr.id)}
                className="mt-1 w-4 h-4 text-primary"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{addr.fullName}</span>
                  {addr.label && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">{addr.label}</span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{addr.street}, {addr.area}, {addr.city}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">{addr.phone}</p>
              </div>
            </label>
          ))
        )}
      </div>
    </section>
  );
}
