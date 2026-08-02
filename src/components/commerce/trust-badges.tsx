'use client';

import { motion } from 'framer-motion';
import { staggerContainer, cardItem } from '@/lib/motion-variants';
import { ShieldCheck, Truck, Lock, RotateCcw, Star, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { TranslationKey } from '@/translations';

interface TrustItem {
  icon: React.ElementType;
  labelKey: TranslationKey;
  descKey: TranslationKey;
  color: string;
  bg: string;
}

const trustItems: TrustItem[] = [
  {
    icon: Star,
    labelKey: 'home.avgRating',
    descKey: 'home.trust1Desc',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
  },
  {
    icon: Truck,
    labelKey: 'home.nationwideDelivery',
    descKey: 'home.trust3Desc',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  {
    icon: Lock,
    labelKey: 'home.securePayment',
    descKey: 'home.trust2Desc',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
  },
  {
    icon: RotateCcw,
    labelKey: 'home.easyReturns',
    descKey: 'home.trust4Desc',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
  },
  {
    icon: ShieldCheck,
    labelKey: 'home.verifiedSellers',
    descKey: 'home.trust1Desc',
    color: 'text-primary',
    bg: 'bg-primary/5',
  },
  {
    icon: Gift,
    labelKey: 'home.freeShippingTitle',
    descKey: 'home.freeShippingDesc',
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
  },
];

interface TrustBadgesProps {
  variant?: 'inline' | 'grid';
}

export function TrustBadges({ variant = 'inline' }: TrustBadgesProps) {
  const { t } = useLanguage();

  if (variant === 'grid') {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
      >
        {trustItems.map((item, i) => (
          <motion.div
            key={item.labelKey}
            variants={cardItem}
            custom={i}
            className="flex flex-col items-center text-center p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
          >
            <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-200`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{t(item.labelKey)}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{t(item.descKey)}</p>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
    >
      {trustItems.map((item) => (
        <motion.div
          key={item.labelKey}
          variants={cardItem}
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
        >
          <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
          <span className="font-medium">{t(item.labelKey)}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}