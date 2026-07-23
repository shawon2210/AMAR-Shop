import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy - AmarShop',
  description: 'How AmarShop uses cookies and similar technologies on our platform.',
};

const cookieTypes = [
  { name: 'Essential', icon: 'lock', description: 'Required for basic site functionality including page navigation, secure areas, and shopping cart operations.', alwaysOn: true },
  { name: 'Analytics', icon: 'analytics', description: 'Help us understand how visitors interact with our site by collecting anonymous usage data.', alwaysOn: false },
  { name: 'Functional', icon: 'tune', description: 'Enable enhanced functionality such as remembering your preferences, language, and region.', alwaysOn: false },
  { name: 'Advertising', icon: 'ads_click', description: 'Used to deliver relevant advertisements and track campaign effectiveness across platforms.', alwaysOn: false },
  { name: 'Performance', icon: 'speed', description: 'Cache and load-balancing cookies that help improve site speed and user experience.', alwaysOn: true },
];

export default function CookiesPage() {
  return (
    <div className="app-container py-6 pb-24">
      <nav className="flex items-center gap-1 text-xs text-secondary mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-on-surface">Cookie Policy</span>
      </nav>

      <h1 className="text-responsive-subheading font-bold mb-2">Cookie Policy</h1>
      <p className="text-sm text-on-surface-variant mb-8">Last updated: 1 July 2026</p>

      <div className="max-w-4xl space-y-6">
        <section className="bg-white rounded-xl border border-[#eee] p-6">
          <h2 className="text-lg font-semibold text-on-surface mb-3">What Are Cookies</h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-3">
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, enhance user experience, and provide information to website owners.
            </p>
            <p>
              Cookies can be &quot;first-party&quot; (set by AmarShop) or &quot;third-party&quot; (set by services we integrate with). They may be temporary (session cookies) or persist for a defined period (persistent cookies).
            </p>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-[#eee] p-6">
          <h2 className="text-lg font-semibold text-on-surface mb-4">How We Use Cookies</h2>
          <p className="text-sm text-on-surface-variant mb-4">
            We use cookies for the following purposes:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-[#eee] rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-[#fafafa] text-left text-xs uppercase tracking-wider text-[#888]">
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium">Purpose</th>
                  <th className="p-3 font-medium">Always Active</th>
                </tr>
              </thead>
              <tbody>
                {cookieTypes.map((ct) => (
                  <tr key={ct.name} className="border-t border-[#f5f5f5]">
                    <td className="p-3 font-medium text-on-surface">{ct.name}</td>
                    <td className="p-3 text-on-surface-variant text-xs">{ct.description}</td>
                    <td className="p-3">
                      {ct.alwaysOn ? (
                        <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          Yes
                        </span>
                      ) : (
                        <span className="text-[#888] text-xs">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-[#eee] p-6">
          <h2 className="text-lg font-semibold text-on-surface mb-3">Types of Cookies We Use</h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-3">
            <h3 className="font-medium text-on-surface">Session Cookies</h3>
            <p>
              These are temporary cookies that expire when you close your browser. They are essential for the functioning of our shopping cart and checkout process.
            </p>
            <h3 className="font-medium text-on-surface">Persistent Cookies</h3>
            <p>
              These remain on your device for a set period or until you delete them. They help us remember your preferences, login status, and past actions when you return to our site.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-[#eee] p-6">
          <h2 className="text-lg font-semibold text-on-surface mb-3">Third-Party Cookies</h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-3">
            <p>
              We partner with third-party service providers who may set their own cookies on your device. These include:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Payment gateways (SSL session cookies for secure transactions)</li>
              <li>Analytics services (Google Analytics, Facebook Pixel) for usage tracking</li>
              <li>Advertising networks for personalised ad delivery</li>
              <li>Social media platforms for content sharing and embedded feeds</li>
            </ul>
            <p className="mt-3">
              These third parties have their own privacy and cookie policies. We encourage you to review them.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-[#eee] p-6">
          <h2 className="text-lg font-semibold text-on-surface mb-3">Your Cookie Choices</h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-3">
            <p>
              When you first visit AmarShop, you will see a cookie consent banner. You can choose to accept all cookies, reject non-essential cookies, or customise your preferences. Essential cookies cannot be disabled as they are necessary for the site to function.
            </p>
            <p>
              You can change your cookie preferences at any time through your browser settings or by clicking the cookie preferences link in our website footer.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-[#eee] p-6">
          <h2 className="text-lg font-semibold text-on-surface mb-3">Managing Cookies in Your Browser</h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-3">
            <p>Most web browsers allow you to control cookies through their settings. Here is how to manage cookies in popular browsers:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Google Chrome:</strong> Settings &rarr; Privacy and Security &rarr; Cookies and other site data</li>
              <li><strong>Mozilla Firefox:</strong> Options &rarr; Privacy & Security &rarr; Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences &rarr; Privacy &rarr; Cookies and website data</li>
              <li><strong>Microsoft Edge:</strong> Settings &rarr; Cookies and site permissions &rarr; Cookies</li>
            </ul>
            <p className="mt-3">
              Please note that disabling certain cookies may affect the functionality and performance of our website.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-[#eee] p-6">
          <h2 className="text-lg font-semibold text-on-surface mb-3">Updates to This Policy</h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-3">
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business practices. When we make changes, we will update the &quot;Last updated&quot; date at the top of this page.
            </p>
            <p>
              We encourage you to review this policy periodically to stay informed about how we use cookies.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-[#eee] p-6">
          <h2 className="text-lg font-semibold text-on-surface mb-3">Contact Us</h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-3">
            <p>
              If you have any questions about our use of cookies or this policy, please contact us.
            </p>
            <p>
              <Link href="/contact" className="text-primary font-medium hover:underline">Contact our support team &rarr;</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}