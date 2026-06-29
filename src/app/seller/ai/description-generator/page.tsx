'use client';

import { useState } from 'react';

type Tone = 'professional' | 'casual' | 'luxury' | 'budget';

export default function AIDescriptionGeneratorPage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [tone, setTone] = useState<Tone>('professional');
  const [audience, setAudience] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!name.trim() || !category.trim()) return;
    setLoading(true);
    setDescription('');

    try {
      const res = await fetch('/api/ai/describe-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim(),
          features: featuresText.split('\n').filter(f => f.trim()),
          tone,
          targetAudience: audience.trim() || undefined,
        }),
      });

      const data = await res.json();
      setDescription(data.description || 'Failed to generate description.');
    } catch {
      setDescription('An error occurred while generating the description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(description);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">auto_awesome</span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">AI Product Description Generator</h1>
          <p className="text-body-md text-on-surface-variant">Generate compelling product descriptions with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-outline-variant rounded-xl p-6 space-y-4">
          <h2 className="font-title-sm text-title-sm text-on-surface">Product Details</h2>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Wireless Bluetooth Headphones"
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Category *</label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="e.g. Electronics / Audio"
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Features (one per line)</label>
            <textarea
              value={featuresText}
              onChange={e => setFeaturesText(e.target.value)}
              placeholder="Noise cancellation&#10;30hr battery life&#10;Bluetooth 5.3&#10;Comfortable fit"
              rows={5}
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Tone</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value as Tone)}
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary transition-colors"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual & Friendly</option>
              <option value="luxury">Luxury / Premium</option>
              <option value="budget">Budget / Value</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Target Audience (optional)</label>
            <input
              type="text"
              value={audience}
              onChange={e => setAudience(e.target.value)}
              placeholder="e.g. Young professionals, gamers"
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!name.trim() || !category.trim() || loading}
            className="w-full py-3 bg-primary text-on-primary font-label-bold rounded-lg hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                Generate Description
              </>
            )}
          </button>
        </div>

        <div className="bg-surface border border-outline-variant rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-title-sm text-title-sm text-on-surface">Generated Description</h2>
            {description && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                Copy
              </button>
            )}
          </div>

          {description ? (
            <div className="bg-surface-container-low rounded-lg p-4 min-h-75">
              <p className="text-body-md text-on-surface whitespace-pre-wrap">{description}</p>
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-lg p-4 min-h-75 flex items-center justify-center">
              <div className="text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2">description</span>
                <p className="text-body-md">Your generated description will appear here</p>
                <p className="text-body-sm mt-1">Fill in the product details and click generate</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
