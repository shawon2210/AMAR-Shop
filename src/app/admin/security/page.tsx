'use client';

import { useState, useEffect } from 'react';
import { AdminLoading, AdminError } from '@/components/ui/admin-states';
import { getErrorMessage } from '@/lib/error-helper';
import { formatDate } from '@/types';
import { api } from '@/services/api';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
  ipWhitelist: { id: string; ip: string; label: string; createdAt: string }[];
  loginAttempts: { id: string; user: string; ip: string; time: string; success: boolean }[];
  passwordPolicy: { minLength: number; expiryDays: number; requireSpecialChar: boolean; requireNumber: boolean };
}

async function fetchSettings(): Promise<SecuritySettings> {
  try {
    return await api.get<SecuritySettings>('/admin/security');
  } catch {
    return { twoFactorEnabled: false, sessionTimeoutMinutes: 30, ipWhitelist: [], loginAttempts: [], passwordPolicy: { minLength: 8, expiryDays: 90, requireSpecialChar: true, requireNumber: true } };
  }
}

const tabs = ['General', 'IP Whitelist', 'Login Attempts', 'Password Policy'] as const;

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<string>('General');
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [ipForm, setIpForm] = useState({ ip: '', label: '' });
  const [pwMinLength, setPwMinLength] = useState(8);
  const [pwExpiry, setPwExpiry] = useState(90);
  const [pwSpecial, setPwSpecial] = useState(true);
  const [pwNumber, setPwNumber] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const s = await fetchSettings();
      setSettings(s);
      setTwoFactor(s.twoFactorEnabled);
      setSessionTimeout(s.sessionTimeoutMinutes);
      setPwMinLength(s.passwordPolicy.minLength);
      setPwExpiry(s.passwordPolicy.expiryDays);
      setPwSpecial(s.passwordPolicy.requireSpecialChar);
      setPwNumber(s.passwordPolicy.requireNumber);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSaveGeneral = async () => {
    try {
      await api.put('/admin/security/general', { twoFactorEnabled: twoFactor, sessionTimeoutMinutes: sessionTimeout });
      alert('General settings saved');
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleAddIP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipForm.ip.trim()) return;
    try {
      await api.post('/admin/security/whitelist', ipForm);
      setSettings((prev) => prev ? {
        ...prev,
        ipWhitelist: [...prev.ipWhitelist, { id: String(Date.now()), ip: ipForm.ip, label: ipForm.label, createdAt: new Date().toISOString() }],
      } : prev);
      setIpForm({ ip: '', label: '' });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleRemoveIP = async (id: string) => {
    try {
      await api.delete(`/admin/security/whitelist/${id}`);
      setSettings((prev) => prev ? { ...prev, ipWhitelist: prev.ipWhitelist.filter((w) => w.id !== id) } : prev);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleSavePasswordPolicy = async () => {
    try {
      await api.put('/admin/security/password-policy', { minLength: pwMinLength, expiryDays: pwExpiry, requireSpecialChar: pwSpecial, requireNumber: pwNumber });
      alert('Password policy saved');
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <div className="space-y-5"><h1 className="text-2xl font-bold text-[#222]">Security</h1><AdminLoading /></div>;
  if (error) return <div className="space-y-5"><h1 className="text-2xl font-bold text-[#222]">Security</h1><AdminError message={error} onRetry={load} /></div>;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Security</h1>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'General' && (
        <div className="bg-white rounded-xl border border-[#eee] p-5 space-y-4">
          <h2 className="text-lg font-semibold text-[#222]">General Settings</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#333]">Two-Factor Authentication</p>
              <p className="text-xs text-[#888]">Require 2FA for all admin accounts</p>
            </div>
            <button onClick={() => setTwoFactor(!twoFactor)}
              className={`relative w-12 h-6 rounded-full transition-colors ${twoFactor ? 'bg-primary' : 'bg-[#ddd]'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div>
            <label className="block text-sm text-[#666] mb-1">Session Timeout (minutes)</label>
            <input type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(Number(e.target.value))}
              className="w-32 border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
          <button onClick={handleSaveGeneral} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">Save</button>
        </div>
      )}

      {activeTab === 'IP Whitelist' && (
        <div className="space-y-4">
          <form onSubmit={handleAddIP} className="bg-white rounded-xl border border-[#eee] p-5">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Add IP Address</h2>
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm text-[#666] mb-1">IP Address</label>
                <input value={ipForm.ip} onChange={(e) => setIpForm((f) => ({ ...f, ip: e.target.value }))}
                  className="w-48 border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="192.168.1.1" required />
              </div>
              <div>
                <label className="block text-sm text-[#666] mb-1">Label</label>
                <input value={ipForm.label} onChange={(e) => setIpForm((f) => ({ ...f, label: e.target.value }))}
                  className="w-48 border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="Office" />
              </div>
              <button type="submit" className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">Add</button>
            </div>
          </form>

          <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Label</th>
                  <th className="p-3">Added</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {settings!.ipWhitelist.map((w) => (
                  <tr key={w.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-mono text-sm text-[#333]">{w.ip}</td>
                    <td className="p-3 text-[#666]">{w.label || '—'}</td>
                    <td className="p-3 text-[#888] text-xs">{formatDate(w.createdAt)}</td>
                    <td className="p-3">
                      <button onClick={() => handleRemoveIP(w.id)} className="p-1.5 rounded-lg hover:bg-red-50" title="Remove">
                        <span className="material-symbols-outlined text-[18px] text-red-500">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Login Attempts' && (
        <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">User</th>
                <th className="p-3">IP</th>
                <th className="p-3">Time</th>
                <th className="p-3">Result</th>
              </tr>
            </thead>
            <tbody>
              {settings!.loginAttempts.map((a) => (
                <tr key={a.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 text-[#666]">{a.user}</td>
                  <td className="p-3 font-mono text-xs text-[#888]">{a.ip}</td>
                  <td className="p-3 text-[#888] text-xs whitespace-nowrap">{formatDate(a.time)} {new Date(a.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${a.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.success ? 'Success' : 'Failed'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Password Policy' && (
        <div className="bg-white rounded-xl border border-[#eee] p-5 space-y-4">
          <h2 className="text-lg font-semibold text-[#222]">Password Policy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Minimum Length</label>
              <input type="number" value={pwMinLength} onChange={(e) => setPwMinLength(Number(e.target.value))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Password Expiry (days)</label>
              <input type="number" value={pwExpiry} onChange={(e) => setPwExpiry(Number(e.target.value))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pw-special" checked={pwSpecial} onChange={(e) => setPwSpecial(e.target.checked)}
                className="rounded border-[#ddd]" />
              <label htmlFor="pw-special" className="text-sm text-[#666]">Require special character</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="pw-number" checked={pwNumber} onChange={(e) => setPwNumber(e.target.checked)}
                className="rounded border-[#ddd]" />
              <label htmlFor="pw-number" className="text-sm text-[#666]">Require number</label>
            </div>
          </div>
          <button onClick={handleSavePasswordPolicy} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">Save Policy</button>
        </div>
      )}
    </div>
  );
}
