'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function SettingsPage() {
  const user = useAuthStore(s => s.user);
  const addToast = useUIStore(s => s.addToast);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    addToast('Settings saved', 'success');
  };

  return (
    <AuthGuard>
      <div className="app-container py-6 pb-24 space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/account" className="text-secondary hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 space-y-4 shadow-sm">
          <div>
            <label className="text-sm text-secondary block mb-1">Name</label>
            <input
              type="text" value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-secondary block mb-1">Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-secondary block mb-1">Phone</label>
            <input
              type="tel" value={user?.phone || ''} disabled
              className="w-full px-3 py-2 border border-outline rounded-lg bg-surface-container text-sm text-secondary cursor-not-allowed"
            />
            <p className="text-xs text-secondary mt-1">Phone cannot be changed</p>
          </div>
          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:brightness-110 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
