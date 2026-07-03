'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/services/api';
import { AuthGuard } from '@/components/auth/auth-guard';

interface Address {
  id: string;
  label: string | null;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  area: string | null;
  isDefault: boolean;
}

export default function AddressesPage() {
  const token = useAuthStore(s => s.accessToken);
  const addToast = useUIStore(s => s.addToast);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    label: '', fullName: '', phone: '', street: '', city: 'Dhaka', area: '',
  });

  function loadLocalAddresses(): Address[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('amarshop-addresses') || '[]'); } catch { return []; }
  }

  function saveLocalAddresses(list: Address[]) {
    try { localStorage.setItem('amarshop-addresses', JSON.stringify(list)); } catch {}
  }

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.get<Address[]>('/addresses')
      .then(setAddresses)
      .catch(() => {
        const local = loadLocalAddresses();
        if (local.length > 0) { setAddresses(local); }
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [token, addToast]);

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
      setAddresses(prev => [...prev, addr]);
      setShowForm(false);
      setForm({ label: '', fullName: '', phone: '', street: '', city: 'Dhaka', area: '' });
      addToast('Address added successfully', 'success');
    } catch {
      const local: Address = {
        id: 'addr-' + Date.now(),
        label: form.label || 'Home',
        fullName: form.fullName,
        phone: form.phone,
        street: form.street,
        city: form.city,
        area: form.area,
        isDefault: false,
      };
      const updated = [...loadLocalAddresses(), local];
      saveLocalAddresses(updated);
      setAddresses(updated);
      setShowForm(false);
      setForm({ label: '', fullName: '', phone: '', street: '', city: 'Dhaka', area: '' });
      addToast('Address added successfully', 'success');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard>
      <div className="px-container-margin pt-md pb-24 space-y-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/account" className="text-secondary hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="font-headline-md text-headline-md">My Addresses</h1>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="text-primary font-label-bold text-sm flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add New
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="material-symbols-outlined animate-spin text-3xl text-secondary">progress_activity</span>
          </div>
        ) : showForm ? (
          <div className="bg-surface-container-lowest rounded-xl p-md space-y-3 shadow-sm">
            <h2 className="font-title-sm text-title-sm">New Address</h2>
            <input
              type="text" value={form.fullName}
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
              className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="Full Name *" disabled={saving}
            />
            <input
              type="tel" value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="Phone Number *" disabled={saving}
            />
            <input
              type="text" value={form.street}
              onChange={e => setForm(p => ({ ...p, street: e.target.value }))}
              className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="Street / Area *" disabled={saving}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text" value={form.area}
                onChange={e => setForm(p => ({ ...p, area: e.target.value }))}
                className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="Area / Thana *" disabled={saving}
              />
              <input
                type="text" value={form.city}
                onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="City" disabled={saving}
              />
            </div>
            <input
              type="text" value={form.label}
              onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
              className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
              placeholder="Label (e.g. Home, Office)" disabled={saving}
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-primary text-on-primary font-label-bold text-sm rounded-lg hover:brightness-110 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                ) : 'Save Address'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="py-2.5 px-4 border border-outline rounded-lg text-sm text-secondary hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-secondary mb-3">location_off</span>
            <p className="text-secondary">No saved addresses yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-primary font-label-bold text-sm"
            >
              Add your first address
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-surface-container-lowest rounded-xl p-md shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">location_on</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-label-bold">{addr.fullName}</span>
                        {addr.label && (
                          <span className="text-xs bg-surface-container px-1.5 py-0.5 rounded">{addr.label}</span>
                        )}
                        {addr.isDefault && (
                          <span className="text-xs bg-primary-fixed text-primary px-1.5 py-0.5 rounded">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-secondary mt-0.5">{addr.street}, {addr.area && `${addr.area}, `}{addr.city}</p>
                      <p className="text-sm text-secondary">{addr.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
