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
      {/* Desktop: 5-column grid — brand takes 1.4fr, 4 link cols take 1fr each */}
      <div className="hidden lg:grid grid-cols-[1.4fr_repeat(4,1fr)] gap-x-8">
        <FooterBrand />
        <FooterLinks />
      </div>

      {/* Tablet: brand left + 2-col links right, side by side */}
      <div className="hidden md:grid lg:hidden grid-cols-[auto_1fr] gap-8">
        <FooterBrand />
        <div className="grid grid-cols-2 gap-6">
          <FooterLinks />
        </div>
      </div>

      {/* Mobile: brand + accordion */}
      <div className="md:hidden space-y-4">
        <FooterBrand />
        <AccordionFooter />
      </div>

      {/* Strip: Download App | Accepted Payments | Delivery Partners */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-900 mb-2.5">
              Download App
            </h4>
            <div className="flex justify-center md:justify-start">
              <AppDownload />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-900 mb-2.5">
              Accepted Payments
            </h4>
            <div className="flex justify-center md:justify-start">
              <PaymentMethods />
            </div>
          </div>
          <div className="sm:col-span-2 md:col-span-1 text-center md:text-left">
            <DeliveryPartners />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-slate-200" />

      {/* Bottom bar */}
      <FooterBottom />
    </>
  );
}
