'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '@/stores/ui-store';

const toastVariants = {
  initial: { opacity: 0, y: -20, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  exit: { opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } },
};

export function ToastContainer() {
  const toasts = useUIStore(s => s.toasts);
  const removeToast = useUIStore(s => s.removeToast);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none" aria-live="polite">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            layout
            className={'bg-inverse-surface text-inverse-on-surface px-lg py-2.5 rounded-full shadow-lg flex items-center gap-2 pointer-events-auto cursor-pointer shadow-black/10'}
            onClick={() => removeToast(toast.id)}
          >
            <span className="material-symbols-outlined text-primary-fixed-dim text-sm">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            <span className="font-label-bold text-sm whitespace-nowrap">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
