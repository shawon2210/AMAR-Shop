'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface UseSidebarBehaviorOptions {
  open: boolean;
  onClose: () => void;
  isDesktop?: boolean;
  desktopBreakpoint?: number;
  focusRef?: React.RefObject<HTMLElement | null>;
}

export function useSidebarBehavior({
  open,
  onClose,
  isDesktop = false,
  desktopBreakpoint = 1024,
  focusRef,
}: UseSidebarBehaviorOptions) {
  const pathname = usePathname();
  const onCloseRef = useRef(onClose);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const mql = window.matchMedia(`(min-width: ${desktopBreakpoint}px)`);
    const update = () => {
      if (mql.matches) {
        onCloseRef.current();
      }
    };

    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [open, desktopBreakpoint]);

  useEffect(() => {
    onClose();
  }, [pathname]);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
  }, []);

  const restoreFocus = useCallback(() => {
    const target = focusRef?.current;
    if (target && target.offsetParent !== null) {
      target.focus();
    } else if (previousFocusRef.current && previousFocusRef.current.offsetParent !== null) {
      previousFocusRef.current.focus();
    } else {
      const firstFocusable = document.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    }
  }, [focusRef]);

  return { saveFocus, restoreFocus, onCloseRef };
}