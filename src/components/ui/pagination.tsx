'use client';

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#888]">
        Page {page} of {totalPages}
        {total !== undefined && <span> ({total} total)</span>}
      </span>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 bg-white border border-[#ddd] rounded-lg disabled:opacity-50 hover:bg-[#f5f5f5] transition-colors"
        >
          Previous
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 bg-white border border-[#ddd] rounded-lg disabled:opacity-50 hover:bg-[#f5f5f5] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
