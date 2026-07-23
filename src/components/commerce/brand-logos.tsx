'use client';

import { memo } from 'react';

/**
 * Premium SVG brand logos for AmarShop marketplace.
 * Each logo is a clean, minimal SVG designed for display at small sizes (28-44px).
 * Uses currentColor for fill so they adapt to any background.
 */

export const SamsungLogo = memo(function SamsungLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 113 24" fill="currentColor" className={className}>
      <path d="M8.4 0C3.76 0 0 3.76 0 8.4v7.2C0 20.24 3.76 24 8.4 24h7.2c4.64 0 8.4-3.76 8.4-8.4V8.4C24 3.76 20.24 0 15.6 0H8.4zm.2 2h6.8c3.54 0 6.4 2.86 6.4 6.4v7.2c0 3.54-2.86 6.4-6.4 6.4H8.6c-3.54 0-6.4-2.86-6.4-6.4V8.4C2.2 4.86 5.06 2 8.6 2zm3.4 4c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 2c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z"/>
    </svg>
  );
});

export const AppleLogo = memo(function AppleLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
});

export const XiaomiLogo = memo(function XiaomiLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 113 24" fill="currentColor" className={className}>
      <rect x="0" y="0" width="10" height="10" rx="1.5"/>
      <rect x="14" y="0" width="10" height="10" rx="1.5"/>
      <rect x="0" y="14" width="10" height="10" rx="1.5"/>
      <rect x="14" y="14" width="10" height="10" rx="1.5"/>
      <rect x="28" y="0" width="10" height="10" rx="1.5"/>
      <rect x="28" y="14" width="10" height="10" rx="1.5"/>
      <rect x="42" y="0" width="10" height="10" rx="1.5"/>
      <rect x="42" y="14" width="10" height="10" rx="1.5"/>
      <rect x="56" y="0" width="10" height="10" rx="1.5"/>
      <rect x="56" y="14" width="10" height="10" rx="1.5"/>
      <rect x="70" y="0" width="10" height="10" rx="1.5"/>
      <rect x="70" y="14" width="10" height="10" rx="1.5"/>
      <rect x="84" y="0" width="10" height="10" rx="1.5"/>
      <rect x="84" y="14" width="10" height="10" rx="1.5"/>
      <rect x="98" y="0" width="10" height="10" rx="1.5"/>
      <rect x="98" y="14" width="10" height="10" rx="1.5"/>
    </svg>
  );
});

export const WaltonLogo = memo(function WaltonLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 113 24" fill="currentColor" className={className}>
      <path d="M4 2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 2v16h16V4H4zm3 3h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/>
    </svg>
  );
});

export const AsusLogo = memo(function AsusLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 113 24" fill="currentColor" className={className}>
      <path d="M2 4h20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h20V6H2zm3 3h14v2H5V9zm0 4h10v2H5v-2z"/>
    </svg>
  );
});

export const LenovoLogo = memo(function LenovoLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 113 24" fill="currentColor" className={className}>
      <path d="M2 6h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2zm0 2v8h8V8H2zm12-2h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2zm0 2v8h8V8h-8z"/>
    </svg>
  );
});

export const HPLogo = memo(function HPLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 113 24" fill="currentColor" className={className}>
      <path d="M2 4h20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v12h20V6H2zm3 3h2v6H5V9zm4 0h2v6H9V9zm4 0h2v6h-2V9zm4 0h2v6h-2V9z"/>
    </svg>
  );
});

export const RealmeLogo = memo(function RealmeLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 113 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm-1 4v6l4.5 2.5.5-1-3.5-2V8h-1.5z"/>
    </svg>
  );
});

export const NikeLogo = memo(function NikeLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 7.8L6.44 19.05c-1.16.7-2.5-.1-2.5-1.1 0-.3.1-.6.3-.8L20.2 4.34c.4-.3.8-.2 1.1.1.3.3.4.7.2 1.1L8.7 17.55c-.1.1-.1.2 0 .3.1.1.2.1.3 0L24 7.8z"/>
    </svg>
  );
});

export const AdidasLogo = memo(function AdidasLogo({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M2 19l4-7 4 7H2zm6-7l4-7 4 7H8zm6-7l4-7 4 7h-8z"/>
    </svg>
  );
});

/** Brand metadata for consistent rendering across the marketplace */
export interface BrandInfo {
  name: string;
  slug: string;
  logo: React.ComponentType<{ className?: string }>;
  bg: string;
  ring: string;
  tagline: string;
  /** Brand's primary color for SVG rendering (hex) */
  color: string;
}

/** Map of brand name to its SVG component */
export const brandLogoMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Samsung: SamsungLogo,
  Apple: AppleLogo,
  Xiaomi: XiaomiLogo,
  Walton: WaltonLogo,
  Asus: AsusLogo,
  Lenovo: LenovoLogo,
  HP: HPLogo,
  Realme: RealmeLogo,
  Nike: NikeLogo,
  Adidas: AdidasLogo,
};

/** Full brand metadata for the Top Brands section */
export const brandData: BrandInfo[] = [
  { name: 'Samsung', slug: 'samsung', logo: SamsungLogo, bg: 'bg-[#1428A0]', ring: 'ring-blue-100', tagline: 'Electronics', color: '#1428A0' },
  { name: 'Apple', slug: 'apple', logo: AppleLogo, bg: 'bg-[#000000]', ring: 'ring-gray-100', tagline: 'Premium Tech', color: '#000000' },
  { name: 'Xiaomi', slug: 'xiaomi', logo: XiaomiLogo, bg: 'bg-[#FF6900]', ring: 'ring-orange-100', tagline: 'Smart Devices', color: '#FF6900' },
  { name: 'Walton', slug: 'walton', logo: WaltonLogo, bg: 'bg-[#E30613]', ring: 'ring-red-100', tagline: 'Local Brand', color: '#E30613' },
  { name: 'Asus', slug: 'asus', logo: AsusLogo, bg: 'bg-[#0066A1]', ring: 'ring-blue-100', tagline: 'Computing', color: '#0066A1' },
  { name: 'Lenovo', slug: 'lenovo', logo: LenovoLogo, bg: 'bg-[#E2231A]', ring: 'ring-red-100', tagline: 'Laptops', color: '#E2231A' },
  { name: 'HP', slug: 'hp', logo: HPLogo, bg: 'bg-[#0096D6]', ring: 'ring-blue-100', tagline: 'Printers & PCs', color: '#0096D6' },
  { name: 'Realme', slug: 'realme', logo: RealmeLogo, bg: 'bg-[#FFD700]', ring: 'ring-yellow-100', tagline: 'Smartphones', color: '#FFD700' },
];

/** Normalized logo wrapper — ensures all brand logos occupy the same visual space */
export function BrandLogoContainer({ logo: Logo, color, className = '' }: { logo: React.ComponentType<{ className?: string }>; color: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="max-h-8 max-w-[80px] w-auto h-auto" style={{ color }}>
        <Logo className="w-full h-full" />
      </div>
    </div>
  );
}
