import { ReactNode } from 'react';

export default function WalletLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="app-container py-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
          <h1 className="text-lg font-bold">My Wallet</h1>
        </div>
      </div>
      {children}
    </div>
  );
}
