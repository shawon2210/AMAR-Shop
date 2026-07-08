'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { CartItemCard } from '@/components/commerce/cart-item';
import { ProductGrid } from '@/components/commerce/product-grid';
import { products } from '@/lib/data/products';
import { fadeUp, sectionReveal } from '@/lib/motion-variants';

export default function CartPage() {
  const items = useCartStore(s => s.items);
  const toggleSelectAll = useCartStore(s => s.toggleSelectAll);
  const getSelectedTotal = useCartStore(s => s.getSelectedTotal);
  const getSelectedCount = useCartStore(s => s.getSelectedCount);

  const allSelected = items.length > 0 && items.every(i => i.selected);
  const selectedTotal = getSelectedTotal();
  const selectedCount = getSelectedCount();

  const groupedItems = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.sellerId]) acc[item.sellerId] = [];
    acc[item.sellerId].push(item);
    return acc;
  }, {});

  if (items.length === 0) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col justify-center min-h-[calc(100dvh-10rem)] app-container"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center self-center mb-4">
          <span className="material-symbols-outlined text-4xl text-primary">shopping_cart</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-xs mx-auto">
          Looks like you haven&apos;t added anything yet. Browse our deals and find something you love!
        </p>
        <Link
          href="/"
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition-all text-center self-center w-full sm:w-auto"
        >
          Start Shopping
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="app-container pt-4 md:pt-6 space-y-4 md:space-y-6 pb-28">
      <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className="text-xl md:text-2xl font-bold">
        Shopping Cart
      </motion.h1>

      {/* Cart Items grouped by store */}
      <div className="space-y-4 md:space-y-6">
        {Object.entries(groupedItems).map(([sellerId, sellerItems], i) => (
          <motion.section
            key={sellerId}
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            className="bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] overflow-hidden"
          >
            <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-lg">store</span>
                <span className="font-semibold text-sm">{sellerItems[0].sellerName}</span>
                <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
              </div>
              <span className="text-primary font-semibold text-xs">Get Voucher</span>
            </div>

            <div className="divide-y divide-gray-100">
              {sellerItems.map(item => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Voucher */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white p-4 rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] flex items-center gap-3"
      >
        <span className="material-symbols-outlined text-primary">sell</span>
        <input
          className="flex-1 bg-gray-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          placeholder="Enter Voucher Code"
          type="text"
        />
        <button className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:brightness-110 transition-all text-sm">
          APPLY
        </button>
      </motion.div>

      {/* Recommendations */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="pt-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold">You May Also Like</h2>
          <button className="text-primary font-semibold flex items-center text-xs">
            See More <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <ProductGrid products={products.slice(0, 6)} columns={3} showLoadMore={false} />
      </motion.section>

      {/* Checkout Summary Bar - fixed bottom */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="fixed left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0px_-4px_12px_rgba(0,0,0,0.08)] bottom-0 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => toggleSelectAll(!allSelected)}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-semibold">Select All</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <span className="text-xs text-gray-500">Total:</span>
                <span className="text-primary font-bold text-lg">৳{selectedTotal.toLocaleString('en-BD')}</span>
              </div>
              <p className="text-[10px] text-gray-400">Voucher Applied: -৳0</p>
            </div>

            <Link
              href="/checkout"
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-md active:scale-95 transition-transform duration-150 inline-block text-sm"
            >
              Check Out ({selectedCount})
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
