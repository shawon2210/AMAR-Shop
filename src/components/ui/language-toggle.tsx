'use client';

import React from 'react';
import { useLanguage } from '@/contexts/language-context';

interface LanguageToggleProps {
  className?: string;
  compact?: boolean;
}

export function LanguageToggle({ className = '', compact = false }: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguage();

  const isBn = language === 'bn';

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      aria-label={`Switch language (current: ${isBn ? 'Bangla' : 'English'})`}
      title={isBn ? 'Switch to English' : 'বাংলা ভাষায় দেখুন'}
      type="button"
    >
      <span className="material-symbols-outlined text-[20px] text-gray-500 dark:text-gray-400">
        translate
      </span>
      <span className="font-bold tracking-wider uppercase text-[11px] leading-none">
        {isBn ? 'বাং' : 'EN'}
      </span>
    </button>
  );
}
