'use client';

interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
  trend?: string;
  trendUp?: boolean;
  color?: string;
  variant?: 'simple' | 'icon' | 'gradient';
  gradient?: string;
}

const defaultGradients: Record<string, string> = {
  'Total Revenue': 'from-green-500 to-emerald-600',
  'Total Orders': 'from-blue-500 to-indigo-600',
  'Total Users': 'from-violet-500 to-purple-600',
  'Total Sellers': 'from-orange-500 to-amber-600',
  'Total Products': 'from-cyan-500 to-teal-600',
};

const defaultIcons: Record<string, string> = {
  'Total Revenue': 'payments',
  'Total Orders': 'receipt_long',
  'Total Users': 'group',
  'Total Sellers': 'store',
  'Total Products': 'inventory_2',
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  color,
  variant = 'simple',
  gradient,
}: StatCardProps) {
  if (variant === 'gradient') {
    const g = gradient ?? defaultGradients[label] ?? 'from-gray-500 to-gray-600';
    const i = icon ?? defaultIcons[label] ?? 'bar_chart';
    return (
      <div className="group bg-white rounded-xl border border-[#eee] overflow-hidden hover:shadow-md hover:border-[#ddd] transition-all duration-200">
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${g} flex items-center justify-center shadow-sm`}>
              <span className="material-symbols-outlined text-white text-lg sm:text-xl">{i}</span>
            </div>
            {trend && (
              <span className={`text-[10px] sm:text-xs font-semibold ${color ?? 'text-green-600'}`}>{trend}</span>
            )}
          </div>
          <p className="text-lg sm:text-2xl font-bold text-[#222] truncate">{value}</p>
          <p className="text-xs sm:text-sm text-[#888] mt-0.5">{label}</p>
        </div>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className="bg-white rounded-xl border border-[#eee] p-4">
        <div className="flex items-center gap-3">
          <div className={color ?? 'text-primary'}>
            <span className="material-symbols-outlined text-2xl">{icon ?? 'bar_chart'}</span>
          </div>
          <div>
            <p className="text-xs text-[#888]">{label}</p>
            <p className="text-lg font-semibold text-[#222]">{value}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-[#eee]">
      <p className={`text-2xl font-bold ${color ?? 'text-[#222]'}`}>{value}</p>
      <p className="text-sm text-[#888] mt-1">{label}</p>
    </div>
  );
}
