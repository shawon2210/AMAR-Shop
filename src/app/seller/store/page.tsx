'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSellerStore, useUpdateSellerStore } from '@/services/seller';

export default function SellerStore() {
  const [vacationMode, setVacationMode] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeDesc, setStoreDesc] = useState('');

  const { data, isLoading, error } = useSellerStore();
  const updateStore = useUpdateSellerStore();

  useEffect(() => {
    if (data) {
      setStoreName(data.store.name);
      setStoreDesc(data.store.description);
      setVacationMode(data.sellerProfile.vacationMode);
    }
  }, [data]);

  const handleSave = () => {
    updateStore.mutate({ name: storeName, description: storeDesc });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-on-surface-variant">Loading store...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
        <p className="text-on-surface-variant">Failed to load store data</p>
      </div>
    );
  }

  const { store, sellerProfile } = data;

  return (
    <div className="space-y-6 app-container">
      <h1 className="text-xl font-bold text-on-surface">Store Settings</h1>

      {/* Store Preview Card */}
      <div className="bg-white rounded-xl border border-surface-container-high shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary/80 to-tertiary/60 relative">
          <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-xl bg-white border-2 border-white shadow-md overflow-hidden">
            {store.logo ? (
              <Image src={store.logo} alt={store.name} width={80} height={80} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                {store.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <div className="pt-12 px-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-lg text-on-surface">{store.name}</h2>
              <p className="text-sm text-on-surface-variant mt-0.5">{store.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-500 text-lg">star</span>
                  <span className="text-sm font-medium text-on-surface">{sellerProfile.avgRating.toFixed(1)}</span>
                  <span className="text-xs text-on-surface-variant">({sellerProfile.totalOrders} orders)</span>
                </div>
                <span className="text-sm text-on-surface-variant">|</span>
                <span className="text-sm text-on-surface-variant">{store.followerCount} followers</span>
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
            <div className="pt-2">
              <button
                onClick={handleSave}
                disabled={updateStore.isPending}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors disabled:opacity-50"
              >
                {updateStore.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
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
                    <label className="text-xs font-medium text-on-surface-variant block mb-1">Until</label>
                    <input type="date" className="w-full px-2 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KYC Status */}
          <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
            <h3 className="font-semibold text-on-surface mb-3">Verification Status</h3>
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined ${sellerProfile.isKycVerified ? 'text-green-600' : 'text-amber-600'}`}>
                {sellerProfile.isKycVerified ? 'verified' : 'pending'}
              </span>
              <span className={`text-sm font-medium ${sellerProfile.isKycVerified ? 'text-green-600' : 'text-amber-600'}`}>
                {sellerProfile.isKycVerified ? 'KYC Verified' : 'KYC Pending'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Level: {sellerProfile.level} | Score: {sellerProfile.performanceScore}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
