'use client';

import { useState } from 'react';

interface ToggleField {
  label: string;
  description: string;
  enabled: boolean;
}

export default function SellerSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState<ToggleField[]>([
    { label: 'New Orders', description: 'Get notified when a new order is placed', enabled: true },
    { label: 'Order Updates', description: 'Shipping, delivery, and cancellation updates', enabled: true },
    { label: 'Low Stock Alerts', description: 'When product stock is below threshold', enabled: true },
    { label: 'New Reviews', description: 'When customers review your products', enabled: true },
    { label: 'Campaign Updates', description: 'Campaign deadlines and performance', enabled: false },
    { label: 'Payout Notifications', description: 'When payouts are processed', enabled: true },
  ]);

  const toggleNotification = (index: number) => {
    setNotifications(notifications.map((n, i) => i === index ? { ...n, enabled: !n.enabled } : n));
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'password', label: 'Password' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'payment', label: 'Payment' },
    { id: 'kyc', label: 'KYC' },
    { id: 'language', label: 'Language' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-xl font-bold text-on-surface">Settings</h1>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-container-high rounded-lg p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === tab.id ? 'bg-white text-on-surface shadow-sm font-medium' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm space-y-4">
          <h3 className="font-semibold text-on-surface">Profile Information</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-on-primary text-2xl font-bold">S</div>
            <div>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors">Change Avatar</button>
              <p className="text-xs text-on-surface-variant mt-1">JPG, PNG, or WebP. Max 2MB.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Full Name</label>
              <input type="text" defaultValue="Shawon Rahman" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Email</label>
              <input type="email" defaultValue="seller@amarshop.com" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Phone</label>
              <input type="tel" defaultValue="+880 1712-345678" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
          <div className="pt-2">
            <button className="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors">Update Profile</button>
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm space-y-4">
          <h3 className="font-semibold text-on-surface">Change Password</h3>
          <div>
            <label className="text-sm font-medium text-on-surface block mb-1">Current Password</label>
            <input type="password" placeholder="Enter current password" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">New Password</label>
              <input type="password" placeholder="Enter new password" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Confirm New Password</label>
              <input type="password" placeholder="Confirm new password" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
          <div className="pt-2">
            <button className="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors">Change Password</button>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl border border-surface-container-high shadow-sm divide-y divide-surface-container-high">
          {notifications.map((n, i) => (
            <div key={n.label} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-on-surface">{n.label}</p>
                <p className="text-xs text-on-surface-variant">{n.description}</p>
              </div>
              <button
                onClick={() => toggleNotification(i)}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${n.enabled ? 'bg-primary' : 'bg-surface-container-high'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${n.enabled ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm space-y-4">
          <h3 className="font-semibold text-on-surface">Payment & Banking Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Bank Name</label>
              <input type="text" placeholder="e.g. Sonali Bank" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Account Holder Name</label>
              <input type="text" placeholder="e.g. Shawon Rahman" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Account Number</label>
              <input type="text" placeholder="Enter account number" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Routing Number</label>
              <input type="text" placeholder="Enter routing number" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
          <hr className="border-surface-container-high" />
          <h4 className="text-sm font-semibold text-on-surface">Mobile Financial Services</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">bKash Number</label>
              <input type="text" placeholder="01XXXXXXXXX" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Nagad Number</label>
              <input type="text" placeholder="01XXXXXXXXX" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
          <div className="pt-2">
            <button className="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors">Save Payment Info</button>
          </div>
        </div>
      )}

      {/* KYC Tab */}
      {activeTab === 'kyc' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-on-surface">KYC Verification Status</h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Pending</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 mb-4">
              <span className="material-symbols-outlined text-amber-600">info</span>
              <p className="text-xs text-amber-800">Your KYC is pending. Please submit the required documents to verify your identity.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-on-surface block mb-1">Upload NID (National ID)</label>
                <div className="border-2 border-dashed border-outline rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant">upload_file</span>
                  <p className="text-xs text-on-surface-variant mt-1">Click to upload your NID (front & back)</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface block mb-1">Upload Trade License</label>
                <div className="border-2 border-dashed border-outline rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant">upload_file</span>
                  <p className="text-xs text-on-surface-variant mt-1">Click to upload your Trade License</p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button className="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors">Submit Documents</button>
            </div>
          </div>
        </div>
      )}

      {/* Language Tab */}
      {activeTab === 'language' && (
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm space-y-4">
          <h3 className="font-semibold text-on-surface">Language Preference</h3>
          <div className="space-y-3">
            {[
              { lang: 'English', code: 'en', desc: 'Default interface language' },
              { lang: 'বাংলা', code: 'bn', desc: 'Bengali language support' },
            ].map((l) => (
              <label key={l.code} className="flex items-center gap-3 p-3 rounded-lg border border-outline cursor-pointer hover:bg-surface-container-low transition-colors">
                <input type="radio" name="language" defaultChecked={l.code === 'en'} className="accent-primary" />
                <div>
                  <p className="text-sm font-medium text-on-surface">{l.lang}</p>
                  <p className="text-xs text-on-surface-variant">{l.desc}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="pt-2">
            <button className="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors">Save Preference</button>
          </div>
        </div>
      )}
    </div>
  );
}
