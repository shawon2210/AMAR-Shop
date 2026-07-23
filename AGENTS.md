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
---

## Session 2026-07-23 — Mock data eradication & placeholder replacement

### What was done

- **Fixed 39 mock-data admin pages** — Replaced hardcoded fallback arrays in `catch` blocks with empty data (`[]` or zeroed objects). These pages now show `AdminEmpty` when APIs are unavailable instead of silently displaying fake data.
- **Fixed 8 placeholder admin pages** (overview, fulfillment/{courier,pickup,tracking}, realtime, warehouse/{inbound,inventory,pick-lists}) — Added full `useState`/`useEffect` API call infrastructure, proper loading/error/empty state handling, removed all hardcoded data.
- **Fixed 5 public/seller placeholder pages** — Admin homepage (`src/app/admin/homepage/page.tsx`): full CMS section editor with drag-reorder. Contact page (`src/app/contact/page.tsx`): validated form + info sidebar. Cookie policy (`src/app/cookies/page.tsx`): 8-section server component. Seller policy (`src/app/seller/policy/page.tsx`): 11-section policy page. Seller root (`src/app/seller/page.tsx`): created with dashboard redirect.
- **Bug fixes** — Fixed 4 pages that used `useState(fn())` instead of `useEffect` for data loading (`attributes`, `shipping`, `tags`, `vendors`, `taxes`).

### Files changed

| Category | Count | Files |
|---|---|---|
| Admin mock-data catch fix | 39 | accounting, activity, analytics, api-keys, attributes, audit-logs, backups, blogs, brands, campaigns, collections, customers/{addresses,segments,wishlists}, delivery-zones, email-campaigns, faq, integrations, jobs, logs, monitoring, orders/{refunds,returns}, payouts, promotions, push-notifications, referral-system, revenue, security, seo, sellers/{analytics,support,withdraw-requests}, shipping, tags, taxes, teams, transactions, vendors |
| Admin placeholder → API | 8 | overview, fulfillment/{courier,pickup,tracking}, realtime, warehouse/{inbound,inventory,pick-lists} |
| Public/seller placeholders | 5 | admin/homepage, contact, cookies, seller/policy, seller/{page.tsx new} |

### Patterns established

- Mock data replacement: empty-array fallback in catch + `AdminLoading`/`AdminError`/`AdminEmpty` from `@/components/ui/admin-states`
- Data fetching pattern: `useState<T>([])` + `useState(true)` + `useState<string|null>(null)` + `useEffect` with `api.get()`, `catch(e) { setData([]) }`
- Placeholder pages: never show "coming soon" — either implement with API or show empty state
<!-- END:session-summary -->
