import Link from 'next/link';

const trustItems = [
  {
    icon: 'verified',
    title: '100% Authentic',
    desc: 'Genuine products with brand warranty',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: 'assignment_return',
    title: 'Easy Returns',
    desc: '7-day return & exchange policy',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: 'payments',
    title: 'Secure Payments',
    desc: 'SSL encrypted checkout. bKash, Nagad, COD',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: 'local_shipping',
    title: 'Nationwide Delivery',
    desc: 'Free shipping on orders over ৳999',
    color: 'bg-purple-50 text-purple-600',
  },
];

export function LocalBanners() {
  return (
    <section>
      <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-5 flex flex-col items-center text-center gap-2 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
              </div>
              <div>
                <h4 className="font-semibold text-[11px] md:text-xs text-gray-900">{item.title}</h4>
                <p className="text-[9px] md:text-[11px] text-gray-500 mt-0.5 leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
