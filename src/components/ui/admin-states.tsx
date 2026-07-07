'use client';

export function AdminLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
      <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>
      {message}
    </div>
  );
}

export function AdminError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200 flex items-center justify-between gap-3">
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 px-3 py-1 rounded-md bg-red-200/50 hover:bg-red-200 text-red-700 text-xs font-medium transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function AdminEmpty({
  message = 'No data found',
  icon = 'inbox',
}: {
  message?: string;
  icon?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
      <span className="material-symbols-outlined text-3xl block mb-2">{icon}</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}
