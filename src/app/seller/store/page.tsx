'use client';

import { useState } from 'react';

export default function SellerStore() {
  const [vacationMode, setVacationMode] = useState(false);
  const [storeName, setStoreName] = useState('ShopZone');
  const [storeDesc, setStoreDesc] = useState('Premium electronics and lifestyle products in Bangladesh. Authentic products with the best prices and fast delivery across the country.');

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-xl font-bold text-on-surface">Store Settings</h1>

      {/* Store Preview Card */}
      <div className="bg-white rounded-xl border border-surface-container-high shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary/80 to-tertiary/60 relative">
          <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-xl bg-white border-2 border-white shadow-md overflow-hidden">
            <div className="w-full h-full bg-primary flex items-center justify-center text-white text-2xl font-bold">S</div>
          </div>
        </div>
        <div className="pt-12 px-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-lg text-on-surface">{storeName}</h2>
              <p className="text-sm text-on-surface-variant mt-0.5">{storeDesc}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-500 text-lg">star</span>
                  <span className="text-sm font-medium text-on-surface">4.8</span>
                  <span className="text-xs text-on-surface-variant">(234 reviews)</span>
                </div>
                <span className="text-sm text-on-surface-variant">|</span>
                <span className="text-sm text-on-surface-variant">3,842 followers</span>
              </div>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-outline text-on-surface font-medium hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-lg">visibility</span>
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Store Form */}
          <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm space-y-4">
            <h3 className="font-semibold text-on-surface">Store Information</h3>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Store Description</label>
              <textarea
                rows={4}
                value={storeDesc}
                onChange={(e) => setStoreDesc(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-on-surface block mb-1">Logo URL</label>
                <input type="text" placeholder="https://example.com/logo.png" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface block mb-1">Banner URL</label>
                <input type="text" placeholder="https://example.com/banner.png" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['Electronics', 'Premium', 'Dhaka', 'Fast Delivery'].map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {tag}
                    <button className="hover:text-error">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </span>
                ))}
              </div>
              <input type="text" placeholder="Type a tag and press Enter" className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div className="pt-2">
              <button className="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors">Save Changes</button>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm space-y-4">
            <h3 className="font-semibold text-on-surface">Social Media Links</h3>
            {[
              { label: 'Facebook', icon: 'facebook', placeholder: 'https://facebook.com/your-store' },
              { label: 'Instagram', icon: 'photo_camera', placeholder: 'https://instagram.com/your-store' },
              { label: 'YouTube', icon: 'play_circle', placeholder: 'https://youtube.com/@your-store' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">{s.icon}</span>
                <input
                  type="text"
                  placeholder={s.placeholder}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Vacation Mode */}
          <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-on-surface">Vacation Mode</h3>
              <button
                onClick={() => setVacationMode(!vacationMode)}
                className={`relative w-11 h-6 rounded-full transition-colors ${vacationMode ? 'bg-primary' : 'bg-surface-container-high'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${vacationMode ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {vacationMode && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-on-surface block mb-1">Vacation Message</label>
                  <textarea
                    rows={2}
                    placeholder="We're on vacation! Orders will be processed after..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant block mb-1">From</label>
                    <input type="date" className="w-full px-2 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-on-surface-variant block mb-1">To</label>
                    <input type="date" className="w-full px-2 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Store QR Code */}
          <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm text-center">
            <h3 className="font-semibold text-on-surface mb-3">Store QR Code</h3>
            <div className="w-32 h-32 mx-auto bg-surface-container-low rounded-xl flex items-center justify-center border border-surface-container-high">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant">qr_code_scanner</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">Scan to visit your store</p>
            <button className="mt-3 text-xs text-primary font-medium hover:underline">Download QR</button>
          </div>
        </div>
      </div>
    </div>
  );
}
