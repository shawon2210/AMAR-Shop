'use client';

import { motion } from 'framer-motion';

const trustItems = [
  {
    icon: 'verified',
    title: '100% Authentic',
    desc: 'Genuine products with brand warranty',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: 'assignment_return',
    title: 'Easy Returns',
    desc: '7-day return & exchange policy',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: 'payments',
    title: 'Secure Payments',
    desc: 'SSL encrypted checkout. bKash, Nagad, COD',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: 'local_shipping',
    title: 'Nationwide Delivery',
    desc: 'Free shipping on orders over ৳999',
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function LocalBanners() {
  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {trustItems.map((item) => (
            <motion.div
              key={item.title}
              variants={cardItem}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.25 }}
              className="group rounded-3xl border border-white/30 bg-white/70 backdrop-blur-xl p-6 md:p-8 flex flex-col items-center text-center gap-3 shadow-md hover:shadow-2xl hover:shadow-emerald-500/10 transition-shadow duration-300"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.15 }}
                className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center`}
              >
                <span className={`material-symbols-outlined text-2xl ${item.iconColor}`}>
                  {item.icon}
                </span>
              </motion.div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
