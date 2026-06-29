'use client';

import { CountdownTimer } from '@/components/ui/countdown-timer';

interface FlashSaleBannerProps {
  endDate: string;
  title?: string;
  subtitle?: string;
}

export function FlashSaleBanner({
  endDate,
  title = 'FLASH SALE',
  subtitle = 'Deals end in',
}: FlashSaleBannerProps) {
  return (
    <section className="w-full bg-primary-container text-on-primary-container py-md px-container-margin overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-md relative z-10">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
          <div>
            <h2 className="font-headline-md text-headline-md">{title}</h2>
            <p className="font-body-sm text-body-sm opacity-90">{subtitle}</p>
          </div>
        </div>

        <CountdownTimer targetDate={endDate} variant="flash-sale" />
      </div>

      {/* Animated background glow elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-subtle" />
      </div>
    </section>
  );
}
