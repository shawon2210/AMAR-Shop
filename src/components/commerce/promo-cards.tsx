"use client";

const promos = [
  {
    icon: "flash_on",
    label: "Flash Sale",
    desc: "Up to 70% off — today only",
    href: "/flash-sale",
  },
  {
    icon: "local_shipping",
    label: "Free Delivery",
    desc: "On orders over ৳999",
    href: "#",
  },
  {
    icon: "new_releases",
    label: "New Arrivals",
    desc: "Fresh styles & latest gadgets",
    href: "/categories",
  },
  {
    icon: "storefront",
    label: "Become a Seller",
    desc: "Reach millions of customers",
    href: "/seller/dashboard",
  },
  {
    icon: "payments",
    label: "Cash on Delivery",
    desc: "Pay when you receive",
    href: "#",
  },
  {
    icon: "celebration",
    label: "Festival Offers",
    desc: "Special deals every season",
    href: "#",
  },
];

export function PromoCards() {
  return (
    <aside className="hidden xl:flex flex-col gap-3 w-[360px] shrink-0 h-full overflow-y-auto hide-scrollbar">
      {promos.map((card) => (
        <a
          key={card.label}
          href={card.href}
          className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-all flex-none"
        >
          <span className="material-symbols-outlined text-[28px] text-primary shrink-0">
            {card.icon}
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-gray-800 truncate">
              {card.label}
            </p>
            <p className="text-[13px] text-gray-500 truncate">{card.desc}</p>
          </div>
        </a>
      ))}
    </aside>
  );
}
