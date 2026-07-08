import { FooterBrand } from './FooterBrand';
import { FooterLinks } from './FooterLinks';
import { AccordionFooter } from './AccordionFooter';
import { FooterBottom } from './FooterBottom';
import { AppDownload } from './AppDownload';
import { PaymentMethods } from './PaymentMethods';
import { DeliveryPartners } from './DeliveryPartners';

export function Footer() {
  return (
    <>
      {/* Desktop: 5-column grid */}
      <div className="hidden lg:grid grid-cols-[320px_repeat(4,1fr)] gap-x-8">
        <FooterBrand />
        <FooterLinks />
      </div>

      {/* Tablet: brand + 2-column links */}
      <div className="hidden md:grid lg:hidden gap-8">
        <FooterBrand />
        <div className="grid grid-cols-2 gap-8">
          <FooterLinks />
        </div>
      </div>

      {/* Mobile: brand + accordion */}
      <div className="md:hidden space-y-6">
        <FooterBrand />
        <AccordionFooter />
      </div>

      {/* ───── Horizontal strip: Download App | Accepted Payments | Delivery Partners ───── */}
      <div className="mt-8 pt-8 border-t border-gray-100">
        <div className="flex flex-row items-start gap-3 sm:gap-6 md:gap-8 lg:gap-12">
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-900 mb-3">
              Download App
            </h4>
            <AppDownload />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-900 mb-3">
              Accepted Payments
            </h4>
            <PaymentMethods />
          </div>
          <div className="flex-1 min-w-0">
            <DeliveryPartners />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-8 border-t border-slate-200" />

      {/* Bottom bar */}
      <FooterBottom />
    </>
  );
}
