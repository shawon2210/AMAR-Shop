'use client';

import { useState } from 'react';
import { updateSettings } from '@/lib/api/admin';

type SettingsTab = 'general' | 'commission' | 'shipping' | 'payment' | 'email' | 'seo' | 'security';

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('general');
  const [commissionRate, setCommissionRate] = useState('5');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveCommission = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateSettings({ commissionRate: parseFloat(commissionRate) });
      setMessage({ type: 'success', text: 'Commission rate updated successfully.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update settings' });
    } finally {
      setSaving(false);
    }
  };

  const tabs: { key: SettingsTab; label: string; icon: string }[] = [
    { key: 'general', label: 'General', icon: 'settings' },
    { key: 'commission', label: 'Commission', icon: 'percent' },
    { key: 'shipping', label: 'Shipping', icon: 'local_shipping' },
    { key: 'payment', label: 'Payment', icon: 'payments' },
    { key: 'email', label: 'Email', icon: 'mail' },
    { key: 'seo', label: 'SEO', icon: 'search' },
    { key: 'security', label: 'Security', icon: 'shield' },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#222]">Settings</h1>

      {message && (
        <div className={`rounded-lg p-3 text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${
              tab === t.key ? 'bg-primary text-white' : 'bg-white text-[#666] border border-[#ddd] hover:bg-[#f5f5f5]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#eee] p-6">
        {tab === 'general' && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-semibold text-[#222] mb-4">General Settings</h2>
            <div>
              <label className="block text-sm text-[#666] mb-1">Site Name</label>
              <input type="text" defaultValue="AmarShop" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Site Description</label>
              <textarea rows={3} defaultValue="Bangladesh's Premium Online Marketplace" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#666] mb-1">Currency</label>
                <select defaultValue="BDT" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none bg-white">
                  <option value="BDT">BDT (৳)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#666] mb-1">Timezone</label>
                <select defaultValue="Asia/Dhaka" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none bg-white">
                  <option value="Asia/Dhaka">Asia/Dhaka (UTC+6)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
            <button className="px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Save Changes</button>
          </div>
        )}

        {tab === 'commission' && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Commission Settings</h2>
            <div>
              <label className="block text-sm text-[#666] mb-1">Default Commission Rate (%)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                min="0"
                max="100"
                step="0.1"
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-2">Category-Specific Rates</label>
              <p className="text-xs text-[#888] mb-3">Category-specific rates are not yet configurable via this panel.</p>
              <div className="space-y-2">
                {[
                  { category: 'Electronics', rate: '3%' },
                  { category: 'Fashion', rate: '7%' },
                  { category: 'Home & Living', rate: '5%' },
                  { category: 'Books', rate: '10%' },
                  { category: 'Food', rate: '8%' },
                ].map((c) => (
                  <div key={c.category} className="flex items-center gap-3">
                    <span className="text-sm text-[#444] w-32">{c.category}</span>
                    <input type="text" defaultValue={c.rate} className="border border-[#ddd] rounded-lg px-3 py-1.5 text-sm outline-none w-24 bg-gray-50" disabled />
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleSaveCommission}
              disabled={saving}
              className="px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {tab === 'shipping' && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Shipping Settings</h2>
            <div>
              <label className="block text-sm text-[#666] mb-1">Free Shipping Threshold (৳)</label>
              <input type="number" defaultValue="1000" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Default Courier</label>
              <select className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none bg-white">
                <option>SA Paribahan</option>
                <option>Sundarban Courier</option>
                <option>Pathao</option>
                <option>E-Courier</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Default Shipping Cost (৳)</label>
              <input type="number" defaultValue="60" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <button className="px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Save Changes</button>
          </div>
        )}

        {tab === 'payment' && (
          <div className="max-w-2xl space-y-6">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Payment Configuration</h2>
            {[
              { title: 'bKash', fields: [{ label: 'Merchant Number', val: '01XXXXXXXXX' }, { label: 'API Key', val: '********' }] },
              { title: 'Nagad', fields: [{ label: 'Merchant Number', val: '01XXXXXXXXX' }, { label: 'API Key', val: '********' }] },
              { title: 'SSLCommerz', fields: [{ label: 'Store ID', val: 'abc123' }, { label: 'Store Password', val: '********' }] },
            ].map((gw) => (
              <div key={gw.title} className="border border-[#eee] rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-[#333]">{gw.title}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {gw.fields.map((f) => (
                    <div key={f.label}>
                      <label className="block text-xs text-[#888] mb-1">{f.label}</label>
                      <input type="text" defaultValue={f.val} className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button className="px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Save Changes</button>
          </div>
        )}

        {tab === 'email' && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Email Settings</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'SMTP Host', val: 'smtp.gmail.com' },
                { label: 'SMTP Port', val: '587' },
                { label: 'SMTP Username', val: 'noreply@amarshop.com' },
                { label: 'SMTP Password', val: '********' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-sm text-[#666] mb-1">{f.label}</label>
                  <input type={f.label.includes('Password') ? 'password' : 'text'} defaultValue={f.val} className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Notification Emails (comma separated)</label>
              <input type="text" defaultValue="admin@amarshop.com, support@amarshop.com" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <button className="px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Save Changes</button>
          </div>
        )}

        {tab === 'seo' && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-semibold text-[#222] mb-4">SEO Settings</h2>
            <div>
              <label className="block text-sm text-[#666] mb-1">Default Meta Title</label>
              <input type="text" defaultValue="AmarShop — Bangladesh's Premium Online Marketplace" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Default Meta Description</label>
              <textarea rows={2} defaultValue="Shop the best deals on electronics, fashion, home goods & more in Bangladesh." className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Google Analytics ID</label>
              <input type="text" defaultValue="G-XXXXXXXXXX" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <button className="px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Save Changes</button>
          </div>
        )}

        {tab === 'security' && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-semibold text-[#222] mb-4">Security Settings</h2>
            <div>
              <label className="block text-sm text-[#666] mb-1">Session Timeout (minutes)</label>
              <input type="number" defaultValue="60" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Max Login Attempts</label>
              <input type="number" defaultValue="5" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg">
              <div>
                <p className="text-sm font-medium text-[#333]">Two-Factor Authentication</p>
                <p className="text-xs text-[#888]">Require 2FA for admin accounts</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-primary cursor-pointer relative">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm" />
              </div>
            </div>
            <button className="px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );
}
