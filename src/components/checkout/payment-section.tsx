'use client';

const paymentMethods = [
  { id: 'bkash', name: 'bKash', icon: 'https://cdn-icons-png.flaticon.com/128/196/196578.png' },
  { id: 'nagad', name: 'Nagad', icon: 'https://cdn-icons-png.flaticon.com/128/196/196578.png' },
  { id: 'cod', name: 'Cash on Delivery', icon: 'payments' },
  { id: 'sslcommerz', name: 'SSLCommerz', icon: 'credit_card' },
];

export function PaymentSection({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-xl">payments</span>
        <h2 className="font-semibold text-slate-900 dark:text-white">Payment Method</h2>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              selected === method.id ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selected === method.id}
              onChange={() => onSelect(method.id)}
              className="w-4 h-4 text-primary"
            />
            {method.icon.startsWith('http') ? (
              <img src={method.icon} alt={method.name} className="w-8 h-8 object-contain" />
            ) : (
              <span className="material-symbols-outlined text-slate-400 text-2xl">{method.icon}</span>
            )}
            <span className="font-semibold text-sm text-slate-900 dark:text-white">{method.name}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
