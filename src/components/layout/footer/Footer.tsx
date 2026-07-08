import { FooterBrand } from './FooterBrand';
import { FooterLinks } from './FooterLinks';
import { AccordionFooter } from './AccordionFooter';
import { FooterBottom } from './FooterBottom';

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

      {/* Divider */}
      <div className="my-8 border-t border-slate-200" />

      {/* Bottom bar */}
      <FooterBottom />
    </>
  );
}
