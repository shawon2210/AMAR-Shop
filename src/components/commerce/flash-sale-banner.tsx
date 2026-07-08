'use client';

import { motion } from 'framer-motion';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { fadeUp } from '@/lib/motion-variants';

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
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full bg-gradient-to-r from-primary to-primary/80 text-white py-4 md:py-6 px-4 sm:px-6 md:px-8 overflow-hidden relative"
    >
      <div className="app-container flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            className="material-symbols-outlined text-3xl md:text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </motion.span>
          <div>
            <h2 className="text-lg md:text-xl font-bold">{title}</h2>
            <p className="text-sm opacity-90">{subtitle}</p>
          </div>
        </div>

        <CountdownTimer targetDate={endDate} variant="flash-sale" />
      </div>

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
        />
      </div>
    </motion.section>
  );
}
