'use client';

import React from 'react';
import { useTheme } from '@/contexts/theme-context';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-11 h-11 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      aria-label={`Switch theme (current: ${theme}, active: ${resolvedTheme})`}
      title={`Current: ${resolvedTheme} mode. Click to toggle theme.`}
      type="button"
    >
      {resolvedTheme === 'dark' ? (
        <span className="material-symbols-outlined text-[22px] text-amber-400 animate-fade-in">
          light_mode
        </span>
      ) : (
        <span className="material-symbols-outlined text-[22px] text-slate-700 animate-fade-in">
          dark_mode
        </span>
      )}
    </button>
  );
}
