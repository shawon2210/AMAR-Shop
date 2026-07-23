'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export default function EditAccountPage() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const setUser = useAuthStore(s => s.setUser);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login?redirect=/account/edit');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSave = async () => {
    setError('');
    setSuccess(false);
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    try {
      // try API first, fallback to local store
      const { api } = await import('@/services/api');
      const updated = await api.put<typeof user>('/auth/profile', { name, email, phone });
      setUser(updated);
    } catch {
      setUser({ ...user, name: name.trim(), email: email.trim(), phone: phone.trim() });
    } finally {
      setSaving(false);
      setSuccess(true);
    }
  };

  return (
    <div className="app-container py-6 space-y-6 pb-24">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-secondary hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back
      </button>

      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-4">
        <h2 className="font-title-sm text-title-sm">Edit Profile</h2>

        {error && (
          <div className="p-3 bg-error-container text-error rounded-lg text-sm flex items-start gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-success-container text-success rounded-lg text-sm flex items-start gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>Profile updated successfully</span>
          </div>
        )}

        <div>
          <label className="text-sm font-semibold block mb-1.5">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2.5 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1.5">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:brightness-110 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2.5 border border-outline rounded-lg text-sm hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
