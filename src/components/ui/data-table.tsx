'use client';

import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T, index: number) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  error,
  emptyMessage = 'No data found',
  onRetry,
  mobileCard,
}: {
  columns: Column<T>[];
  data: T[] | null | undefined;
  loading: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRetry?: () => void;
  mobileCard?: (item: T) => React.ReactNode;
}) {
  if (error) {
    return <AdminError message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return <AdminLoading />;
  }

  if (!data || data.length === 0) {
    return <AdminEmpty message={emptyMessage} />;
  }

  return (
    <>
      <div className="hidden sm:block bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              {columns.map((col) => (
                <th key={col.key} className={`p-3 ${col.className ?? ''} ${col.hideOnMobile ? 'hidden' : ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-b border-[#f5f5f5] hover:bg-[#fafafa] transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`p-3 ${col.className ?? ''} ${col.hideOnMobile ? 'hidden' : ''}`}>
                    {col.render(item, i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mobileCard && (
        <div className="sm:hidden space-y-3">
          {data.map((item, i) => (
            <div key={i}>{mobileCard(item)}</div>
          ))}
        </div>
      )}
    </>
  );
}
