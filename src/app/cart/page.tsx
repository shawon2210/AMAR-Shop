'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { CartItemCard } from '@/components/commerce/cart-item';
import { ProductGrid } from '@/components/commerce/product-grid';
import { products } from '@/lib/data/products';
import { fadeUp, sectionReveal } from '@/lib/motion-variants';
import { Truck, Undo2, Gift, Percent, ShoppingBag, ArrowRight } from 'lucide-react';

const couponSuggestions = [
  { code: 'WELCOME10', discount: 100, label: 'New User Discount' },
  { code: 'FLASH50', discount: 50, label: 'Flash Sale Extra' },
  { code: 'FREEDEL', discount: 0, label: 'Free Delivery' },
];

export default function CartPage() {
  const items = useCartStore(s => s.items);
  const removedItems = useCartStore(s => s.removedItems);
  const toggleSelectAll = useCartStore(s => s.toggleSelectAll);
  const getSelectedTotal = useCartStore(s => s.getSelectedTotal);
  const getSelectedCount = useCartStore(s => s.getSelectedCount);
  const getShippingProgress = useCartStore(s => s.getShippingProgress);
  const undoRemoveItem = useCartStore(s => s.undoRemoveItem);
  const setCoupon = useCartStore(s => s.setCoupon);
  const clearCoupon = useCartStore(s => s.clearCoupon);
  const couponCode = useCartStore(s => s.couponCode);
  const couponDiscount = useCartStore(s => s.couponDiscount);

  const [couponInput, setCouponInput] = useState('');
  const [showUndo, setShowUndo] = useState(false);
  const lastRemovedIdRef = useRef<string | null>(null);

  const allSelected = items.length > 0 && items.every(i => i.selected);
  const selectedTotal = getSelectedTotal();
  const selectedCount = getSelectedCount();
  const shipping = getShippingProgress();

  const groupedItems = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.sellerId]) acc[item.sellerId] = [];
    acc[item.sellerId].push(item);
    return acc;
  }, {});

  // Show undo toast when items are removed
  useEffect(() => {
    if (removedItems.length > 0) {
      const latest = removedItems[0];
      if (latest.item.id !== lastRemovedIdRef.current) {
        lastRemovedIdRef.current = latest.item.id;
        setShowUndo(true);
        const timer = setTimeout(() => setShowUndo(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [removedItems]);

  const handleApplyCoupon = () => {
    const found = couponSuggestions.find(
      c => c.code.toLowerCase() === couponInput.toLowerCase()
    );
    if (found) {
      setCoupon(found.code, found.discount);
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col justify-center min-h-[calc(100dvh-10rem)] app-container"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center self-center mb-4">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-xs mx-auto">
          Looks like you haven't added anything yet. Browse our deals and find something you love!
        </p>

        {/* Recently removed items */}
        {removedItems.length > 0 && (
          <div className="max-w-md mx-auto w-full mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Recently Removed</h3>
            <div className="space-y-2">
              {removedItems.slice(0, 3).map(r => (
                <div key={r.item.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
                    <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden shrink-0">
                    <img src={r.item.product.images[0]} alt={r.item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{r.item.product.name}</p>
                    <p className="text-xs text-gray-400">৳{r.item.product.price.toLocaleString('en-BD')}</p>
                  </div>
                  <button
                    onClick={() => undoRemoveItem(r.item.id)}
                    className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline shrink-0"
                  >
                    <Undo2 className="w-3 h-3" />
                    Undo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
    <div className="app-container pt-4 md:pt-6 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] lg:pb-12">
      <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
        Shopping Cart
      </motion.h1>

      <div className="lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
        {/* Left Column — Items, Coupon, Recommendations */}
        <div className="space-y-4 md:space-y-6 min-w-0">

          {/* Shipping Progress Bar */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          >
            {shipping.remaining > 0 ? (
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>
                    You&apos;re <strong className="text-primary">৳{shipping.remaining.toLocaleString('en-BD')}</strong> away from free delivery!
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                    style={{ width: `${shipping.percent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <Gift className="w-4 h-4" />
                <span>You&apos;ve earned free delivery!</span>
              </div>
            )}
          </motion.div>

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

          {/* Coupon Section */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] overflow-hidden"
          >
            {couponCode ? (
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Percent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        Coupon Applied: <span className="text-primary">{couponCode}</span>
                      </p>
                      {couponDiscount > 0 && (
                        <p className="text-xs text-gray-500">-৳{couponDiscount} discount</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={clearCoupon}
                    className="text-xs text-red-500 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Percent className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm">Have a coupon?</span>
                </div>
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Enter coupon code"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:brightness-110 transition-all text-sm"
                  >
                    Apply
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {couponSuggestions.map(c => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCoupon(c.code, c.discount);
                        setCouponInput('');
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
                    >
                      <Percent className="w-3 h-3" />
                      {c.code}
                      {c.discount > 0 && <span className="text-emerald-600 font-medium">-৳{c.discount}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                See More <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
            <ProductGrid products={products.slice(0, 6)} columns={3} showLoadMore={false} />
          </motion.section>
        </div>

        {/* Right Column — Order Summary (Desktop only) */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-base font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({selectedCount} items)</span>
                  <span className="font-medium text-gray-900">৳{selectedTotal.toLocaleString('en-BD')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-medium">-৳{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping.remaining > 0 ? '৳60' : 'Free'}
                  </span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary">
                    ৳{(selectedTotal - couponDiscount + (shipping.remaining > 0 ? 60 : 0)).toLocaleString('en-BD')}
                  </span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-5 block w-full bg-primary text-white text-center py-3 rounded-xl font-semibold shadow-md hover:brightness-110 active:scale-[0.98] transition-all text-sm"
              >
                Proceed to Checkout ({selectedCount})
              </Link>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <Truck className="w-3 h-3" />
                <span>Free returns within 7 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Undo Toast */}
      <AnimatePresence>
        {showUndo && removedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 max-w-sm w-[calc(100%-32px)]"
          >
            <Undo2 className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm flex-1">Item removed from cart</p>
            <button
              onClick={() => {
                undoRemoveItem(removedItems[0].item.id);
                setShowUndo(false);
              }}
              className="text-primary font-semibold text-sm hover:underline shrink-0"
            >
              Undo
            </button>
            <button
              onClick={() => setShowUndo(false)}
              className="text-gray-400 hover:text-white transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Summary Bar — Mobile/Tablet only */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="fixed left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0px_-4px_12px_rgba(0,0,0,0.08)] bottom-14 lg:hidden pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]"
      >
        <div className="app-container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => toggleSelectAll(!allSelected)}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              aria-label={allSelected ? 'Deselect all items' : 'Select all items'}
            />
            <span className="text-sm font-semibold">Select All</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <span className="text-xs text-gray-500">Total:</span>
                <span className="text-primary font-bold text-lg">৳{selectedTotal.toLocaleString('en-BD')}</span>
              </div>
              {couponDiscount > 0 && (
                <p className="text-[10px] text-emerald-600 font-medium">Coupon: -৳{couponDiscount}</p>
              )}
              {shipping.remaining > 0 && (
                <p className="text-[10px] text-gray-400">Shipping: +৳60</p>
              )}
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