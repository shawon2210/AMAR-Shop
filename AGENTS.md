<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:session-summary -->
## Session Summary

**Date:** 2026-07-07
**Task:** Redesigned footer from scratch into modular component architecture

### What was done

- **Refactored** monolithic `src/components/layout/footer.tsx` (359 lines → ~80 lines) into 8 focused components under `src/components/layout/footer/`
- **Kept intact** the Trust section and Newsletter section in the parent footer.tsx
- **Replaced** the old grid, link columns, payment badges, and copyright bar with new modular components

### Component tree

```
footer.tsx (parent — trusts + newsletter + container)
└── footer/Footer.tsx (orchestrator — grid layout + divider + bottom)
    ├── FooterBrand.tsx (logo, description, social, app download, payments)
    │   ├── SocialLinks.tsx (6 social icon circles with hover effects)
    │   ├── AppDownload.tsx (Google Play + App Store badges)
    │   └── PaymentMethods.tsx (8 payment method pills)
    ├── FooterLinks.tsx (4 link columns for desktop/tablet)
    ├── AccordionFooter.tsx (animated collapsible sections for mobile)
    └── FooterBottom.tsx (copyright + legal links)
```

### Key specs implemented

| Property | Value |
|---|---|
| Container | `max-w-[1400px] mx-auto px-5 md:px-10 lg:px-16` |
| Desktop grid | `grid-cols-[320px_repeat(4,1fr)] gap-[72px]` |
| Tablet grid | 2 columns — brand full width, links in 2-col grid |
| Social icons | 38×38 / 40×40 / 44×44 (mobile/tablet/desktop), `gap-3.5` |
| Payment badges | `h-10 px-[18px]`, rounded-full, gray-600 text |
| Dividers | `my-14` (`56px`), `border-t border-gray-100` |
| Brand logo | `w-[170px]` |
| Description | `text-base leading-[1.8] text-gray-600 max-w-[260px]` |
| Link columns | 5 columns desktop, 2 columns tablet, accordion mobile |
| Mobile accordion | AnimatePresence height animation, chevron rotation |

### Notes

- Uses inline SVGs for social icons (lucide-react v1.23 lacks brand icons)
- All motion animations use `framer-motion` with `fadeUp` / `staggerContainer` / `cardItem` variants from `@/lib/motion-variants`

---

## Session 2026-07-19 — Layout standardization & responsive refinement

### What was done

- **globals.css** — `app-container` → `max-width: 1440px` (was 1600), removed 1720/1920 overrides. Added `.admin-container` class.
- **Cart page** — Desktop grid layout (`lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]`) with sticky order summary sidebar. Fixed bottom bar now hides on `lg:`.
- **Admin sidebar** — Esc key closes sidebar on mobile. Focus trap uses combined keydown handler (Tab trap + Esc). Hamburger button ref stored in layout for focus return on close.
- **Admin search overlay** — Added `prevFocusRef` to restore focus when search closes.
- **Admin products table** — Responsive text (`text-xs sm:text-sm`), reduced padding on small screens, Category column hidden on `<lg:` viewport, tighter action buttons.
- **Search overlay (global)** — Added `prevFocusRef` to save/restore `document.activeElement` when opening/closing the overlay.

### Patterns established

- Desktop form factor uses `.app-container` (max 1440px) or `.admin-container` for page-level centering
- Tablet/mobile uses same containers with tighter `clamp()` padding
- Admin tables: `overflow-x-auto` on wrapper, `whitespace-nowrap` on cells, critical columns hidden at breakpoints
- Mobile drawers: focus trap (Tab cycle + Esc close), hamburger focus restoration on close
- Search overlays: `prevFocusRef` pattern for focus return
- Fixed bottom bars hide at `lg:` breakpoint when desktop sidebar takes over
<!-- END:session-summary -->
