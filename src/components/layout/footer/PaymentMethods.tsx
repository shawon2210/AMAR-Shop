interface PaymentMethod {
  label: string;
  svg: React.ReactNode;
}

const methods: PaymentMethod[] = [
  {
    label: 'bKash',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-[18px] h-[18px]">
        <rect width="48" height="48" rx="8" fill="#E2136E" />
        <text x="24" y="30" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui">bKash</text>
      </svg>
    ),
  },
  {
    label: 'Nagad',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-[18px] h-[18px]">
        <rect width="48" height="48" rx="8" fill="#F27A00" />
        <text x="24" y="30" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui">Nagad</text>
      </svg>
    ),
  },
  {
    label: 'Rocket',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-[18px] h-[18px]">
        <rect width="48" height="48" rx="8" fill="#CE1126" />
        <text x="24" y="30" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui">Rocket</text>
      </svg>
    ),
  },
  {
    label: 'Visa',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-[18px] h-[18px]">
        <rect width="48" height="48" rx="8" fill="#1A1F71" />
        <text x="24" y="30" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui">VISA</text>
      </svg>
    ),
  },
  {
    label: 'Mastercard',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-[18px] h-[18px]">
        <rect width="48" height="48" rx="8" fill="white" stroke="#E5E7EB" />
        <circle cx="18" cy="24" r="9" fill="#EB001B" opacity="0.8" />
        <circle cx="30" cy="24" r="9" fill="#F79E1B" opacity="0.8" />
      </svg>
    ),
  },
  {
    label: 'American Express',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-[18px] h-[18px]">
        <rect width="48" height="48" rx="8" fill="#2E77BC" />
        <text x="24" y="30" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700" fontFamily="system-ui">AMEX</text>
      </svg>
    ),
  },
  {
    label: 'PayPal',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-[18px] h-[18px]">
        <rect width="48" height="48" rx="8" fill="#003087" />
        <text x="24" y="30" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui">PayPal</text>
      </svg>
    ),
  },
  {
    label: 'COD',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-[18px] h-[18px]">
        <rect width="48" height="48" rx="8" fill="#059669" />
        <text x="24" y="30" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui">COD</text>
      </svg>
    ),
  },
];

export function PaymentMethods() {
  return (
    <div className="flex flex-row flex-wrap justify-center md:justify-start items-center gap-2">
      {methods.map((method) => (
        <span
          key={method.label}
          title={method.label}
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors"
        >
          {method.svg}
        </span>
      ))}
    </div>
  );
}
