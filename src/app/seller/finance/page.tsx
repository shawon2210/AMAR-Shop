'use client';

import { useState } from 'react';

const commissionHistory = [
  { id: 'COM-001', order: 'ORD-7821', amount: '৳1,29,999', commission: '৳12,999', rate: '10%', status: 'Paid', date: '2026-06-28' },
  { id: 'COM-002', order: 'ORD-7820', amount: '৳72,500', commission: '৳7,250', rate: '10%', status: 'Paid', date: '2026-06-27' },
  { id: 'COM-003', order: 'ORD-7819', amount: '৳25,600', commission: '৳2,560', rate: '10%', status: 'Pending', date: '2026-06-27' },
  { id: 'COM-004', order: 'ORD-7818', amount: '৳35,200', commission: '৳3,520', rate: '10%', status: 'Pending', date: '2026-06-26' },
];

const payoutHistory = [
  { id: 'PO-001', amount: '৳85,000', method: 'bKash', account: '017******45', status: 'Completed', date: '2026-06-15' },
  { id: 'PO-002', amount: '৳1,20,000', method: 'Bank Transfer', account: '****4521', status: 'Completed', date: '2026-06-01' },
  { id: 'PO-003', amount: '৳65,000', method: 'Nagad', account: '018******78', status: 'Processing', date: '2026-05-15' },
];

export default function SellerFinance() {
  const [showBalance, setShowBalance] = useState(true);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bkash');

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
          <p className="text-2xl font-bold text-on-surface">{showBalance ? '৳2,45,800' : '••••••'}</p>
          <p className="text-xs text-green-600 font-medium mt-1">+৳18,200 this week</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <span className="text-sm text-on-surface-variant block mb-2">Pending Payout</span>
          <p className="text-2xl font-bold text-amber-600">৳45,200</p>
          <p className="text-xs text-on-surface-variant mt-1">3 orders pending settlement</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm">
          <span className="text-sm text-on-surface-variant block mb-2">Revenue This Month</span>
          <p className="text-2xl font-bold text-on-surface">৳3,28,500</p>
          <p className="text-xs text-green-600 font-medium mt-1">+15% vs last month</p>
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
            <h3 className="font-semibold text-on-surface">Commission Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-on-surface-variant text-xs border-b border-surface-container-high bg-surface-container-low">
                  <th className="p-3 font-medium">Order</th>
                  <th className="p-3 font-medium">Amount</th>
                  <th className="p-3 font-medium">Commission</th>
                  <th className="p-3 font-medium">Rate</th>
                  <th className="p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {commissionHistory.map((c) => (
                  <tr key={c.id} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                    <td className="p-3 font-medium text-on-surface">{c.order}</td>
                    <td className="p-3 text-on-surface">{c.amount}</td>
                    <td className="p-3 text-on-surface font-medium">{c.commission}</td>
                    <td className="p-3 text-on-surface-variant">{c.rate}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        c.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
                  <th className="p-3 font-medium">Method</th>
                  <th className="p-3 font-medium">Account</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory.map((p) => (
                  <tr key={p.id} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                    <td className="p-3 font-medium text-on-surface">{p.amount}</td>
                    <td className="p-3 text-on-surface">{p.method}</td>
                    <td className="p-3 text-on-surface-variant font-mono text-xs">{p.account}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        p.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-on-surface-variant">{p.date}</td>
                  </tr>
                ))}
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
            <p className="text-sm text-on-surface-variant mb-4">Available Balance: <span className="font-bold text-on-surface">৳2,45,800</span></p>
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
