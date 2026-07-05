'use client';

import { useCartStore } from '@/stores/cart-store';
import { CartItemCard } from '@/components/commerce/cart-item';
import { ProductGrid } from '@/components/commerce/product-grid';
import { products } from '@/lib/data/products';
import Link from 'next/link';

export default function CartPage() {
  const items = useCartStore(s => s.items);
  const toggleSelectAll = useCartStore(s => s.toggleSelectAll);
  const getSelectedTotal = useCartStore(s => s.getSelectedTotal);
  const getSelectedCount = useCartStore(s => s.getSelectedCount);

  const allSelected = items.length > 0 && items.every(i => i.selected);
  const selectedTotal = getSelectedTotal();
  const selectedCount = getSelectedCount();

  // Group items by seller
  const groupedItems = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.sellerId]) acc[item.sellerId] = [];
    acc[item.sellerId].push(item);
    return acc;
  }, {});

  if (items.length === 0) {
    return (
      <div className="flex flex-col justify-center min-h-[calc(100dvh-10rem)] px-container-margin">
        <span className="material-symbols-outlined text-5xl sm:text-6xl text-secondary mb-4 self-center">shopping_cart</span>
        <h2 className="font-headline-md text-headline-md mb-2 text-center">Your Cart is Empty</h2>
        <p className="text-body-md text-secondary mb-6 text-center max-w-prose mx-auto">
          Looks like you haven&apos;t added anything yet. Browse our deals and find something you love!
        </p>
        <Link
          href="/"
          className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-bold hover:brightness-110 transition-all text-center self-center w-full sm:w-auto"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      <h1 className="font-headline-md text-headline-md">Shopping Cart</h1>

      {/* Cart Items grouped by store */}
      <div className="space-y-md">
        {Object.entries(groupedItems).map(([sellerId, sellerItems]) => (
          <section
            key={sellerId}
            className="bg-surface-container-lowest rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] overflow-hidden"
          >
            <div className="px-md py-sm bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-secondary text-lg">store</span>
                <span className="font-title-sm text-title-sm">{sellerItems[0].sellerName}</span>
                <span className="material-symbols-outlined text-secondary scale-75">chevron_right</span>
              </div>
              <span className="text-primary font-label-bold text-label-bold text-xs">Get Voucher</span>
            </div>

            <div className="divide-y divide-surface-variant">
              {sellerItems.map(item => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Voucher */}
      <div className="bg-surface-container-lowest p-md rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary">sell</span>
        <input
          className="flex-grow bg-surface-container border-none rounded-lg px-md py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
          placeholder="Enter Voucher Code"
          type="text"
        />
        <button className="bg-primary text-on-primary px-lg py-2 rounded-lg font-label-bold hover:brightness-110 transition-all text-sm">
          APPLY
        </button>
      </div>

      {/* Recommendations */}
      <section className="pt-md">
        <div className="flex items-center justify-between mb-md">
          <h2 className="font-headline-md text-headline-md">You May Also Like</h2>
          <button className="text-primary font-label-bold text-label-bold flex items-center text-xs">
            See More <span className="material-symbols-outlined scale-75">arrow_forward</span>
          </button>
        </div>
        <ProductGrid products={products.slice(0, 6)} columns={3} showLoadMore={false} />
      </section>

      {/* Checkout Summary Bar - fixed bottom */}
      <div className="fixed left-0 right-0 z-40 bg-surface-container-lowest shadow-[0px_-4px_12px_rgba(0,0,0,0.08)] bottom-14">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-md py-sm">
          <div className="flex items-center gap-sm">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => toggleSelectAll(!allSelected)}
              className="w-5 h-5 rounded border-outline text-primary focus:ring-primary-container"
            />
            <span className="text-body-sm font-label-bold">Select All</span>
          </div>

          <div className="flex items-center gap-lg">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <span className="text-body-sm text-secondary">Total:</span>
                <span className="text-primary font-price-lg">৳{selectedTotal.toLocaleString('en-BD')}</span>
              </div>
              <p className="text-[10px] text-on-surface-variant">Voucher Applied: -৳0</p>
            </div>

            <Link
              href="/checkout"
              className="bg-primary text-on-primary px-xl py-md rounded-lg font-title-sm text-title-sm shadow-md active:scale-95 transition-transform duration-150 inline-block"
            >
              Check Out ({selectedCount})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
