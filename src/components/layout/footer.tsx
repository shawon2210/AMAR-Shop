import Link from 'next/link';

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Careers', href: '/careers' },
  { label: 'Press', href: '/press' },
  { label: 'Blog', href: '/blog' },
];

const customerService = [
  { label: 'Help Center', href: '/help' },
  { label: 'Returns & Refunds', href: '/help/returns' },
  { label: 'Shipping Info', href: '/help/shipping' },
  { label: 'Order Tracking', href: '/orders' },
  { label: 'Payment Methods', href: '/help/payment' },
];

const policyLinks = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Seller Policy', href: '/seller/policy' },
  { label: 'Whistleblower', href: '/whistleblower' },
];

const socialLinks = [
  { label: 'Facebook', icon: 'facebook', href: '#' },
  { label: 'Instagram', icon: 'instagram', href: '#' },
  { label: 'YouTube', icon: 'youtube', href: '#' },
  { label: 'Twitter', icon: 'x', href: '#' },
];

const paymentMethods = [
  { name: 'bKash', icon: '/icons/bkash.svg' },
  { name: 'Nagad', icon: '/icons/nagad.svg' },
  { name: 'Rocket', icon: '/icons/rocket.svg' },
  { name: 'Visa', icon: '/icons/visa.svg' },
  { name: 'Mastercard', icon: '/icons/mastercard.svg' },
];

const appLinks = [
  { label: 'Google Play', icon: 'play_store', href: '#' },
  { label: 'App Store', icon: 'app_store', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 pb-20 md:pb-8">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-primary">mail</span>
              <div>
                <h4 className="text-white font-semibold text-sm">Subscribe to our newsletter</h4>
                <p className="text-xs text-gray-400">Get exclusive deals & updates</p>
              </div>
            </div>
            <div className="flex-1 w-full md:max-w-md">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-11 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="h-11 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="inline-block mb-3">
              <img src="/images/logo.svg" alt="AmarShop" className="h-8 md:h-10 brightness-0 invert" />
            </Link>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4">
              Bangladesh&apos;s premium online marketplace. Shop millions of products with fast delivery, cash on delivery, and the best deals every day.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <span className="material-symbols-outlined text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Quick Links</h5>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs md:text-sm text-gray-400 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Customer Service</h5>
            <ul className="space-y-2.5">
              {customerService.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs md:text-sm text-gray-400 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Policies</h5>
            <ul className="space-y-2.5">
              {policyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs md:text-sm text-gray-400 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment & App Download */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Payment methods */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium">We accept:</span>
              <div className="flex items-center gap-2">
                {paymentMethods.map((method) => (
                  <span
                    key={method.name}
                    className="px-3 py-1.5 bg-gray-800 rounded text-xs text-gray-400 font-medium"
                  >
                    {method.name}
                  </span>
                ))}
              </div>
            </div>

            {/* App download */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium">Download app:</span>
              <div className="flex items-center gap-2">
                {appLinks.map((app) => (
                  <a
                    key={app.label}
                    href={app.href}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-gray-400">{app.icon}</span>
                    <span className="text-xs text-gray-400">{app.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-4">
          <p className="text-xs text-gray-600 text-center">
            &copy; {new Date().getFullYear()} AmarShop. All rights reserved. Bangladesh&apos;s Premium Online Marketplace.
          </p>
        </div>
      </div>
    </footer>
  );
}