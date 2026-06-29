'use client';

export default function RfmPage() {
  const segments = [
    { segment: 'Champions', count: 234, avgRecency: 12, avgFrequency: 8, avgMonetary: 12500 },
    { segment: 'Loyal', count: 456, avgRecency: 28, avgFrequency: 5, avgMonetary: 7800 },
    { segment: 'Potential', count: 345, avgRecency: 55, avgFrequency: 2, avgMonetary: 3400 },
    { segment: 'At Risk', count: 189, avgRecency: 120, avgFrequency: 3, avgMonetary: 5600 },
    { segment: 'Lost', count: 567, avgRecency: 250, avgFrequency: 1, avgMonetary: 1200 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md text-on-surface">RFM Analysis</h1>
      <p className="text-body-sm text-on-surface-variant">Customer segmentation by Recency, Frequency, and Monetary value</p>

      <div className="grid grid-cols-1 gap-3">
        {segments.map((s, i) => (
          <div key={i} className="bg-surface rounded-xl border border-outline-variant p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-green-100' : i === 1 ? 'bg-blue-100' : i === 2 ? 'bg-amber-100' : i === 3 ? 'bg-orange-100' : 'bg-red-100'}`}>
                  <span className="material-symbols-outlined text-[20px] text-on-surface">group</span>
                </div>
                <div>
                  <h3 className="text-title-sm text-on-surface font-semibold">{s.segment}</h3>
                  <p className="text-label-bold text-on-surface-variant">{s.count} customers</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-label-bold text-on-surface-variant">Avg LTV</p>
                <p className="text-title-sm text-on-surface font-semibold">৳{s.avgMonetary.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-outline-variant">
              <div>
                <p className="text-label-bold text-on-surface-variant">Avg Recency</p>
                <p className="text-body-md text-on-surface font-semibold">{s.avgRecency} days</p>
              </div>
              <div>
                <p className="text-label-bold text-on-surface-variant">Avg Frequency</p>
                <p className="text-body-md text-on-surface font-semibold">{s.avgFrequency} orders</p>
              </div>
              <div>
                <p className="text-label-bold text-on-surface-variant">Avg Monetary</p>
                <p className="text-body-md text-on-surface font-semibold">৳{s.avgMonetary.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
