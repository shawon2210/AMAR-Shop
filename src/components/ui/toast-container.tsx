'use client';

import { useUIStore } from '@/stores/ui-store';

export function ToastContainer() {
  const toasts = useUIStore(s => s.toasts);
  const removeToast = useUIStore(s => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="bg-inverse-surface text-inverse-on-surface px-lg py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-fade-in-up pointer-events-auto cursor-pointer"
          onClick={() => removeToast(toast.id)}
        >
          <span className="material-symbols-outlined text-primary-fixed-dim text-sm">
            {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
          </span>
          <span className="font-label-bold text-sm whitespace-nowrap">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
