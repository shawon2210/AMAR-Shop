'use client';

import { useState } from 'react';

export default function AICampaignGeneratorPage() {
  const [campaignName, setCampaignName] = useState('');
  const [type, setType] = useState('flash_sale');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('');
  const [audience, setAudience] = useState('');
  const [copy, setCopy] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!campaignName.trim()) return;
    setLoading(true);
    setCopy('');

    try {
      const res = await fetch('/api/v1/ai/describe-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName.trim(),
          category: category.trim() || 'General',
          features: [],
          tone: 'casual',
        }),
      });

      const data = await res.json();
      const discountText = discount ? `Up to ${discount}% OFF! ` : '';
      const generatedCopy = `🔥 ${campaignName.toUpperCase()} IS LIVE! ${discountText}` +
        `${audience ? `Hey ${audience}, ` : ''}Don't miss our amazing deals on ${category || 'top products'}. ` +
        `Limited time offer. Shop now on AmarShop Bangladesh! 🇧🇩\n\n` +
        `${data.description || ''}` +
        `\n\n👉 Shop Now: https://amarshop.com/campaigns` +
        `\n⏰ Hurry, while stocks last!`;

      setCopy(generatedCopy);
    } catch {
      setCopy(`🔥 ${campaignName.toUpperCase()} IS LIVE!\n\nGet amazing deals on ${category || 'our top products'}${discount ? ` with up to ${discount}% OFF` : ''}. Limited time offer! Shop now on AmarShop.\n\n👉 Shop Now: https://amarshop.com/campaigns`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(copy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">campaign</span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">AI Campaign Copy Generator</h1>
          <p className="text-body-md text-on-surface-variant">Create engaging marketing campaigns with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-outline-variant rounded-xl p-6 space-y-4">
          <h2 className="font-title-sm text-title-sm text-on-surface">Campaign Details</h2>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Campaign Name *</label>
            <input
              type="text"
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              placeholder="e.g. Summer Mega Sale"
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Campaign Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary transition-colors"
            >
              <option value="flash_sale">Flash Sale</option>
              <option value="mega_deals">Mega Deals</option>
              <option value="free_shipping">Free Shipping</option>
              <option value="daily_deal">Daily Deal</option>
              <option value="seasonal">Seasonal Sale</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Discount (%)</label>
            <input
              type="number"
              value={discount}
              onChange={e => setDiscount(e.target.value)}
              placeholder="e.g. 50"
              min="0"
              max="100"
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Product Category</label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="e.g. Electronics, Fashion"
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Target Audience</label>
            <input
              type="text"
              value={audience}
              onChange={e => setAudience(e.target.value)}
              placeholder="e.g. Students, Professionals"
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!campaignName.trim() || loading}
            className="w-full py-3 bg-primary text-on-primary font-label-bold rounded-lg hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">campaign</span>
                Generate Campaign Copy
              </>
            )}
          </button>
        </div>

        <div className="bg-surface border border-outline-variant rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-title-sm text-title-sm text-on-surface">Generated Copy</h2>
            {copy && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <span className="material-symbols-outlined text-sm">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>

          {copy ? (
            <div className="bg-surface-container-low rounded-lg p-4 min-h-[300px]">
              <div className="flex items-center gap-2 mb-3 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">campaign</span>
                <span>AmarShop Campaign • {new Date().toLocaleDateString()}</span>
              </div>
              <p className="text-body-md text-on-surface whitespace-pre-wrap">{copy}</p>
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-lg p-4 min-h-[300px] flex items-center justify-center">
              <div className="text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2">campaign</span>
                <p className="text-body-md">Your campaign copy will appear here</p>
                <p className="text-body-sm mt-1">Fill in the campaign details and click generate</p>
              </div>
            </div>
          )}

          {copy && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-xs font-medium text-primary mb-2">Preview</p>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-on-primary">storefront</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">AmarShop</p>
                    <p className="text-xs text-on-surface-variant">Sponsored</p>
                  </div>
                </div>
                <p className="text-sm text-on-surface whitespace-pre-wrap">{copy.slice(0, 200)}...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
