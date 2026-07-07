'use client';

import Link from 'next/link';

export function PageHeader({
  title,
  subtitle,
  actions,
  total,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  total?: number | string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-[#222]">{title}</h1>
          {total !== undefined && (
            <span className="text-xs sm:text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
              {total} total
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-[#888] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function BackLink({ href, label = 'Back' }: { href: string; label?: string }) {
  return (
    <Link href={href} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
      <span className="material-symbols-outlined text-[16px]">arrow_back</span>
      {label}
    </Link>
  );
}
