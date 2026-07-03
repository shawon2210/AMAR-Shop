"use client";

import { CategoriesSidebar } from "./categories-sidebar";
import { HeroSlider } from "./hero-slider";
import { PromoCards } from "./promo-cards";

const mobileCategories = [
  { name: "Electronics", icon: "devices", slug: "electronics" },
  { name: "Fashion", icon: "checkroom", slug: "fashion" },
  { name: "Beauty", icon: "spa", slug: "beauty" },
  { name: "Groceries", icon: "local_grocery_store", slug: "groceries" },
  { name: "Appliances", icon: "kitchen", slug: "appliances" },
  { name: "Books", icon: "menu_book", slug: "books-stationery" },
  { name: "Gaming", icon: "stadia_controller", slug: "gaming" },
  { name: "Home", icon: "chair", slug: "home-living" },
  { name: "Sports", icon: "directions_bike", slug: "sports" },
  { name: "More", icon: "more_horiz", slug: "categories" },
];

const mobilePromos = [
  { icon: "flash_on", label: "Flash Sale", desc: "Up to 70% off", href: "/flash-sale" },
  { icon: "local_shipping", label: "Free Delivery", desc: "On orders ৳999+", href: "#" },
  { icon: "new_releases", label: "New Arrivals", desc: "Fresh styles", href: "/categories" },
  { icon: "storefront", label: "Become a Seller", desc: "Start selling", href: "/seller/dashboard" },
  { icon: "payments", label: "Cash on Delivery", desc: "Pay on receipt", href: "#" },
  { icon: "celebration", label: "Festival Offers", desc: "Seasonal deals", href: "#" },
];

export function HeroSection() {
  return (
    <section className="bg-[#F8FAFC]">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-5 xl:px-6">
        {/* Mobile/Tablet: horizontal categories pills */}
        <div className="lg:hidden -mx-3 sm:-mx-4 md:-mx-5 px-3 sm:px-4 md:px-5 pt-3 sm:pt-4 pb-2 sm:pb-3 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 sm:gap-2.5 w-max">
            {mobileCategories.map((cat) => (
              <a
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-3.5 sm:px-4 rounded-full bg-white border border-gray-200 text-[13px] sm:text-[14px] font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors shadow-sm whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                  {cat.icon}
                </span>
                <span className="hidden sm:inline">{cat.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Main layout: stacked on mobile, 3-column on desktop */}
        <div className="flex flex-col lg:flex-row lg:h-[460px] xl:h-[520px] 2xl:h-[580px] gap-4 sm:gap-5">
          <CategoriesSidebar />
          <div className="flex-1 min-w-0 min-h-[260px] sm:min-h-[300px] md:min-h-[360px] lg:min-h-0 h-full">
            <HeroSlider />
          </div>
          <PromoCards />
        </div>

        {/* Mobile/Tablet: promo cards horizontal snap scroll */}
        <div className="lg:hidden -mx-3 sm:-mx-4 md:-mx-5 px-3 sm:px-4 md:px-5 pb-4 sm:pb-5 mt-2 sm:mt-3 overflow-x-auto hide-scrollbar">
          <div className="flex gap-3 snap-x snap-mandatory w-max">
            {mobilePromos.map((card) => (
              <a
                key={card.label}
                href={card.href}
                className="snap-start flex items-center gap-3 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 w-[180px] sm:w-[200px] shrink-0 hover:shadow-md transition-shadow"
              >
                <span className="material-symbols-outlined text-[22px] sm:text-[24px] text-primary shrink-0">
                  {card.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] sm:text-[14px] font-semibold text-gray-800 truncate">
                    {card.label}
                  </p>
                  <p className="text-[11px] sm:text-[12px] text-gray-500 truncate">
                    {card.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
