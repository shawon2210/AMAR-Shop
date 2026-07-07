'use client';

export function ProgressBar({
  value,
  max = 100,
  color = 'bg-primary',
  size = 'md',
  showLabel = false,
}: {
  value: number;
  max?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${color} ${heights[size]} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 font-medium tabular-nums">{Math.round(pct)}%</span>
      )}
    </div>
  );
}
