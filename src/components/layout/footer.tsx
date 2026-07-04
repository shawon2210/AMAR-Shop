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

const socialLinks = [
  { label: 'Facebook', icon: 'facebook', href: '#' },
  { label: 'Instagram', icon: 'instagram', href: '#' },
  { label: 'YouTube', icon: 'youtube', href: '#' },
  { label: 'Twitter', icon: 'x', href: '#' },
  { label: 'LinkedIn', icon: 'linkedin', href: '#' },
];

const paymentMethods = [
  'bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard', 'COD',
];

export function Footer() {
  return (
    <footer className="bg-[#0B1220] text-gray-300 mt-12 md:mt-16">
      {/* ───── Trust Section ───── */}
      <div className="border-b border-slate-800/60">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="bg-slate-900/80 rounded-3xl p-5 md:p-6 flex items-start gap-4 hover:bg-slate-900 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-green-400 text-2xl">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-semibold text-sm md:text-base mb-1">{item.title}</h4>
                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── Newsletter ───── */}
      <div className="border-b border-slate-800/60">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-10">
          <div className="rounded-[24px] md:rounded-[32px] bg-gradient-to-r from-green-600 to-green-500 p-6 md:p-8 lg:p-10">
            <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                  Stay in the Loop
                </h3>
                <p className="text-green-100 text-sm md:text-base mt-1.5 max-w-md">
                  Get exclusive deals, new arrivals, and offers straight to your inbox.
                </p>
              </div>
              <div className="flex-1 w-full md:max-w-lg">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 h-12 md:h-14 rounded-full px-5 md:px-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
                  />
                  <button className="h-12 md:h-14 px-6 md:px-8 rounded-full bg-white text-green-700 font-bold text-sm md:text-base hover:bg-gray-100 transition-colors whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Main Grid ───── */}
      <div className="border-b border-slate-800/60">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10">
            {/* Brand column */}
            <div className="md:col-span-3 lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xl">shopping_bag</span>
                </div>
                <span className="text-xl font-bold text-white">
                  Amar<span className="text-primary">Shop</span>
                </span>
              </Link>
              <p className="text-sm text-gray-400 leading-7 max-w-[420px] mb-5">
                Bangladesh&apos;s premium online marketplace. Shop millions of products from trusted sellers with fast delivery, cash on delivery, and the best deals every day.
              </p>

              {/* Social */}
              <div className="flex items-center gap-3 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    <span className="material-symbols-outlined text-xl">{social.icon}</span>
                  </a>
                ))}
              </div>

              {/* App download */}
              <div className="flex flex-wrap gap-3">
                <a href="#" className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-2xl text-gray-300">play_store</span>
                  <div className="text-left">
                    <p className="text-[9px] text-gray-400">GET IT ON</p>
                    <p className="text-[13px] text-white font-semibold">Google Play</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-2xl text-gray-300">app_store</span>
                  <div className="text-left">
                    <p className="text-[9px] text-gray-400">DOWNLOAD ON</p>
                    <p className="text-[13px] text-white font-semibold">App Store</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Link sections */}
            {footerSections.map((section) => (
              <FooterSection key={section.title} title={section.title} links={section.links} />
            ))}
          </div>
        </div>
      </div>

      {/* ───── Payment + Bottom ───── */}
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 md:py-8">
        {/* Payment methods */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <span className="text-xs text-gray-500 font-medium shrink-0">We accept:</span>
          <div className="flex flex-wrap items-center gap-3">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="px-3 py-1.5 bg-slate-800 rounded-xl text-xs text-gray-400 font-medium hover:bg-slate-700 transition-colors"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <p className="text-xs sm:text-sm text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} <span className="text-gray-400 font-medium">AmarShop</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500">
            <Link href="/terms" className="hover:text-green-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-green-400 transition-colors">Cookies</Link>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            Made with ❤️ for Bangladesh
          </p>
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
      <h5 className="hidden lg:block text-white font-semibold text-base mb-5">{title}</h5>

      {/* Mobile accordion toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden flex items-center justify-between w-full py-3 border-b border-slate-800/60 text-white font-semibold text-sm"
      >
        {title}
        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Links */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0 lg:max-h-[500px] lg:opacity-100 lg:mt-0'
        }`}
      >
        <ul className="space-y-3 lg:space-y-3.5">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm text-gray-400 hover:text-green-400 transition-all duration-200 block py-0.5"
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
