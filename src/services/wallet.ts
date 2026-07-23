'use client';

import { api } from './api';
import { useQuery } from '@tanstack/react-query';

export const WALLET_QUERY_KEYS = {
  wallet: 'wallet',
  transactions: 'wallet-transactions',
};

export interface WalletData {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  monthEarned: number;
  monthSpent: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  balance: number;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
}

async function fetchWallet(): Promise<WalletData> {
  try {
    return await api.get<WalletData>('/wallet');
  } catch {
    return { balance: 0, totalEarned: 0, totalSpent: 0, monthEarned: 0, monthSpent: 0 };
  }
}

async function fetchTransactions(type?: string): Promise<TransactionsResponse> {
  try {
    let path = '/wallet/transactions';
    if (type && type !== 'All') path += `?type=${type.toUpperCase()}`;
    return await api.get<TransactionsResponse>(path);
  } catch {
    return { transactions: [], total: 0 };
  }
}

export function useGetWallet() {
  return useQuery({
    queryKey: [WALLET_QUERY_KEYS.wallet],
    queryFn: fetchWallet,
    staleTime: 1000 * 60 * 2,
  });
}

export function useGetTransactions(type?: string) {
  return useQuery({
    queryKey: [WALLET_QUERY_KEYS.transactions, type],
    queryFn: () => fetchTransactions(type),
    staleTime: 1000 * 60,
  });
}
