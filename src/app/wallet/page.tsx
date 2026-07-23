'use client';

import { useState } from 'react';
import { useGetWallet, useGetTransactions } from '@/services/wallet';

const typeColors: Record<string, string> = {
  DEPOSIT: 'text-green-600',
  WITHDRAWAL: 'text-error',
  PURCHASE: 'text-secondary',
  REFUND: 'text-tertiary',
  CASHBACK: 'text-amber-600',
};

const typeIcons: Record<string, string> = {
  DEPOSIT: 'add_circle',
  WITHDRAWAL: 'remove_circle',
  PURCHASE: 'shopping_bag',
  REFUND: 'undo',
  CASHBACK: 'redeem',
};

const tabs = ['All', 'Deposit', 'Withdrawal', 'Purchase', 'Refund', 'Cashback'] as const;

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const { data: wallet } = useGetWallet();
  const { data: txnsData } = useGetTransactions(activeTab);

  const balance = wallet?.balance ?? 0;
  const totalEarned = wallet?.totalEarned ?? 0;
  const totalSpent = wallet?.totalSpent ?? 0;
  const monthEarned = wallet?.monthEarned ?? 0;
  const monthSpent = wallet?.monthSpent ?? 0;
  const transactions = txnsData?.transactions ?? [];

  const filteredTxns = transactions;

  return (
    <div className="app-container py-6 space-y-6 pb-24">
      {/* Balance Card */}
      <div className="bg-primary rounded-2xl p-4 text-on-primary">
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-80">Available Balance</span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">
              {showBalance ? 'visibility' : 'visibility_off'}
            </span>
          </button>
        </div>
        <div className="text-3xl font-bold mt-1 tracking-tight">
          {showBalance ? `৳${balance.toLocaleString('en-BD')}` : '৳•••••'}
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div>
            <span className="opacity-80">Total Earned</span>
            <p className="font-title-sm text-title-sm">৳{totalEarned.toLocaleString('en-BD')}</p>
          </div>
          <div>
            <span className="opacity-80">Total Spent</span>
            <p className="font-title-sm text-title-sm">৳{totalSpent.toLocaleString('en-BD')}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button className="flex flex-col items-center gap-1.5 bg-surface-container-lowest rounded-xl py-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">add</span>
          </div>
          <span className="font-semibold text-xs">Top Up</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 bg-surface-container-lowest rounded-xl py-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-error">output</span>
          </div>
          <span className="font-semibold text-xs">Withdraw</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 bg-surface-container-lowest rounded-xl py-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary">send_money</span>
          </div>
          <span className="font-semibold text-xs">Send</span>
        </button>
      </div>

      {/* Month Summary */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-title-sm text-title-sm">This Month</span>
          <span className="text-xs text-secondary">June 2026</span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600 text-lg">trending_up</span>
            <div>
              <span className="text-xs text-secondary">Earned</span>
              <p className="font-semibold text-green-600">+৳{monthEarned.toLocaleString('en-BD')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-lg">trending_down</span>
            <div>
              <span className="text-xs text-secondary">Spent</span>
              <p className="font-semibold text-error">-৳{monthSpent.toLocaleString('en-BD')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div>
        {/* Tab Filter */}
        <div className="flex overflow-x-auto hide-scrollbar gap-1 -mx-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-3 py-1.5 font-semibold text-xs rounded-full transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-secondary hover:bg-surface-container-highest'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="mt-4 space-y-1">
          {filteredTxns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="material-symbols-outlined text-5xl text-secondary mb-3">receipt_long</span>
              <p className="text-secondary text-sm">No transactions found</p>
            </div>
          ) : (
            filteredTxns.map((txn, i) => (
              <div
                key={txn.id}
                className="flex items-center gap-3 bg-surface-container-lowest rounded-xl px-md py-3 shadow-sm animate-fade-in-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${txn.amount > 0 ? 'bg-green-50' : 'bg-surface-container-highest'}`}>
                  <span className={`material-symbols-outlined text-lg ${typeColors[txn.type]}`}>
                    {typeIcons[txn.type]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{txn.description}</p>
                  <p className="text-xs text-secondary">{txn.date}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${txn.amount > 0 ? 'text-green-600' : 'text-on-surface'}`}>
                    {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString('en-BD')}
                  </p>
                  <p className="text-[10px] text-secondary">৳{txn.balance.toLocaleString('en-BD')}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
