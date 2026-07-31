'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/stores/cart-store';
import { CartItemCard } from '@/components/commerce/cart-item';
import { ProductCard } from '@/components/commerce/product-card';
import { fadeUp, sectionReveal } from '@/lib/motion-variants';
import {
  Truck,
  Undo2,
  Gift,
  Percent,
  ShoppingBag,
  ArrowRight,
  Lock,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { useGetProducts } from '@/services/products';

const couponSuggestions = [
  { code: 'WELCOME10', discount: 100, label: 'New User Discount' },
  { code: 'FLASH50', discount: 50, label: 'Flash Sale Extra' },
  { code: 'FREEDEL', discount: 0, label: 'Free Delivery' },
];

const SHIPPING_FEE = 60;
const PAYMENT_METHODS = ['bKash', 'Nagad', 'COD', 'SSLCommerz'];

const FLOAT_CARD = 'bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)]';

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`bg-gray-100 rounded-lg animate-pulse ${className}`} />;
}

function CartSkeleton() {
  return (
    <div className="app-container pt-4 md:pt-6 pb-12" aria-hidden="true">
      <SkeletonBlock className="w-48 h-7 mb-6" />
      <div className="lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
        <div className="space-y-4 md:space-y-6 min-w-0">
          <SkeletonBlock className="h-20 w-full" />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] divide-y divide-gray-100">
            {[0, 1, 2].map(i => (
              <div key={i} className="p-4 flex gap-4 items-center">
                <SkeletonBlock className="w-[88px] h-[88px] md:w-24 md:h-24 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-3/4" />
                  <SkeletonBlock className="h-3 w-1/3" />
                  <SkeletonBlock className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-5 space-y-3">
            <SkeletonBlock className="h-5 w-32" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SummaryProps {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  eta: string;
  onGoCheckout?: () => void;
}

function OrderSummaryCard({ itemCount, subtotal, discount, shipping, total, eta }: SummaryProps) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-5"
      aria-live="polite"
    >
      <h3 className="text-base font-bold text-gray-900 mb-4">Order Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemCount} items)</span>
          <span className="font-medium text-gray-900">৳{subtotal.toLocaleString('en-BD')}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Coupon Discount</span>
            <span className="font-medium">-৳{discount.toLocaleString('en-BD')}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="font-medium">{shipping === 0 ? <span className="text-emerald-600">Free</span> : `৳${shipping}`}</span>
        </div>
        {subtotal > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Est. Delivery</span>
            <span className="font-medium">{eta}</span>
          </div>
        )}
        <hr className="border-gray-100" />
        <div className="flex justify-between text-base font-bold text-gray-900">
          <span>Total</span>
          <span className="text-primary">৳{total.toLocaleString('en-BD')}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-5 block w-full bg-primary text-white text-center py-3 rounded-xl font-semibold shadow-md hover:brightness-110 active:scale-[0.98] transition-all text-sm"
      >
        Proceed to Checkout ({itemCount})
      </Link>

      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5">
        {PAYMENT_METHODS.map(m => (
          <span
            key={m}
            className="text-[10px] font-bold text-gray-600 bg-gray-100 rounded-md px-2 py-1"
          >
            {m}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3" /> Secure checkout
        </span>
        <span className="flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Free returns 7 days
        </span>
      </div>
    </div>
  );
}

export default function CartPage() {
  const items = useCartStore(s => s.items);
  const removedItems = useCartStore(s => s.removedItems);
  const toggleSelectAll = useCartStore(s => s.toggleSelectAll);
  const getSelectedCount = useCartStore(s => s.getSelectedCount);
  const getShippingProgress = useCartStore(s => s.getShippingProgress);
  const undoRemoveItem = useCartStore(s => s.undoRemoveItem);
  const setCoupon = useCartStore(s => s.setCoupon);
  const clearCoupon = useCartStore(s => s.clearCoupon);
  const couponCode = useCartStore(s => s.couponCode);
  const couponDiscount = useCartStore(s => s.couponDiscount);

  const [hydrated, setHydrated] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [promoOpen, setPromoOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const lastRemovedIdRef = useRef<string | null>(null);

  useEffect(() => setHydrated(true), []);

  const { data: recommended = [], isLoading: recsLoading } = useGetProducts(0, 6);

  const shippingInfo = getShippingProgress();
  const rawSubtotal = useMemo(
    () => items.filter(i => i.selected).reduce((t, i) => t + i.product.price * i.quantity, 0),
    [items]
  );
  const itemCount = getSelectedCount();
  const discount = couponDiscount;
  const shipping = rawSubtotal > 0 && shippingInfo.remaining > 0 ? SHIPPING_FEE : 0;
  const total = Math.max(0, rawSubtotal - discount + shipping);

  const eta = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  }, []);

  const allSelected = items.length > 0 && items.every(i => i.selected);
  const selectedCount = items.filter(i => i.selected).length;

  const groupedItems = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.sellerId]) acc[item.sellerId] = [];
    acc[item.sellerId].push(item);
    return acc;
  }, {});

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
      setPromoOpen(false);
    }
  };

  if (!hydrated) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex flex-col justify-center min-h-[calc(100dvh-10rem)] app-container"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center self-center mb-4">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-xs mx-auto">
          Looks like you haven&apos;t added anything yet. Browse our deals and find something you love!
        </p>

        {removedItems.length > 0 && (
          <div className="max-w-md mx-auto w-full mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Recently Removed</h3>
            <div className="space-y-2">
              {removedItems.slice(0, 3).map(r => (
                <div key={r.item.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                  <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden shrink-0 relative">
                    <Image src={r.item.product.images[0]} alt={r.item.product.name} width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{r.item.product.name}</p>
                    <p className="text-xs text-gray-400">৳{r.item.product.price.toLocaleString('en-BD')}</p>
                  </div>
                  <button
                    onClick={() => undoRemoveItem(r.item.id)}
                    className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline shrink-0 min-h-[44px] px-2"
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
          Continue Shopping
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="app-container pt-4 md:pt-6 pb-[calc(12rem+env(safe-area-inset-bottom,0px))] md:pb-12">
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3"
      >
        Shopping Cart
        <span className="text-sm font-medium text-gray-400">({itemCount} item{itemCount === 1 ? '' : 's'})</span>
      </motion.h1>

      <div className="lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8 lg:items-start">
        {/* Left Column — Items, Summary (tablet), Coupon, Recommendations */}
        <div className="space-y-4 md:space-y-6 min-w-0">
          {/* Shipping Progress Bar */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className={`${FLOAT_CARD} p-4`}
          >
            {shippingInfo.remaining > 0 ? (
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>
                    You&apos;re <strong className="text-primary">৳{shippingInfo.remaining.toLocaleString('en-BD')}</strong> away from free delivery!
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                    style={{ width: `${shippingInfo.percent}%` }}
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

          {/* Mobile select-all header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className={`md:hidden ${FLOAT_CARD} px-4 h-14 flex items-center justify-between`}
          >
            <button
              onClick={() => toggleSelectAll(!allSelected)}
              className="flex items-center gap-3 min-h-[44px]"
              aria-label={allSelected ? 'Deselect all items' : 'Select all items'}
            >
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => {}}
                onClick={e => e.stopPropagation()}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary pointer-events-none"
                tabIndex={-1}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-gray-700">Select All</span>
            </button>
            <span className="text-xs font-medium text-primary">
              {selectedCount === 0
                ? '0 selected'
                : `${selectedCount} of ${items.length} selected`}
            </span>
          </motion.div>

          {/* Cart Items grouped by store */}
          <div className="space-y-4 md:space-y-6">
            {Object.entries(groupedItems).map(([sellerId, sellerItems]) => (
              <motion.div
                key={sellerId}
                variants={sectionReveal}
                initial="hidden"
                animate="show"
                className="md:bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-[0_4px_20px_rgba(0,0,0,0.06)] md:overflow-hidden"
              >
                {/* Seller header — floats as its own card on mobile, card header on desktop */}
                <div className={`flex items-center justify-between gap-3 px-4 md:px-5 py-3 bg-white md:bg-gray-50 rounded-2xl md:rounded-none border border-gray-100 md:border-0 shadow-[0_4px_20px_rgba(0,0,0,0.06)] md:shadow-none md:border-b md:border-gray-100`}>
                  <Link
                    href={`/store/${sellerId}`}
                    className="flex items-center gap-2 min-w-0 group"
                  >
                    <span className="material-symbols-outlined text-gray-400 text-lg">store</span>
                    <span className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {sellerItems[0].sellerName}
                    </span>
                    <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                  </Link>
                  <div className="flex items-center gap-3 md:gap-4 shrink-0">
                    <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
                      Subtotal
                      <span className="font-bold text-gray-900">
                        ৳{sellerItems
                          .reduce((t, i) => t + i.product.price * i.quantity, 0)
                          .toLocaleString('en-BD')}
                      </span>
                    </span>
                    <Link
                      href={`/store/${sellerId}`}
                      className="text-primary font-semibold text-xs hover:underline shrink-0"
                    >
                      Visit Store
                    </Link>
                  </div>
                </div>

                {/* Items — per-item floating cards on mobile (10px gaps), rows on desktop */}
                <div className="mt-2.5 md:mt-0 space-y-2.5 md:space-y-0 md:divide-y md:divide-gray-100">
                  <AnimatePresence initial={false}>
                    {sellerItems.map(item => (
                      <CartItemCard key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary — inline card, tablet only (768-1023px, between items and upsell) */}
          <div className="hidden md:block lg:hidden">
            <OrderSummaryCard
              itemCount={itemCount}
              subtotal={rawSubtotal}
              discount={discount}
              shipping={shipping}
              total={total}
              eta={eta}
            />
          </div>

          {/* Coupon Section — desktop/tablet */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className={`hidden md:block ${FLOAT_CARD} overflow-hidden`}
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
                    className="text-xs text-red-500 hover:underline font-medium min-h-[44px] px-2"
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
                    onChange={e => setCouponInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
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
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="pt-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold">You May Also Like</h2>
              <Link
                href="/categories"
                className="text-primary font-semibold flex items-center text-xs hover:underline shrink-0"
              >
                See More <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {recsLoading && recommended.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {[0, 1, 2, 4, 5, 6].slice(0, 6).map(i => (
                  <div key={i} className="bg-gray-100 rounded-xl animate-pulse aspect-[3/4]" />
                ))}
              </div>
            ) : (
              <>
                {/* Mobile: horizontally scrollable row */}
                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {recommended.map(p => (
                    <div key={p.id} className="w-[164px] shrink-0 snap-start">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
                {/* Desktop/tablet: grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommended.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </>
            )}
          </motion.section>
        </div>

        {/* Right Column — Order Summary (desktop only, sticky) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <OrderSummaryCard
              itemCount={itemCount}
              subtotal={rawSubtotal}
              discount={discount}
              shipping={shipping}
              total={total}
              eta={eta}
            />
          </div>
        </aside>
      </div>

      {/* Undo Toast */}
      <AnimatePresence>
        {showUndo && removedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-[8.5rem] md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 max-w-sm w-[calc(100%-32px)]"
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
              className="text-gray-400 hover:text-white transition-colors shrink-0 w-8 h-8 flex items-center justify-center"
              aria-label="Dismiss"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Summary Bar — mobile only (<768px), above BottomNav */}
      <div className="fixed left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0px_-4px_12px_rgba(0,0,0,0.08)] bottom-14 md:hidden pb-[env(safe-area-inset-bottom,0px)]">
        <AnimatePresence initial={false}>
          {(detailsOpen || promoOpen) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-b border-gray-100">
                <AnimatePresence initial={false}>
                  {detailsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pt-3 space-y-2 text-[13px]" aria-live="polite">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal ({itemCount} items)</span>
                          <span className="font-medium text-gray-900">৳{rawSubtotal.toLocaleString('en-BD')}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Coupon Discount</span>
                            <span className="font-medium">-৳{discount.toLocaleString('en-BD')}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span className="font-medium">{shipping === 0 ? <span className="text-emerald-600">Free</span> : `৳${shipping}`}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 pt-1.5">
                          <span>Total</span>
                          <span className="text-primary">৳{total.toLocaleString('en-BD')}</span>
                        </div>
                        <button
                          onClick={() => setPromoOpen(o => !o)}
                          className="flex items-center gap-1 text-xs font-semibold text-primary min-h-[44px] w-full justify-start"
                          aria-expanded={promoOpen}
                        >
                          <Percent className="w-3.5 h-3.5" />
                          Have a promo code?
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${promoOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <div className="pb-3">

                <AnimatePresence initial={false}>
                  {promoOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-3">
                        {couponCode ? (
                          <div className="flex items-center justify-between bg-primary/5 rounded-lg px-3 py-2.5">
                            <p className="text-[13px] font-semibold text-gray-900">
                              Coupon: <span className="text-primary">{couponCode}</span>
                              {discount > 0 && <span className="text-emerald-600 font-medium"> (-৳{discount})</span>}
                            </p>
                            <button
                              onClick={clearCoupon}
                              className="text-xs text-red-500 font-medium min-h-[44px] px-1"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex gap-2">
                              <input
                                value={couponInput}
                                onChange={e => setCouponInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all min-w-0"
                                placeholder="Enter coupon code"
                                aria-label="Coupon code"
                              />
                              <button
                                onClick={handleApplyCoupon}
                                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:brightness-110 transition-all text-sm shrink-0"
                              >
                                Apply
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {couponSuggestions.map(c => (
                                <button
                                  key={c.code}
                                  onClick={() => {
                                    setCoupon(c.code, c.discount);
                                    setCouponInput('');
                                  }}
                                  className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-gray-600 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
                                >
                                  <Percent className="w-3 h-3" />
                                  {c.code}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 px-4 py-2.5">
          <button
            onClick={() => setDetailsOpen(o => !o)}
            className="flex flex-col items-start justify-center min-w-[72px] min-h-[44px] text-left"
            aria-expanded={detailsOpen}
          >
            <span className="flex items-center gap-0.5 text-xs font-semibold text-gray-700">
              Details
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
            </span>
            <span className="text-[10px] text-gray-400">Price &amp; promo</span>
          </button>

          <div className="flex-1 min-w-0 text-right" aria-live="polite">
            <p className="text-[11px] text-gray-500 leading-none">{itemCount} item{itemCount === 1 ? '' : 's'}</p>
            <p className="text-primary font-bold text-base leading-tight">৳{total.toLocaleString('en-BD')}</p>
          </div>

          <Link
            href="/checkout"
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-md active:scale-95 transition-transform duration-150 inline-block text-sm shrink-0"
          >
            Check Out
          </Link>
        </div>
      </div>
    </div>
  );
}
