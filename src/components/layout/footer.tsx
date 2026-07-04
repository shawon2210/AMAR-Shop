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
    <footer className="bg-surface border-t border-border mt-12 md:mt-16 text-text-secondary">

      {/* ───── Trust Section ───── */}
      <div className="border-b border-border/50">
        <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="bg-surface-container rounded-2xl p-4 flex items-start gap-3 lg:hover:bg-surface-container-high transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs text-text-primary mb-0.5">{item.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── Newsletter ───── */}
      <div className="border-b border-border/50">
        <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-10">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-5 md:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
              <div className="md:w-[360px] lg:w-[420px] shrink-0 text-center md:text-left">
                <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight">
                  Stay in the Loop
                </h3>
                <p className="text-white/75 text-xs sm:text-sm mt-1 max-w-sm mx-auto md:mx-0">
                  Exclusive deals, new arrivals, and offers straight to your inbox.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 h-12 rounded-full px-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 transition-all"
                  />
                  <button className="h-12 px-6 rounded-full bg-white text-primary font-bold text-sm lg:hover:bg-gray-100 transition-colors whitespace-nowrap shrink-0">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Main Grid ───── */}
      <div className="border-b border-border/50">
        <div className="max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-1.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-lg">shopping_bag</span>
                </div>
                <span className="text-lg font-bold text-text-primary">
                  Amar<span className="text-primary">Shop</span>
                </span>
              </Link>
              <p className="text-xs md:text-sm text-text-secondary leading-6 max-w-[380px]">
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
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
          <span className="text-xs text-text-tertiary font-medium shrink-0">We accept:</span>
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="px-2.5 py-1 bg-surface-container rounded-lg text-xs text-text-tertiary font-medium"
            >
              {method}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-border/50">
          <p className="text-xs text-text-tertiary text-center sm:text-left">
            &copy; {new Date().getFullYear()} AmarShop. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-text-tertiary">
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
      <h5 className="hidden lg:block text-text-primary font-semibold text-sm mb-4">{title}</h5>

      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden flex items-center justify-between w-full min-h-[44px] py-3 border-b border-border/50 text-text-primary font-semibold text-sm"
      >
        {title}
        <span className={`material-symbols-outlined text-text-tertiary transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

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
                className="text-xs md:text-sm text-text-secondary hover:text-primary transition-all duration-200 block py-0.5"
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
