'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center min-w-0 min-h-11 py-1" aria-label="AmarShop Home">
      <Image
        src="/images/amarshop-logo.png"
        alt="AmarShop"
        width={180}
        height={48}
        className="w-[clamp(100px,20vw,180px)] h-auto object-contain"
        priority
      />
    </Link>
  );
}
