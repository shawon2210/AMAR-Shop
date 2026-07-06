"use client";

import { designTokens } from '@/lib/designTokens';
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
    <section className="bg-surface">
      <div className="max-w-7xl mx-auto px-container pt-md lg:pt-lg">
        <div className="flex flex-col lg:flex-row gap-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: designTokens.animation.duration.entrance, ease: designTokens.animation.easing.default }}
            className="flex-1 min-w-0"
          >
            <HeroSlider />
          </motion.div>

          <motion.aside
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-sm lg:w-[280px] shrink-0"
          >
            {campaignCards.map((card) => (
              <motion.div key={card.label} variants={cardItem} whileHover={{ y: -4 }}>
                <Link
                  href={card.href}
                  className={`group bg-gradient-to-br ${card.gradient} rounded-2xl px-md py-md text-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-center min-h-[120px] relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
                  <div className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center mb-md backdrop-blur-md relative`}>
                    <span className="material-symbols-outlined text-xl">{card.icon}</span>
                  </div>
                  <p className="text-sm font-semibold leading-tight relative">{card.label}</p>
                  <p className="text-xs text-white/80 mt-1 leading-tight relative">{card.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.aside>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="lg:hidden -mx-container px-container pt-md pb-sm overflow-x-auto hide-scrollbar"
        >
          <div className="flex gap-sm w-max">
            {mobilePills.map((name) => (
              <Link
                key={name}
                href="/categories"
                className="flex items-center h-10 px-md rounded-full bg-surface-container border border-border text-sm font-medium text-text-secondary hover:border-primary hover:text-primary hover:bg-primary/5 transition-all whitespace-nowrap"
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
