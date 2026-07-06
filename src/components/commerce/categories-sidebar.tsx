'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, cardItem } from '@/lib/motion-variants';

const categories = [
  { name: 'Electronics', icon: 'devices', slug: 'electronics' },
  { name: 'Fashion', icon: 'checkroom', slug: 'fashion' },
  { name: 'Beauty', icon: 'spa', slug: 'beauty' },
  { name: 'Groceries', icon: 'local_grocery_store', slug: 'groceries' },
  { name: 'Appliances', icon: 'kitchen', slug: 'appliances' },
  { name: 'Books & Stationery', icon: 'menu_book', slug: 'books-stationery' },
  { name: 'Gaming', icon: 'stadia_controller', slug: 'gaming' },
  { name: 'Home & Living', icon: 'chair', slug: 'home-living' },
  { name: 'Sports', icon: 'directions_bike', slug: 'sports' },
  { name: 'Accessories', icon: 'watch', slug: 'accessories' },
];

export function CategoriesSidebar() {
  return (
    <motion.aside
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="hidden xl:block bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] h-full"
    >
      <nav className="flex flex-col">
        {categories.map((cat) => (
          <motion.div key={cat.slug} variants={cardItem}>
            <Link
              href={'/category/' + cat.slug}
              className="flex items-center gap-3 h-12 px-3 rounded-xl text-[15px] font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors group"
            >
              <span className="material-symbols-outlined text-[24px] text-gray-400 group-hover:text-primary transition-colors">
                {cat.icon}
              </span>
              <span>{cat.name}</span>
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.aside>
  );
}
