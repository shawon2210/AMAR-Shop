'use client';

import type { CartItem } from '@/types';

export function OrderSummary({
  items,
  isProcessing,
  onPlaceOrder,
}: {
  items: CartItem[];
  isProcessing: boolean;
  onPlaceOrder: () => void;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 60;
  const total = subtotal + shipping;

  return (
    <section className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
      <h2 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">Order Summary</h2>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <img
              className="w-16 h-16 rounded-xl object-cover bg-slate-50 dark:bg-slate-900"
              src={item.product.images?.[0] || '/placeholder.png'}
              alt={item.product.name}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate font-medium text-slate-900 dark:text-white">{item.product.name}</p>
              <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              ৳{(item.product.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3 text-sm pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-medium text-slate-900 dark:text-white">৳{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Shipping</span>
          <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>
            {shipping === 0 ? 'Free' : '৳' + shipping}
          </span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-slate-900 dark:text-white">Total</span>
          <span className="text-primary">৳{total.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={isProcessing}
        className="w-full mt-6 py-4 bg-primary text-white font-semibold rounded-2xl hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </button>
    </section>
  );
}
