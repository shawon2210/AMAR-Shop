'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/services/api';

const paymentMethods = [
  { id: 'bkash', name: 'bKash', icon: 'https://cdn-icons-png.flaticon.com/128/196/196578.png' },
  { id: 'nagad', name: 'Nagad', icon: 'https://cdn-icons-png.flaticon.com/128/196/196578.png' },
  { id: 'cod', name: 'Cash on Delivery', icon: 'payments' },
  { id: 'sslcommerz', name: 'SSLCommerz', icon: 'credit_card' },
];

const addresses = [
  {
    id: 'addr-1',
    label: 'Home',
    fullName: 'Shawon Ahmed',
    phone: '017XXXXXXXX',
    street: '123, Mirpur Road',
    city: 'Dhaka',
    area: 'Mirpur-1',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office',
    fullName: 'Shawon Ahmed',
    phone: '018XXXXXXXX',
    street: '456, Gulshan Avenue',
    city: 'Dhaka',
    area: 'Gulshan-2',
    isDefault: false,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore(s => s.getSelectedItems());
  const subtotal = useCartStore(s => s.getSelectedTotal());
  const clearCart = useCartStore(s => s.clearCart);
  const addToast = useUIStore(s => s.addToast);

  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id || '');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [orderNote, setOrderNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = subtotal >= 2000 ? 0 : 60;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      addToast('Your cart is empty!', 'error');
      return;
    }
    if (!selectedAddress) {
      addToast('Please select a shipping address', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const order = await api.post<any>('/orders', {
        addressId: selectedAddress,
        paymentMethod: selectedPayment.toUpperCase(),
        note: orderNote || undefined,
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
      router.push(`/orders`);
    } catch (err: any) {
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="px-container-margin pt-md space-y-md pb-24">
        <h1 className="font-headline-md text-headline-md">Checkout</h1>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="material-symbols-outlined text-5xl text-secondary">shopping_cart</span>
          <p className="text-secondary">No items selected for checkout</p>
          <Link href="/cart" className="text-primary font-label-bold">Go to Cart</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-container-margin pt-md space-y-md pb-24">
      <h1 className="font-headline-md text-headline-md">Checkout</h1>

      {/* Shipping Address */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="px-md py-sm bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">location_on</span>
            <span className="font-title-sm text-title-sm">Shipping Address</span>
          </div>
        </div>
        <div className="p-md space-y-2">
          {addresses.map(addr => (
            <label
              key={addr.id}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedAddress === addr.id
                  ? 'border-primary bg-primary-fixed/20'
                  : 'border-outline-variant hover:border-outline'
              }`}
            >
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddress === addr.id}
                onChange={() => setSelectedAddress(addr.id)}
                className="mt-0.5"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-label-bold">{addr.fullName}</span>
                  <span className="text-xs bg-surface-container px-1.5 py-0.5 rounded">{addr.label}</span>
                </div>
                <p className="text-sm text-secondary mt-0.5">{addr.street}, {addr.area}, {addr.city}</p>
                <p className="text-sm text-secondary">{addr.phone}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Order Items Summary */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="px-md py-sm bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">shopping_bag</span>
            <span className="font-title-sm text-title-sm">Order Items ({items.length})</span>
          </div>
          <Link href="/cart" className="text-primary font-label-bold text-xs">Edit</Link>
        </div>
        <div className="p-md space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src={item.product.images?.[0] || '/placeholder.png'}
                  alt={item.product.name}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{item.product.name}</p>
                <p className="text-xs text-secondary">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm text-primary font-medium">
                ৳{(item.product.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Order Note */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="p-md">
          <label className="font-title-sm text-title-sm block mb-2">Order Note (optional)</label>
          <textarea
            value={orderNote}
            onChange={e => setOrderNote(e.target.value)}
            className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            rows={2}
            placeholder="Any special instructions for the seller..."
          />
        </div>
      </section>

      {/* Payment Method */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="px-md py-sm bg-surface-container-low flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">payments</span>
          <span className="font-title-sm text-title-sm">Payment Method</span>
        </div>
        <div className="p-md space-y-2">
          {paymentMethods.map(method => (
            <label
              key={method.id}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedPayment === method.id
                  ? 'border-primary bg-primary-fixed/20'
                  : 'border-outline-variant hover:border-outline'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selectedPayment === method.id}
                onChange={() => setSelectedPayment(method.id)}
              />
              {method.icon.startsWith('http') ? (
                <img src={method.icon} alt={method.name} className="w-6 h-6 object-contain" />
              ) : (
                <span className="material-symbols-outlined text-secondary">{method.icon}</span>
              )}
              <span className="font-label-bold text-sm">{method.name}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Price Summary */}
      <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <div className="p-md space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary">Subtotal ({items.length} items)</span>
            <span>৳{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Shipping</span>
            <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
              {shipping === 0 ? 'Free' : `৳${shipping}`}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-secondary">Voucher Discount</span>
              <span className="text-error">-৳{discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-title-sm text-title-sm border-t border-outline-variant pt-2">
            <span>Total</span>
            <span className="text-primary">৳{total.toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={isProcessing}
        className="w-full py-3 bg-primary text-on-primary font-label-bold rounded-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
            Processing...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-base">lock</span>
            Place Order — ৳{total.toLocaleString()}
          </>
        )}
      </button>
    </div>
  );
}
