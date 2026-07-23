'use client';

import { useState } from 'react';
import { useSellerFinance, formattedPrice } from '@/services/seller';

export default function SellerFinance() {
  const [showBalance, setShowBalance] = useState(true);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bkash');

  const { data, isLoading, error } = useSellerFinance();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-on-surface-variant">Loading finance...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
        <p className="text-on-surface-variant">Failed to load finance data</p>
      </div>
    );
  }

  const { wallet, pendingPayouts, pendingPayoutsCount, commissions, payoutHistory } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-on-surface">Finance</h1>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-on-surface-variant">Wallet Balance</span>
            <button onClick={() => setShowBalance(!showBalance)} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-lg">{showBalance ? 'visibility' : 'visibility_off'}</span>
            </button>
          </div>
          <p className="text-2xl font-bold text-on-surface">{showBalance ? formattedPrice(wallet.balance) : '••••••'}</p>
          <p className="text-xs text-green-600 font-medium mt-1">Total earned: {formattedPrice(wallet.totalEarned)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <span className="text-sm text-on-surface-variant block mb-2">Pending Payout</span>
          <p className="text-2xl font-bold text-amber-600">{formattedPrice(pendingPayouts)}</p>
          <p className="text-xs text-on-surface-variant mt-1">{pendingPayoutsCount} orders pending settlement</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <span className="text-sm text-on-surface-variant block mb-2">Total Spent</span>
          <p className="text-2xl font-bold text-on-surface">{formattedPrice(wallet.totalSpent)}</p>
        </div>
      </div>

      {/* Request Payout */}
      <div className="flex justify-center sm:justify-start">
        <button
          onClick={() => setShowPayoutModal(true)}
          className="flex items-center gap-1.5 px-6 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-lg">payments</span>
          Request Payout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission Table */}
        <div className="bg-white rounded-xl border border-surface-container-high shadow-sm">
          <div className="p-4 border-b border-surface-container-high">
            <h3 className="font-semibold text-on-surface">Commission History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-on-surface-variant text-xs border-b border-surface-container-high bg-surface-container-low">
                  <th className="p-3 font-medium">ID</th>
                  <th className="p-3 font-medium">Amount</th>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {commissions.length === 0 ? (
                  <tr><td colSpan={5} className="p-6 text-center text-on-surface-variant text-sm">No commission records</td></tr>
                ) : (
                  commissions.slice(0, 10).map((c) => (
                    <tr key={c.id} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                      <td className="p-3 font-medium text-on-surface">#{c.id}</td>
                      <td className="p-3 text-on-surface font-medium">{formattedPrice(c.amount)}</td>
                      <td className="p-3 text-on-surface-variant">{c.type}</td>
                      <td className="p-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          c.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-on-surface-variant">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-xl border border-surface-container-high shadow-sm">
          <div className="p-4 border-b border-surface-container-high">
            <h3 className="font-semibold text-on-surface">Payout History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-on-surface-variant text-xs border-b border-surface-container-high bg-surface-container-low">
                  <th className="p-3 font-medium">Amount</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory.length === 0 ? (
                  <tr><td colSpan={3} className="p-6 text-center text-on-surface-variant text-sm">No payout history</td></tr>
                ) : (
                  payoutHistory.map((p) => (
                    <tr key={p.id} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                      <td className="p-3 font-medium text-on-surface">{formattedPrice(p.amount)}</td>
                      <td className="p-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          p.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-on-surface-variant">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPayoutModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-on-surface">Request Payout</h3>
              <button onClick={() => setShowPayoutModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">Available Balance: <span className="font-bold text-on-surface">{formattedPrice(wallet.balance)}</span></p>
            <div className="mb-4">
              <label className="text-sm font-medium text-on-surface block mb-1">Amount (৳)</label>
              <input
                type="text"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="text-sm font-medium text-on-surface block mb-1">Payout Method</label>
              <div className="space-y-2">
                {[
                  { value: 'bkash', label: 'bKash', icon: 'smartphone' },
                  { value: 'nagad', label: 'Nagad', icon: 'smartphone' },
                  { value: 'bank', label: 'Bank Transfer', icon: 'account_balance' },
                ].map((m) => (
                  <label
                    key={m.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      payoutMethod === m.value ? 'border-primary bg-primary/5' : 'border-outline hover:bg-surface-container-low'
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={m.value}
                      checked={payoutMethod === m.value}
                      onChange={() => setPayoutMethod(m.value)}
                      className="accent-primary"
                    />
                    <span className="material-symbols-outlined text-on-surface-variant">{m.icon}</span>
                    <span className="text-sm text-on-surface">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPayoutModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-outline text-on-surface font-medium hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
