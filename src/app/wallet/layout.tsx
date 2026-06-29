import { ReactNode } from 'react';

export default function WalletLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-surface border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-container-margin py-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
          <h1 className="font-headline-md text-headline-md">My Wallet</h1>
        </div>
      </div>
      {children}
    </div>
  );
}
