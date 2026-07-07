'use client';

import { motion } from 'framer-motion';
import { staggerContainer, cardItem, fadeUp } from '@/lib/motion-variants';
import { FooterBrand } from './FooterBrand';
import { FooterLinks } from './FooterLinks';
import { AccordionFooter } from './AccordionFooter';
import { FooterBottom } from './FooterBottom';

export function Footer() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
    >
      {/* Desktop: 5-column grid — brand (320px) + 4 link columns */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        className="hidden lg:grid grid-cols-[320px_repeat(4,1fr)] gap-[72px]"
      >
        <motion.div variants={cardItem}>
          <FooterBrand />
        </motion.div>
        <motion.div variants={cardItem} className="contents">
          <FooterLinks />
        </motion.div>
      </motion.div>

      {/* Tablet: brand full width + link sections in 2 columns */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        className="hidden md:grid lg:hidden gap-10"
      >
        <motion.div variants={cardItem}>
          <FooterBrand />
        </motion.div>
        <motion.div variants={cardItem}>
          <div className="grid grid-cols-2 gap-8">
            <FooterLinks />
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile: accordion */}
      <div className="md:hidden">
        <AccordionFooter />
      </div>

      {/* Divider between grid and bottom */}
      <div className="my-14 border-t border-gray-100" />

      {/* Bottom bar */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <FooterBottom />
      </motion.div>
    </motion.div>
  );
}
