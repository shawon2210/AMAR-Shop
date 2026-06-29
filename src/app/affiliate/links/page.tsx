'use client';

import { useState } from 'react';

export default function AffiliateLinksPage() {
  const [productUrl, setProductUrl] = useState('');
  const [campaign, setCampaign] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const links = [
    { id: 'TRK001', product: 'Samsung Galaxy S24', url: 'https://amarshop.com/t/A7F3K9X2', clicks: 45, conversions: 3, revenue: '৳1,035', campaign: 'TechReview2026', created: '25 Jun 2026' },
    { id: 'TRK002', product: 'Wireless Earbuds Pro', url: 'https://amarshop.com/t/B2M8P5R1', clicks: 32, conversions: 2, revenue: '৳84', campaign: 'SummerSale', created: '24 Jun 2026' },
    { id: 'TRK003', product: 'Men\'s Cotton T-Shirt', url: 'https://amarshop.com/t/C9X4K7W3', clicks: 28, conversions: 1, revenue: '৳28', campaign: '', created: '23 Jun 2026' },
  ];

  const handleGenerate = () => {
    setGeneratedLink(`https://amarshop.com/t/${Math.random().toString(36).slice(2, 10).toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#222]">Tracking Links</h1>

      <div className="bg-white rounded-xl border border-[#eee] p-6">
        <h2 className="text-lg font-semibold text-[#222] mb-4">Generate New Link</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-[#666] block mb-1">Product URL or ID</label>
            <input type="text" value={productUrl} onChange={(e) => setProductUrl(e.target.value)}
              placeholder="Paste product URL or search..."
              className="w-full px-3 py-2 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#666] block mb-1">Campaign (Optional)</label>
            <input type="text" value={campaign} onChange={(e) => setCampaign(e.target.value)}
              placeholder="e.g. SummerSale"
              className="w-full px-3 py-2 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex items-end">
            <button onClick={handleGenerate}
              className="w-full px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
              Generate Link
            </button>
          </div>
        </div>

        {generatedLink && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-green-700 font-medium">Link Generated!</p>
              <p className="text-sm font-mono text-green-800 mt-1">{generatedLink}</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(generatedLink)}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
              Copy
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#eee]">
        <div className="p-5 border-b border-[#eee] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#222]">Your Links</h2>
          <div className="flex gap-2">
            <select className="px-3 py-1.5 border border-[#ddd] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option>All Products</option><option>With Campaigns</option><option>Top Performing</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[#888] text-xs uppercase tracking-wider border-b border-[#eee]">
              <th className="p-3">ID</th><th className="p-3">Product</th><th className="p-3">Tracking URL</th>
              <th className="p-3">Campaign</th><th className="p-3">Clicks</th><th className="p-3">Conv.</th>
              <th className="p-3">Revenue</th><th className="p-3">Created</th>
            </tr></thead>
            <tbody>
              {links.map((l) => (
                <tr key={l.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333]">{l.id}</td>
                  <td className="p-3 text-[#555]">{l.product}</td>
                  <td className="p-3">
                    <span className="text-primary text-xs font-mono">{l.url}</span>
                  </td>
                  <td className="p-3 text-[#555]">{l.campaign || '-'}</td>
                  <td className="p-3 text-[#555]">{l.clicks}</td>
                  <td className="p-3 text-[#555]">{l.conversions}</td>
                  <td className="p-3 font-semibold">{l.revenue}</td>
                  <td className="p-3 text-[#888]">{l.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
