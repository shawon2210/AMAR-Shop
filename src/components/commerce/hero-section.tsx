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
  {
    icon: "flash_on",
    label: "Flash Sale",
    desc: "Up to 70% off",
    href: "/flash-sale",
  },
  {
    icon: "local_shipping",
    label: "Free Delivery",
    desc: "On orders ৳999+",
    href: "#",
  },
  {
    icon: "new_releases",
    label: "New Arrivals",
    desc: "Fresh styles",
    href: "/categories",
  },
  {
    icon: "storefront",
    label: "Become a Seller",
    desc: "Start selling",
    href: "/seller/dashboard",
  },
  {
    icon: "payments",
    label: "Cash on Delivery",
    desc: "Pay on receipt",
    href: "#",
  },
  {
    icon: "celebration",
    label: "Festival Offers",
    desc: "Seasonal deals",
    href: "#",
  },
];

export function HeroSection() {
  return (
    <section className="bg-[#F8FAFC]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        {/* Mobile categories pills */}
        <div className="xl:hidden overflow-x-auto hide-scrollbar -mx-4 sm:-mx-6 px-4 sm:px-6 pt-4 pb-3">
          <div className="flex gap-2 min-w-max">
            {mobileCategories.map((cat) => (
              <a
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-2 h-10 px-4 rounded-full bg-white border border-gray-200 text-[14px] font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {cat.icon}
                </span>
                {cat.name}
              </a>
            ))}
          </div>
        </div>

        {/* Desktop 3-column / Mobile single-column layout */}
        <div className="flex flex-col md:flex-row md:h-[420px] xl:h-[520px] 2xl:h-[580px] gap-5">
          <CategoriesSidebar />
          <div className="flex-1 min-w-0 min-h-[320px] md:min-h-0 h-full">
            <HeroSlider />
          </div>
          <PromoCards />
        </div>

        {/* Mobile promo cards — horizontal snap scroll */}
        <div className="xl:hidden overflow-x-auto hide-scrollbar -mx-4 sm:-mx-6 px-4 sm:px-6 pb-4 mt-3">
          <div className="flex gap-3 snap-x snap-mandatory min-w-max">
            {mobilePromos.map((card) => (
              <a
                key={card.label}
                href={card.href}
                className="snap-start flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 w-[200px] shrink-0 hover:shadow-md transition-shadow"
              >
                <span className="material-symbols-outlined text-[24px] text-primary shrink-0">
                  {card.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-gray-800 truncate">
                    {card.label}
                  </p>
                  <p className="text-[12px] text-gray-500 truncate">
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
