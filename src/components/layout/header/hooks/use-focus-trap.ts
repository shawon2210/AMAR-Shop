'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]):not([aria-hidden="true"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([aria-hidden="true"])';

export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  restoreFocus = true,
  onEscapeClose?: () => void,
) {
  useEffect(() => {
    if (!active || !ref.current) return;

    const el = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const trapHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscapeClose?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    el.addEventListener('keydown', trapHandler);

    requestAnimationFrame(() => {
      const firstFocusable = el.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstFocusable?.focus();
    });

    return () => {
      el.removeEventListener('keydown', trapHandler);
      if (restoreFocus) {
        previouslyFocused?.focus();
      }
    };
  }, [ref, active, restoreFocus, onEscapeClose]);
}
