'use client';

import { NotificationButton } from './NotificationButton';
import { WishlistButton } from './WishlistButton';
import { CartButton } from './CartButton';
import { AuthSection } from './AuthSection';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';

export function Actions() {
  return (
    <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0 ml-auto">
      <div className="hidden md:block">
        <LanguageToggle />
      </div>
      <div className="hidden md:block">
        <ThemeToggle />
      </div>
      <div className="hidden sm:block">
        <NotificationButton />
      </div>
      <div className="hidden sm:block">
        <WishlistButton />
      </div>
      <CartButton compact />
      <AuthSection compact />
    </div>
  );
}

