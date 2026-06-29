'use client';

import { useState } from 'react';
import Link from 'next/link';

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
  const [selectedAddress, setSelectedAddress] = useState(addresses[0].id);
  const [selectedPayment, setSelectedPayment] = useState('bkash');
  const [orderNote, setOrderNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    // Redirect to success page
  };

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
          <button className="text-primary font-label-bold text-xs">Change</button>
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
            <span className="font-title-sm text-title-sm">Order Items</span>
          </div>
          <Link href="/cart" className="text-primary font-label-bold text-xs">Edit</Link>
        </div>
        <div className="p-md space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD-D_n1BtPTJ-wZiQJqzsG6JT-a5SFFmFH24Somtcsod7etEs9LVWYLD5fhkwfvzXPm8L6_paVkdzbrcmH_pQv7tW9XshZcvZ2ms3k9WF_LCfO40AsQ4YuEcTzi_rGHBku71LCC4q2PUiR6vzKZvhodxqdQmxEexsT2vMjKXni0p_yg836pOCYt-fD-KjOz-W86BowILONAgdLMgAyyIQvHB0FW3U7LdfuI3B39oyYtirSeBEzjDkazarLqGTsxSOWeXk7t1lRSg"
                alt="Product"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">Premium Smartphone 5G - Midnight Black</p>
              <p className="text-xs text-secondary">Qty: 1</p>
            </div>
            <span className="font-price-lg text-sm text-primary">৳14,999</span>
          </div>
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
            <span className="text-secondary">Subtotal</span>
            <span>৳14,999</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Voucher Discount</span>
            <span className="text-error">-৳0</span>
          </div>
          <div className="flex justify-between font-title-sm text-title-sm border-t border-outline-variant pt-2">
            <span>Total</span>
            <span className="text-primary">৳14,999</span>
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
            Place Order — ৳14,999
          </>
        )}
      </button>
    </div>
  );
}
