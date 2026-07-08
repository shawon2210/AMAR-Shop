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
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = subtotal >= 2000 ? 0 : 60;
  const discount = 0;
  const total = subtotal + shipping - discount;

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
      const order = await api.post<any>('/orders', {
        addressId: selectedAddressId,
        paymentMethod: selectedPayment.toUpperCase(),
        note: undefined,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        subtotal,
        shipping,
        discount,
        total,
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
        total,
        subtotal,
        shipping,
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
    <div className="app-container pt-4 md:pt-6 space-y-4 md:space-y-6 pb-32">
      <h1 className="font-headline-md text-headline-md text-slate-900 dark:text-white">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <AddressSection selectedAddress={selectedAddressId} onSelect={setSelectedAddressId} />

          <PaymentSection selected={selectedPayment} onSelect={setSelectedPayment} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              isProcessing={isProcessing}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
      )}
    </AuthGuard>
  );
}
