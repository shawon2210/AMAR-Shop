'use client';

const defaultColorMap: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  delivered: 'bg-green-100 text-green-700',
  verified: 'bg-green-100 text-green-700',
  approved: 'bg-green-100 text-green-700',
  completed: 'bg-green-100 text-green-700',
  paid: 'bg-green-100 text-green-700',
  published: 'bg-green-100 text-green-700',

  pending: 'bg-amber-100 text-amber-700',
  draft: 'bg-amber-100 text-amber-700',
  upcoming: 'bg-amber-100 text-amber-700',

  cancelled: 'bg-red-100 text-red-700',
  rejected: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
  suspended: 'bg-red-100 text-red-700',
  inactive: 'bg-red-100 text-red-700',
  refunded: 'bg-red-100 text-red-700',

  processing: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-sky-100 text-sky-700',

  shipped: 'bg-purple-100 text-purple-700',

  returned: 'bg-pink-100 text-pink-700',
};

export function StatusBadge({
  status,
  colorMap,
  className = '',
}: {
  status: string;
  colorMap?: Record<string, string>;
  className?: string;
}) {
  const colors = colorMap ?? defaultColorMap;
  const base = 'text-[11px] font-semibold px-2 py-0.5 rounded-full';
  const colorClass = colors[status.toLowerCase()] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`${base} ${colorClass} ${className}`}>
      {status}
    </span>
  );
}
