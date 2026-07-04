import Link from 'next/link';

const bannerItems = [
  {
    icon: 'local_shipping',
    title: 'Free Shipping',
    desc: 'On all orders over ৳999',
    bg: 'from-blue-500 to-blue-600',
    href: '/categories',
  },
  {
    icon: 'payments',
    title: 'Cash on Delivery',
    desc: 'Pay when you receive',
    bg: 'from-emerald-500 to-emerald-600',
    href: '#',
  },
  {
    icon: 'assignment_return',
    title: '7-Day Returns',
    desc: 'Easy return & exchange',
    bg: 'from-violet-500 to-violet-600',
    href: '#',
  },
];

export function LocalBanners() {
  return (
    <section>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
          {bannerItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`bg-gradient-to-r ${item.bg} rounded-xl p-3 sm:p-4 md:p-5 flex items-center gap-3 sm:gap-4 text-white hover:brightness-110 transition-all active:scale-[0.98]`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl sm:text-2xl">{item.icon}</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-sm sm:text-base">{item.title}</h4>
                <p className="text-[11px] sm:text-xs md:text-sm text-white/80 truncate">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}