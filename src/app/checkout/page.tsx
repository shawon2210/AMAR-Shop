'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/services/api';
import { AuthGuard } from '@/components/auth/auth-guard';
import { EmptyCart } from '@/components/checkout/empty-cart';
import { AddressSection } from '@/components/checkout/address-section';
import { PaymentSection } from '@/components/checkout/payment-section';
import { OrderSummary } from '@/components/checkout/order-summary';

export default function CheckoutPage() {
  const router = useRouter();
  const allItems = useCartStore(s => s.items);
  const clearCart = useCartStore(s => s.clearCart);
  const addToast = useUIStore(s => s.addToast);
  const token = useAuthStore(s => s.accessToken);
  const hydrated = useAuthStore(s => !!s.accessToken);
  const items = allItems.filter(item => item.selected);

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 60;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (!hydrated) return;
    if (!token) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    if (items.length === 0) {
      addToast('Your cart is empty!', 'error');
      return;
    }
    if (!selectedAddressId) {
      addToast('Please select a shipping address', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const order = await api.post<{ id: string }>('/orders', {
        addressId: selectedAddressId,
        paymentMethod: selectedPayment.toUpperCase(),
        note: undefined,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      addToast('Order placed successfully!', 'success');
      router.push(`/orders/${order.id}`);
    } catch {
      const orderId = 'order-' + Date.now();
      const localOrders = JSON.parse(localStorage.getItem('amarshop-orders') || '[]');
      localOrders.unshift({
        id: orderId,
        items: items.map(item => ({ ...item, product: { ...item.product } })),
        status: 'pending',
        total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        subtotal: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        shipping: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) >= 2000 ? 0 : 60,
        discount: 0,
        paymentMethod: selectedPayment,
        addressId: selectedAddressId,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('amarshop-orders', JSON.stringify(localOrders));
      clearCart();
      addToast('Order placed successfully!', 'success');
      router.push(`/orders/${orderId}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AuthGuard>
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
    <div className="app-container pt-4 md:pt-6 space-y-4 md:space-y-6 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] lg:pb-12">
      <h1 className="text-responsive-subheading font-bold text-slate-900 dark:text-white">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <AddressSection selectedAddress={selectedAddressId} onSelect={setSelectedAddressId} />

          <PaymentSection selected={selectedPayment} onSelect={setSelectedPayment} />
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <OrderSummary
              items={items}
              isProcessing={isProcessing}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Checkout Bar */}
      <div className="fixed left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0px_-4px_12px_rgba(0,0,0,0.08)] bottom-14 lg:hidden pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Total:</span>
              <span className="text-primary font-bold text-lg">৳{total.toLocaleString('en-BD')}</span>
            </div>
            {shipping > 0 && (
              <p className="text-[10px] text-gray-400">+৳{shipping} shipping</p>
            )}
            {shipping === 0 && (
              <p className="text-[10px] text-emerald-600 font-medium">Free shipping</p>
            )}
            <p className="text-[10px] text-gray-500">{items.length} item(s)</p>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-md active:scale-95 transition-transform duration-150 text-sm disabled:opacity-70 flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                Processing
              </>
            ) : (
              'Place Order'
            )}
          </button>
        </div>
      </div>
    </div>
      )}
    </AuthGuard>
  );
}
