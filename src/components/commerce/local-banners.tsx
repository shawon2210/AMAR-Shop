'use client';

const trustItems = [
  {
    icon: 'verified',
    title: '100% Authentic',
    desc: 'Genuine products with brand warranty',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: 'assignment_return',
    title: 'Easy Returns',
    desc: '7-day return & exchange policy',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: 'payments',
    title: 'Secure Payments',
    desc: 'SSL encrypted checkout. bKash, Nagad, COD',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: 'local_shipping',
    title: 'Nationwide Delivery',
    desc: 'Free shipping on orders over ৳999',
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

export function LocalBanners() {
  return (
    <section>
      <div className="app-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-gray-200/50 bg-white/70 backdrop-blur-xl p-5 md:p-6 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${item.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-2xl ${item.iconColor}`}>
                  {item.icon}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
