'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/services/api';
import { AuthGuard } from '@/components/auth/auth-guard';

interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function SettingsPage() {
  const user = useAuthStore(s => s.user);
  const refreshToken = useAuthStore(s => s.refreshToken);
  const addToast = useUIStore(s => s.addToast);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const params = refreshToken ? `?currentToken=${encodeURIComponent(refreshToken)}` : '';
      const data = await api.get<Session[]>(`/auth/sessions${params}`);
      setSessions(data);
    } catch {
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  }, [refreshToken]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleSave = async () => {
    if (!name.trim()) {
      addToast('Name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/profile', { name: name.trim(), email: email.trim() });
      addToast('Settings saved', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    setRevoking(sessionId);
    try {
      await api.post(`/auth/sessions/${sessionId}/revoke`);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      addToast('Session revoked', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to revoke session', 'error');
    } finally {
      setRevoking(null);
    }
  };

  const handleRevokeAllExcept = async () => {
    setRevokingAll(true);
    try {
      await api.post('/auth/logout-all-except', { refreshToken });
      setSessions(prev => prev.filter(s => !s.isCurrent));
      addToast('Logged out from all other devices', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to logout other devices', 'error');
    } finally {
      setRevokingAll(false);
    }
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
            disabled={saving}
            className="w-full py-2.5 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:brightness-110 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
          <h2 className="text-base font-bold mb-3">Active Sessions</h2>
          {sessionsLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-secondary">No active sessions</p>
          ) : (
            <div className="space-y-2">
              {sessions.map(s => (
                <div key={s.id} className="flex items-center justify-between gap-2 py-2.5 px-3 rounded-lg hover:bg-black/[0.02] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-secondary">devices</span>
                      <span className="text-sm truncate">{formatDate(s.createdAt)}</span>
                      {s.isCurrent && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-semibold">Current</span>
                      )}
                    </div>
                    <p className="text-xs text-secondary mt-0.5">Expires {formatDate(s.expiresAt)}</p>
                  </div>
                  {!s.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(s.id)}
                      disabled={revoking === s.id}
                      className="text-xs text-red-600 font-semibold px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 shrink-0"
                    >
                      {revoking === s.id ? 'Revoking...' : 'Log out'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {sessions.length > 1 && (
            <button
              onClick={handleRevokeAllExcept}
              disabled={revokingAll}
              className="w-full mt-3 py-2 text-sm text-red-600 font-semibold rounded-lg border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {revokingAll ? 'Logging out...' : 'Log out of all other devices'}
            </button>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
