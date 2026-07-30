'use client';

import { MobileSearchButton } from './MobileSearchButton';
import { NotificationButton } from './NotificationButton';
import { WishlistButton } from './WishlistButton';
import { CartButton } from './CartButton';
import { AuthSection } from './AuthSection';

export function Actions() {
  return (
    <div className="flex items-center justify-end gap-1 lg:gap-1.5 shrink-0">
      <MobileSearchButton />
      <NotificationButton />
      <WishlistButton />
      <CartButton />
      <AuthSection />
    </div>
  );
}
