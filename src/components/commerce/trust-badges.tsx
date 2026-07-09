'use client';

import { motion } from 'framer-motion';
import { staggerContainer, cardItem } from '@/lib/motion-variants';
import { ShieldCheck, Truck, Lock, RotateCcw, Star, Gift } from 'lucide-react';

const trustItems = [
  {
    icon: Star,
    label: '4.8 Average Rating',
    description: 'From 50k+ verified buyers',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Truck,
    label: 'Nationwide Delivery',
    description: 'Free shipping over ৳999',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: Lock,
    label: 'Secure Payment',
    description: 'SSL encrypted checkout',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: RotateCcw,
    label: 'Easy Returns',
    description: '7-day return policy',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  {
    icon: ShieldCheck,
    label: 'Verified Sellers',
    description: '100% authentic products',
    color: 'text-primary',
    bg: 'bg-primary/5',
  },
  {
    icon: Gift,
    label: 'Free Delivery',
    description: 'On orders over ৳999',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
];

interface TrustBadgesProps {
  variant?: 'inline' | 'grid';
}

export function TrustBadges({ variant = 'inline' }: TrustBadgesProps) {
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
            key={item.label}
            variants={cardItem}
            custom={i}
            className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
          >
            <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-200`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-xs font-semibold text-gray-700">{item.label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{item.description}</p>
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
          key={item.label}
          variants={cardItem}
          className="flex items-center gap-1.5 text-xs text-gray-500"
        >
          <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
          <span className="font-medium">{item.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}