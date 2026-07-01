'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore, useAuthHydrated } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { api } from '@/services/api';
import type { Address } from '@/types';

const paymentMethods = [
  { id: 'bkash', name: 'bKash', icon: 'https://cdn-icons-png.flaticon.com/128/196/196578.png' },
  { id: 'nagad', name: 'Nagad', icon: 'https://cdn-icons-png.flaticon.com/128/196/196578.png' },
  { id: 'cod', name: 'Cash on Delivery', icon: 'payments' },
  { id: 'sslcommerz', name: 'SSLCommerz', icon: 'credit_card' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const allItems = useCartStore(s => s.items);
  const clearCart = useCartStore(s => s.clearCart);
  const addToast = useUIStore(s => s.addToast);
  const token = useAuthStore(s => s.token);
  const items = allItems.filter(item => item.selected);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [orderNote, setOrderNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const hydrated = useAuthHydrated();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    fullName: '',
    phone: '',
    street: '',
    city: 'Dhaka',
    area: '',
  });
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!hydrated || !token) {
      setLoadingAddresses(false);
      return;
    }
    api.get<Address[]>('/addresses')
      .then(data => {
        setAddresses(data);
        if (data.length > 0) setSelectedAddress(data[0].id);
      })
      .catch(() => addToast('Failed to load addresses', 'error'))
      .finally(() => setLoadingAddresses(false));
  }, [hydrated, token, addToast]);

  const handleAddAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.street || !newAddress.area) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    setSavingAddress(true);
    try {
      const addr = await api.post<Address>('/addresses', {
        label: newAddress.label || 'Home',
        fullName: newAddress.fullName,
        phone: newAddress.phone,
        street: newAddress.street,
        city: newAddress.city,
        area: newAddress.area,
      });
      setAddresses(prev => [...prev, addr]);
      setSelectedAddress(addr.id);
      setShowAddressForm(false);
      setNewAddress({ label: '', fullName: '', phone: '', street: '', city: 'Dhaka', area: '' });
      addToast('Address added successfully', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to add address', 'error');
    } finally {
      setSavingAddress(false);
    }
  };

  const shipping = subtotal >= 2000 ? 0 : 60;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handlePlaceOrder = async () => {
    if (!hydrated) return; // wait for zustand persist rehydration
    if (!token) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }
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
      router.push(`/orders/${order.id}`);
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
          {!showAddressForm && addresses.length > 0 && (
            <button
              onClick={() => setShowAddressForm(true)}
              className="text-primary font-label-bold text-xs"
            >
              + Add New
            </button>
          )}
        </div>
        <div className="p-md space-y-2">
          {loadingAddresses ? (
            <div className="flex items-center justify-center py-6">
              <span className="material-symbols-outlined animate-spin text-secondary">progress_activity</span>
            </div>
          ) : showAddressForm || addresses.length === 0 ? (
            <div className="space-y-3">
              <input
                type="text"
                value={newAddress.fullName}
                onChange={e => setNewAddress(p => ({ ...p, fullName: e.target.value }))}
                className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="Full Name *"
                disabled={savingAddress}
              />
              <input
                type="tel"
                value={newAddress.phone}
                onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="Phone Number *"
                disabled={savingAddress}
              />
              <input
                type="text"
                value={newAddress.street}
                onChange={e => setNewAddress(p => ({ ...p, street: e.target.value }))}
                className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="Street / Area *"
                disabled={savingAddress}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newAddress.area}
                  onChange={e => setNewAddress(p => ({ ...p, area: e.target.value }))}
                  className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="Area / Thana *"
                  disabled={savingAddress}
                />
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="City"
                  disabled={savingAddress}
                />
              </div>
              <input
                type="text"
                value={newAddress.label}
                onChange={e => setNewAddress(p => ({ ...p, label: e.target.value }))}
                className="w-full px-3 py-2 border border-outline rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="Label (e.g. Home, Office)"
                disabled={savingAddress}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddAddress}
                  disabled={savingAddress}
                  className="flex-1 py-2.5 bg-primary text-on-primary font-label-bold text-sm rounded-lg hover:brightness-110 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {savingAddress ? (
                    <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  ) : 'Save Address'}
                </button>
                {addresses.length > 0 && (
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="py-2.5 px-4 border border-outline rounded-lg text-sm text-secondary hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            addresses.map(addr => (
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
                    {addr.label && (
                      <span className="text-xs bg-surface-container px-1.5 py-0.5 rounded">{addr.label}</span>
                    )}
                  </div>
                  <p className="text-sm text-secondary mt-0.5">{addr.street}, {addr.area}, {addr.city}</p>
                  <p className="text-sm text-secondary">{addr.phone}</p>
                </div>
              </label>
            ))
          )}
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
