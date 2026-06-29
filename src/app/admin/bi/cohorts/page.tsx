'use client';

export default function CohortsPage() {
  const cohorts = [
    { cohort: '2025-01', base: 120, period_0: 100, period_1: 42, period_2: 35, period_3: 28 },
    { cohort: '2025-02', base: 145, period_0: 100, period_1: 38, period_2: 31, period_3: 24 },
    { cohort: '2025-03', base: 132, period_0: 100, period_1: 45, period_2: 37, period_3: 30 },
    { cohort: '2025-04', base: 158, period_0: 100, period_1: 40, period_2: 33, period_3: 26 },
    { cohort: '2025-05', base: 140, period_0: 100, period_1: 44, period_2: 36, period_3: 29 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-headline-md text-on-surface">Cohort Analysis</h1>
      <p className="text-body-sm text-on-surface-variant">Monthly customer retention cohorts</p>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <table className="w-full text-body-sm">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="text-left py-3 px-4 text-on-surface-variant font-medium">Cohort</th>
              <th className="text-center py-3 px-4 text-on-surface-variant font-medium">Users</th>
              <th className="text-center py-3 px-4 text-on-surface-variant font-medium">Period 0</th>
              <th className="text-center py-3 px-4 text-on-surface-variant font-medium">Period 1</th>
              <th className="text-center py-3 px-4 text-on-surface-variant font-medium">Period 2</th>
              <th className="text-center py-3 px-4 text-on-surface-variant font-medium">Period 3</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c, i) => (
              <tr key={i} className="border-b border-outline-variant/50 hover:bg-surface-container-low">
                <td className="py-3 px-4 text-on-surface font-medium">{c.cohort}</td>
                <td className="py-3 px-4 text-center text-on-surface">{c.base}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 rounded bg-primary/20 text-primary font-semibold">{c.period_0}%</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded ${c.period_1 > 40 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} font-semibold`}>{c.period_1}%</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded ${c.period_2 > 35 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} font-semibold`}>{c.period_2}%</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-1 rounded bg-surface-container-highest text-on-surface-variant font-semibold">{c.period_3}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant p-5">
        <h2 className="text-title-sm text-on-surface font-semibold mb-4">Retention Curve</h2>
        <div className="flex items-end gap-3 h-48">
          {['Period 0', 'Period 1', 'Period 2', 'Period 3'].map((p, i) => {
            const avg = 100 - i * 18;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary rounded-t" style={{ height: `${avg * 1.5}px` }} />
                <span className="text-body-sm text-on-surface font-medium">{avg}%</span>
                <span className="text-label-bold text-on-surface-variant">{p}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
