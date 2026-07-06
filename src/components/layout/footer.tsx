'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';

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

const socialLinks = [
  { icon: 'facebook', label: 'Facebook', href: '#' },
  { icon: 'youtube_activity', label: 'YouTube', href: '#' },
  { icon: 'instagram', label: 'Instagram', href: '#' },
  { icon: 'X', label: 'X (Twitter)', href: '#' },
];

const appStores = [
  { label: 'Google Play', icon: 'play_store', href: '#' },
  { label: 'App Store', icon: 'apple', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 md:mt-16">

      {/* ───── Trust Section ───── */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 flex items-start gap-3 hover:border-primary/20 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl md:text-2xl">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 mb-0.5">{item.title}</h4>
                  <p className="text-xs md:text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── Newsletter ───── */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-800 px-6 py-14 md:px-12 lg:px-16 shadow-lg hover:shadow-[0_30px_80px_rgba(16,185,129,0.35)] transition-shadow duration-500">

            {/* Background Glows */}
            <div className="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-white/10 blur-[120px]" />
            <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-lime-300/10 blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[150px]" />

            {/* Floating Orbs */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="absolute top-12 right-16 h-24 w-24 rounded-full bg-white/10 blur-xl hidden sm:block"
            />
            <motion.div
              animate={{ y: [0, 18, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
              className="absolute bottom-10 left-16 h-20 w-20 rounded-full bg-lime-200/10 blur-xl hidden sm:block"
            />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[420px_1fr] lg:items-center">

              {/* Left */}
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-emerald-50 backdrop-blur-md">
                  ✨ Stay Updated
                </span>
                <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                  Stay in the Loop
                </h2>
                <p className="mt-4 max-w-md text-sm md:text-base leading-relaxed md:leading-8 text-emerald-100">
                  Get exclusive deals, early product launches, seasonal offers, and useful updates delivered directly to your inbox.
                </p>
              </motion.div>

              {/* Right */}
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                  <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-200" size={20} />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="h-14 md:h-16 w-full rounded-2xl border border-white/10 bg-white/10 pl-14 pr-4 text-white text-sm placeholder:text-emerald-100 outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/20"
                      />
                    </div>
                    <button
                      type="submit"
                      className="group relative overflow-hidden h-14 md:h-16 flex items-center justify-center gap-2 rounded-2xl bg-white px-8 font-semibold text-emerald-700 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-emerald-50"
                    >
                      <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
                      <span className="relative">Subscribe</span>
                      <ArrowRight size={18} className="relative transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </form>
                  <p className="mt-4 text-xs md:text-sm text-emerald-100/80">
                    No spam &bull; Unsubscribe anytime &bull; We respect your privacy
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* ───── Main Grid ───── */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {/* Brand column */}
            <div className="md:col-span-1">
              <Link href="/" className="inline-flex items-center mb-4">
                <img src="/images/amarshop-logo.png" alt="AmarShop" className="w-[160px] md:w-[180px] lg:w-[200px] h-auto object-contain" />
              </Link>
              <p className="text-sm text-gray-500 leading-6 max-w-[360px]">
                Bangladesh&apos;s premium online marketplace. Shop millions of products from trusted sellers with fast delivery and the best deals.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-2 mt-5">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all duration-200"
                    aria-label={social.label}
                  >
                    <span className="material-symbols-outlined text-lg">{social.icon}</span>
                  </Link>
                ))}
              </div>
              {/* App badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {appStores.map((store) => (
                  <Link
                    key={store.label}
                    href={store.href}
                    className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <span className="material-symbols-outlined text-base">{store.icon}</span>
                    {store.label}
                  </Link>
                ))}
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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
          <span className="text-xs text-gray-400 font-medium shrink-0">We accept:</span>
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="px-2.5 py-1 bg-gray-100 rounded-md text-xs text-gray-500 font-medium"
            >
              {method}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            &copy; {new Date().getFullYear()} AmarShop. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-400">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
            <Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
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
      <h5 className="hidden lg:block text-gray-900 font-semibold text-sm mb-4">{title}</h5>

      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden flex items-center justify-between w-full min-h-[48px] py-3 text-gray-900 font-semibold text-sm"
        aria-expanded={open}
      >
        {title}
        <span
          className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 lg:!max-h-[500px] lg:!opacity-100 ${
          open ? 'max-h-[500px] opacity-100 pb-3' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="space-y-2.5">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm text-gray-500 hover:text-primary transition-colors duration-200 block py-0.5"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Separator on mobile */}
      <div className="lg:hidden border-t border-gray-100 mt-0" />
    </div>
  );
}
