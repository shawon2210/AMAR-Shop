'use client';

import { useState } from 'react';
import Link from 'next/link';

const trustItems = [
  { icon: 'lock', title: 'Secure Payment', desc: 'SSL encrypted. bKash, Nagad, COD & cards' },
  { icon: 'local_shipping', title: 'Nationwide Delivery', desc: 'Free shipping over ৳999. 64 districts' },
  { icon: 'assignment_return', title: 'Easy Returns', desc: '7-day return & exchange. No questions' },
  { icon: 'verified', title: 'Verified Sellers', desc: '100% authentic products. Brand warranty' },
];

const footerSections = [
  {
    title: 'Customer Service',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Returns & Refunds', href: '/help/returns' },
      { label: 'Shipping Info', href: '/help/shipping' },
      { label: 'Order Tracking', href: '/orders' },
      { label: 'Payment Methods', href: '/help/payment' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Shop Categories',
    links: [
      { label: 'Electronics', href: '/category/electronics' },
      { label: 'Fashion', href: '/category/fashion' },
      { label: 'Beauty', href: '/category/beauty' },
      { label: 'Groceries', href: '/category/groceries' },
      { label: 'Home & Living', href: '/category/home' },
      { label: 'Sports', href: '/category/sports' },
    ],
  },
  {
    title: 'Seller Center',
    links: [
      { label: 'Become a Seller', href: '/seller/dashboard' },
      { label: 'Seller Dashboard', href: '/seller/dashboard' },
      { label: 'Seller Analytics', href: '/seller/analytics' },
      { label: 'Seller Finance', href: '/seller/finance' },
      { label: 'Seller Policy', href: '/seller/policy' },
      { label: 'Seller Support', href: '/support/chat' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press & Media', href: '/press' },
      { label: 'Blog', href: '/blog' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

const paymentMethods = [
  'bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard', 'COD',
];

export function Footer() {
  return (
    <footer className="bg-inverse-surface text-[#F9FAFB]/70 mt-12 md:mt-16">
      {/* ───── Trust Section ───── */}
      <div className="border-b border-white/5">
        <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="bg-white/5 rounded-2xl p-4 flex items-start gap-3 lg:hover:bg-white/[0.07] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-[#F9FAFB] font-semibold text-xs mb-0.5">{item.title}</h4>
                  <p className="text-xs text-[#F9FAFB]/50 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── Newsletter ───── */}
      <div className="border-b border-white/5">
        <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-10">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-5 md:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight">
                  Stay in the Loop
                </h3>
                <p className="text-white/70 text-xs md:text-sm mt-1 max-w-md">
                  Exclusive deals, new arrivals, and offers straight to your inbox.
                </p>
              </div>
              <div className="flex-1 w-full md:max-w-md">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 h-12 rounded-full px-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
                  />
                  <button className="h-12 px-6 rounded-full bg-white text-primary font-bold text-sm lg:hover:bg-gray-100 transition-colors whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Main Grid ───── */}
      <div className="border-b border-white/5">
        <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-1.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-lg">shopping_bag</span>
                </div>
                <span className="text-lg font-bold text-[#F9FAFB]">
                  Amar<span className="text-primary">Shop</span>
                </span>
              </Link>
              <p className="text-xs md:text-sm text-[#F9FAFB]/50 leading-6 max-w-[380px]">
                Bangladesh&apos;s premium online marketplace. Shop millions of products from trusted sellers with fast delivery and the best deals.
              </p>
            </div>

            {/* Link sections */}
            {footerSections.map((section) => (
              <FooterSection key={section.title} title={section.title} links={section.links} />
            ))}
          </div>
        </div>
      </div>

      {/* ───── Payment + Bottom ───── */}
      <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-5">
        {/* Payment methods */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
          <span className="text-xs text-[#F9FAFB]/40 font-medium shrink-0">We accept:</span>
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="px-2.5 py-1 bg-white/5 rounded-lg text-xs text-[#F9FAFB]/50 font-medium"
            >
              {method}
            </span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-white/5">
          <p className="text-xs text-[#F9FAFB]/40 text-center sm:text-left">
            &copy; {new Date().getFullYear()} AmarShop. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#F9FAFB]/40">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ───── Mobile Accordion Section ───── */
function FooterSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:block">
      {/* Desktop heading */}
      <h5 className="hidden lg:block text-[#F9FAFB] font-semibold text-sm mb-4">{title}</h5>

      {/* Mobile accordion toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden flex items-center justify-between w-full min-h-[44px] py-3 border-b border-white/5 text-[#F9FAFB] font-semibold text-sm"
      >
        {title}
        <span className={`material-symbols-outlined text-[#F9FAFB]/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Links */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:!max-h-[500px] lg:!opacity-100 ${
          open ? 'max-h-[500px] opacity-100 mt-2.5' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="space-y-2.5">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-xs md:text-sm text-[#F9FAFB]/50 hover:text-primary transition-all duration-200 block py-0.5"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
