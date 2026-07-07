'use client';

interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

export function BarChart({
  data,
  height = 200,
  barColor = '#a63600',
  showValue = true,
  className = '',
}: {
  data: BarChartItem[];
  height?: number;
  barColor?: string;
  showValue?: boolean;
  className?: string;
}) {
  if (!data || data.length === 0) {
    return (
      <div className={`h-48 flex items-center justify-center text-[#888] text-sm ${className}`}>
        No data available
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 600;
  const h = height;
  const n = data.length;
  const gap = w * 0.08;
  const barW = (w - gap) / n - gap / n;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`w-full ${className}`} style={{ height }} preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const barH = (d.value / max) * h * 0.85;
        const x = (i / n) * w + gap / 2;
        const y = h - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill={d.color || barColor} opacity="0.8" />
            {showValue && d.value > 0 && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" className="fill-[#888] text-[8px]">
                {d.value >= 1000 ? `${(d.value / 1000).toFixed(0)}k` : d.value}
              </text>
            )}
            <text x={x + barW / 2} y={h - 2} textAnchor="middle" className="fill-[#999] text-[8px]">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
