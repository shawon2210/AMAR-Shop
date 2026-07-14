'use client';

const trustItems = [
  {
    icon: 'verified',
    title: '100% Authentic',
    desc: 'Genuine products with brand warranty on every purchase',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    accent: 'border-l-emerald-400',
    badge: 'Verified',
    badgeColor: 'bg-emerald-50 text-emerald-700',
  },
  {
    icon: 'lock',
    title: 'Secure Payments',
    desc: 'SSL encrypted. bKash, Nagad, cards & COD accepted',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    accent: 'border-l-blue-400',
    badge: 'SSL Secured',
    badgeColor: 'bg-blue-50 text-blue-700',
  },
  {
    icon: 'local_shipping',
    title: 'Nationwide Delivery',
    desc: 'Free shipping on orders over ৳999 across Bangladesh',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    accent: 'border-l-amber-400',
    badge: 'Free Shipping',
    badgeColor: 'bg-amber-50 text-amber-700',
  },
  {
    icon: 'assignment_return',
    title: 'Easy Returns',
    desc: '7-day hassle-free return policy, no questions asked',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    accent: 'border-l-purple-400',
    badge: '7-Day Policy',
    badgeColor: 'bg-purple-50 text-purple-700',
  },
];

export function LocalBanners() {
  return (
    <section>
      <div className="app-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {trustItems.map(item => (
            <div
              key={item.title}
              className={`flex items-start gap-3.5 bg-white rounded-xl border border-gray-100 border-l-4 ${item.accent} p-4 md:p-[18px] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                <span className={`material-symbols-outlined text-[24px] ${item.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {item.icon}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h4 className="text-[13px] font-bold text-gray-900 leading-tight">{item.title}</h4>
                </div>
                <p className="text-[11px] text-gray-500 leading-snug">{item.desc}</p>
                <span className={`inline-flex items-center mt-2 h-4 px-1.5 rounded text-[9px] font-bold uppercase tracking-wide ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
