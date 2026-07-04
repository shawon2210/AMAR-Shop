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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="bg-slate-900/80 rounded-2xl p-4 md:p-5 flex items-start gap-3 hover:bg-slate-900 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-green-400 text-xl">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-semibold text-xs md:text-sm mb-0.5">{item.title}</h4>
                  <p className="text-[11px] md:text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── Newsletter ───── */}
      <div className="border-b border-slate-800/60">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 md:py-8">
          <div className="rounded-[20px] md:rounded-[24px] bg-gradient-to-r from-green-600 to-green-500 p-5 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                  Stay in the Loop
                </h3>
                <p className="text-green-100 text-xs md:text-sm mt-1 max-w-md">
                  Exclusive deals, new arrivals, and offers straight to your inbox.
                </p>
              </div>
              <div className="flex-1 w-full md:max-w-md">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 h-11 md:h-12 rounded-full px-4 md:px-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs md:text-sm placeholder-gray-300/70 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
                  />
                  <button className="h-11 md:h-12 px-5 md:px-6 rounded-full bg-white text-green-700 font-bold text-xs md:text-sm hover:bg-gray-100 transition-colors whitespace-nowrap">
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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Brand column */}
            <div className="md:col-span-3 lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-1.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-lg">shopping_bag</span>
                </div>
                <span className="text-lg font-bold text-white">
                  Amar<span className="text-primary">Shop</span>
                </span>
              </Link>
              <p className="text-xs md:text-sm text-gray-400 leading-6 max-w-[380px] mb-4">
                Bangladesh&apos;s premium online marketplace. Shop millions of products from trusted sellers with fast delivery and the best deals.
              </p>

              {/* Social */}
              <div className="flex items-center gap-2 mb-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    <span className="material-symbols-outlined text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>

              {/* App download */}
              <div className="flex flex-wrap gap-2">
                <a href="#" className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-xl text-gray-300">play_store</span>
                  <div className="text-left">
                    <p className="text-[8px] text-gray-400">GET IT ON</p>
                    <p className="text-xs text-white font-semibold">Google Play</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-xl text-gray-300">app_store</span>
                  <div className="text-left">
                    <p className="text-[8px] text-gray-400">DOWNLOAD ON</p>
                    <p className="text-xs text-white font-semibold">App Store</p>
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
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-5 md:py-6">
        {/* Payment methods */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <span className="text-[11px] text-gray-500 font-medium shrink-0">We accept:</span>
          <div className="flex flex-wrap items-center gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 bg-slate-800 rounded-lg text-[11px] text-gray-400 font-medium hover:bg-slate-700 transition-colors"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <p className="text-xs text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} <span className="text-gray-400 font-medium">AmarShop</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <Link href="/terms" className="hover:text-green-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-green-400 transition-colors">Cookies</Link>
          </div>
          <p className="text-xs text-gray-600">
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
      <h5 className="hidden lg:block text-white font-semibold text-sm mb-4">{title}</h5>

      {/* Mobile accordion toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden flex items-center justify-between w-full py-2.5 border-b border-slate-800/60 text-white font-semibold text-sm"
      >
        {title}
        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Links */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[500px] opacity-100 mt-2.5' : 'max-h-0 opacity-0 lg:max-h-[500px] lg:opacity-100 lg:mt-0'
        }`}
      >
        <ul className="space-y-2 lg:space-y-3">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-xs md:text-sm text-gray-400 hover:text-green-400 transition-all duration-200 block py-0.5"
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
