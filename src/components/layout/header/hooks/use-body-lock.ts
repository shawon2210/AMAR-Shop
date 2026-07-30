'use client';

import { useEffect } from 'react';

let lockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (locked) {
      lockCount++;
      if (lockCount === 1) {
        previousOverflow = document.body.style.overflow;
        previousPaddingRight = document.body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
      }
    }
    return () => {
      if (locked) {
        lockCount--;
        if (lockCount <= 0) {
          document.body.style.overflow = previousOverflow;
          document.body.style.paddingRight = previousPaddingRight;
          lockCount = 0;
        }
      }
    };
  }, [locked]);
}
