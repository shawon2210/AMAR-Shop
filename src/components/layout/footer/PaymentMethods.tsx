const methods = ['bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard', 'American Express', 'PayPal', 'COD'];

export function PaymentMethods() {
  return (
    <div className="text-center lg:text-left">
      <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-gray-900 mb-[18px]">
        Accepted Payments
      </p>
      <div className="flex flex-wrap justify-center lg:justify-start gap-3">
        {methods.map((method) => (
          <span
            key={method}
            className="inline-flex items-center h-10 px-[18px] rounded-full bg-[#F8FAFC] border border-gray-200 text-sm font-medium text-gray-600"
          >
            {method}
          </span>
        ))}
      </div>
    </div>
  );
}
