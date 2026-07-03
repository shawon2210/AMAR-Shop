"use client";

import { HeroSlider } from "./hero-slider";

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

export function HeroSection() {
  return (
    <section className="bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Mobile categories pills */}
        <div className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 pt-3 pb-2 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
          <div className="flex gap-2 w-max snap-x">
            {mobileCategories.map((cat) => (
              <a
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="snap-start flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-[#F5F7FA] border border-gray-200 text-[13px] font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {cat.icon}
                </span>
                <span>{cat.name}</span>
              </a>
            ))}
          </div>
        </div>

        <HeroSlider />
      </div>
    </section>
  );
}
