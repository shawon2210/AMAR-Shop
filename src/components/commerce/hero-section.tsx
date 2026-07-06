"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeroSlider } from "./hero-slider";
import { staggerContainer, cardItem } from '@/lib/motion-variants';

const campaignCards = [
  { icon: 'flash_on', label: 'Flash Sale', desc: 'Up to 70% off', href: '/flash-sale', gradient: 'from-rose-500/90 to-red-600/85', iconBg: 'bg-rose-500/25' },
  { icon: 'local_shipping', label: 'Free Delivery', desc: 'On orders over ৳999', href: '#', gradient: 'from-emerald-600/85 to-green-700/80', iconBg: 'bg-emerald-500/25' },
  { icon: 'new_releases', label: 'New Arrivals', desc: 'Fresh styles & gadgets', href: '/categories', gradient: 'from-sky-600/85 to-blue-700/80', iconBg: 'bg-sky-500/25' },
  { icon: 'storefront', label: 'Become a Seller', desc: 'Reach millions', href: '/seller/dashboard', gradient: 'from-violet-600/85 to-purple-700/80', iconBg: 'bg-violet-500/25' },
];

const mobilePills = ['Electronics', 'Fashion', 'Beauty', 'Groceries', 'Home & Living', 'Sports', 'Flash Sale', 'New Arrivals', 'Deals', 'Mall'];

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 lg:pt-2">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 min-w-0"
          >
            <HeroSlider />
          </motion.div>

          <motion.aside
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:w-[240px] xl:w-[280px] shrink-0"
          >
            {campaignCards.map((card) => (
              <motion.div key={card.label} variants={cardItem}>
                <Link
                  href={card.href}
                  className={`group bg-gradient-to-br ${card.gradient} rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-2.5 sm:py-3 text-white hover:shadow-xl transition-all duration-300 flex flex-col justify-center min-h-[100px] sm:min-h-[130px] lg:min-h-[145px] relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${card.iconBg} flex items-center justify-center mb-1.5 sm:mb-2 backdrop-blur-sm relative`}>
                    <span className="material-symbols-outlined text-base sm:text-lg">{card.icon}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold leading-tight relative">{card.label}</p>
                  <p className="text-[10px] sm:text-[11px] text-white/80 mt-0.5 leading-tight relative">{card.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.aside>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:hidden -mx-4 px-4 pt-3 pb-2 overflow-x-auto hide-scrollbar"
        >
          <div className="flex gap-2.5 w-max">
            {mobilePills.map((name) => (
              <Link
                key={name}
                href="/categories"
                className="flex items-center h-8 px-4 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors whitespace-nowrap"
              >
                {name}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
