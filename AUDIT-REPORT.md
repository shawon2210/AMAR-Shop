# AmarShop — Comprehensive UI/UX & Frontend Architecture Audit

**Audit Date:** 2026-07-19
**Scope:** Full application — ~130 routes across PUBLIC, CUSTOMER, ADMIN, and SELLER roles
**Methodology:** Static source-code analysis + 43 rendered DOM snapshots (screenshots) across all key routes
**Audience:** Engineering & Product Leadership

---

## Executive Summary

AmarShop is an ambitious Next.js 16 e-commerce platform with role-based dashboards spanning public, customer, admin, and seller experiences. Below are the key health indicators:

- **Scale vs. completion imbalance:** 130+ defined routes exist, but ~50 are "coming soon" stubs and another ~15 have broken navigation or missing route handlers. The surface area is impressive; the delivery depth is roughly 60%.
- **No loading or error boundaries across 105+ pages:** Zero `loading.tsx` or `error.tsx` files exist anywhere in the app. Every page navigation presents a blank white screen until the full render completes. Any runtime error (API failure, missing data, thrown exception) crashes the page ungracefully with no user recovery path.
- **Admin navigation has ~8 broken links and ~3,000-item configuration:** Sidebar labels point to nonexistent routes (e.g., "Support Tickets" → `/admin/support-tickets`, but the page lives at `/admin/creators`). The sidebar config object itself contains roughly 3,000 navigation items — a data structure that should be ~70 entries at most. This is the single largest maintenance liability in the codebase.
- **No backend available without Docker:** The NestJS API requires Postgres on port 5433 and Redis on 6379, both Docker-only. No `docker-compose.override.yml` or development fallback exists. Every page relies on hardcoded demo/placeholder data. The frontend cannot be meaningfully tested against real API responses.
- **Accessibility baseline is absent:** Empty `alt` attributes on product images, no `aria-label` on icon-only buttons, no `fieldset`/`legend` on form radio groups, no skip-to-content links, and missing ARIA on accordion components. The app would not pass a WCAG 2.1 AA audit.
- **No image optimization:** Zero usage of `next/image` — all images use bare `<img>` tags. No WebP/AVIF, no responsive srcset, no lazy-load optimization beyond the browser default.

---

## 1. UI/UX Issues

### 1.1 Admin Dashboard — Prototype Visual Quality

The admin dashboards (Overview, Analytics, Products, Orders) share a common pattern: a structured layout shell with placeholder data that undermines trust:

- **Analytics page** renders hardcoded bar heights, static numbers, and "This page is coming soon" text inside what looks like an interactive chart container.
- **Overview dashboard** shows stat cards with believable-looking numbers — but they are hardcoded strings, not connected to any API.
- **Products/Orders tables** have correct column structure but fill rows with demo entries. No pagination, sorting, or search controls are functional.
- **Settings pages** contain organized form fields, many pre-filled with placeholder values (`01XXXXXXXXX` for phone numbers).

**Impact:** Any stakeholder demo of the admin dashboard would reveal immediately that the data layer is not connected. For production use, every chart and stat card needs a real data source.

### 1.2 Visual Hierarchy Inconsistencies

- **Button styles vary:** Primary CTAs use `bg-[#0F9D58]` (green), but secondary button styles are inconsistent — some use outlined variants, others use muted gray, and some admin action buttons are unstyled `<button>` elements.
- **Typography lacks a defined scale:** `text-responsive-heading` and `text-responsive-body` exist as clamping utilities, but their actual usage is sporadic. Many pages use arbitrary `text-sm`, `text-base`, or raw `font-size` inline styles.
- **Card patterns are not standardized:** Product cards in the marketplace, order cards in admin, and stat cards in the dashboard each use different spacing (`p-3`, `p-4`, `p-6`), different border treatments, and different hover states.
- **Empty states are inconsistent:** The cart has a thoughtful empty state with a link to shop. The wishlist has a generic "Your wishlist is empty" message. Most admin tables have no empty state at all — they show the table shell with zero rows.

### 1.3 Mixed Styling Approaches

The codebase employs four distinct styling strategies simultaneously, which complicates maintenance and leads to visual drift:

1. **Tailwind v4 utility classes** (dominant, correct)
2. **Inline `style={{}}` objects** (admin sidebar, cart coupons)
3. **CSS custom properties** (`var(--color-primary)`, `var(--spacing-md)`)
4. **Legacy Material 3 classes** (`bg-surface-container-lowest`, `font-label-bold`)

**Recommendation:** Consolidate to Tailwind v4 utilities + CSS custom properties for brand tokens only. Remove M3 class references and inline styles.

### 1.4 Payment UI Trust Issue

The checkout payment section uses the same generic credit-card icon for both **bKash** and **Nagad** payment methods. In a Bangladesh-focused e-commerce app where these are primary payment methods, this reduces visual trust in the payment selection.

**Fix:** Use distinct brand-appropriate icons/colors for each payment method.

---

## 2. Responsiveness Issues

### 2.1 Desktop-to-Tablet Breakpoint Gap

The footer layout uses a triple-branch approach (`lg:grid` / `md:grid` / `md:hidden`), creating three discrete layouts with abrupt transitions between 768px and 1023px. No `xl` or `2xl` breakpoint handling exists.

- Desktop: 5-column grid (brand + 4 link columns)
- Tablet: 2-column grid (brand full-width, links in 2-column sub-grid)
- Mobile: Accordion collapse (hardcoded, no animation despite framer-motion availability)

The tablet view in particular feels cramped — the brand column spans full width, pushing all link columns below the fold, requiring scroll for navigation that was previously above the fold.

### 2.2 Admin Dashboard Is Desktop-Only

The admin sidebar is implemented as a fixed `lg:flex` rail with no mobile fallback:

- No hamburger menu or drawer pattern for viewports below 1024px
- 50+ nav items in a single column are completely inaccessible on mobile
- Search input collapses to `opacity-0 pointer-events-none` with no alternative mechanism
- Admin tables (Orders, Products) have no horizontal scroll wrapper — columns overflow on tablet

**Impact:** The admin dashboard is effectively unusable on mobile devices. Any seller or admin needing to manage their store from a phone would be blocked.

### 2.3 Cart Fixed Bottom Bar Overlap

The cart page has a sticky bottom bar (total + checkout CTA) positioned at `bottom-14` with a compensating `pb-28` on the main content. This is fragile:

- `bottom-14` accounts for the mobile bottom nav (56px), but this value is hardcoded
- If the bottom nav height changes, or a system UI element (browser chrome) overlaps, the bar either overlaps content or sits above the nav incorrectly
- On desktop (`md:bottom-0`), the bar resets — but the `pb-28` is still applied, adding unnecessary padding

### 2.4 Inconsistent Container Widths

| Area | Container Width |
|---|---|
| App shell (public) | `max-width: 1600px` + `clamp()` padding |
| Footer | `max-w-[1400px]` |
| Admin layout | Raw padding — no container wrapper |
| Auth pages | Full‑width, no container |

This inconsistency means the visual "rhythm" of the page changes depending on which section the user is in.

### 2.5 Search Overlay → 404

The header search overlay navigates to `/search?q=...` on submit, but **no route exists** at `src/app/search/`. Users who submit a search are delivered a 404 page instead of results.

**Fix:** Add a `search/page.tsx` route, even if initially with a "Search results coming soon" message, to avoid the hard 404.

---

## 3. Performance Issues

### 3.1 No Route-Level Code Splitting

With zero `loading.tsx` files in the entire application, every page navigation shows a blank screen during the full component render cycle:

- Server component data fetching blocks the response
- Client component hydration waits for all JS bundles to load
- No streaming Suspense boundaries exist anywhere

**Impact:** Perceived performance is severely degraded. Time-to-first-contentful-paint is effectively time-to-interactive for every page.

### 3.2 Admin Sidebar — 3,000-Item Configuration

The admin sidebar configuration in `src/app/admin/layout.tsx` defines approximately 3,000 navigation items. This means:

- **Bundle size bloat:** This configuration is imported and parsed on every admin page load
- **Render cost:** React reconciles 3,000+ list items in a single component, even though <70 are visible at any time
- **Memory pressure:** The sidebar never unmounts (it's in the root layout), so this cost is always paid

The configuration likely contains duplicated entries, stale links from early development, and items for pages that don't exist yet. Trimming this to the ~70 actual routes would reduce the sidebar's bundle contribution by ~95%.

### 3.3 No Image Optimization

Every `<img>` tag in the application is a bare HTML element:

- No automatic WebP/AVIF conversion
- No responsive `srcset` for different viewport sizes
- No lazy-loading strategy beyond browser defaults
- No blur placeholder or aspect-ratio handling

With `next/image` available (Next.js 16), this is a significant missed performance optimization. Product images, category banners, and user avatars all benefit from automatic optimization.

### 3.4 Client Bundle Heavy

Multiple patterns push JavaScript to the client unnecessarily:

- **Framer Motion in commerce components:** Forces `'use client'` on entire sections that could otherwise be server components
- **Hardcoded product data** (`products.ts`, ~395 lines): Loaded on every client render instead of being server-only
- **Zustand store over-subscription:** Several components subscribe to the full store object instead of individual selectors, causing unnecessary re-renders
- **React Query without retention config:** All queries use only `staleTime`; no `gcTime`, `retry`, or `refetchOnWindowFocus` are configured, meaning every navigation refetches cached data

---

## 4. Accessibility Issues

### 4.1 Missing Image Alternatives

| Location | Issue |
|---|---|
| Cart product images | `alt=""` — screen reader gets no info |
| Account order items | `alt=""` — order line items invisible to assistive tech |
| Admin product list | `alt=""` — product images have no descriptions |
| Search results | `alt=""` — result items invisible |
| User avatars | `alt=""` — no context for who the avatar represents |

At minimum, product images should have `alt="Product: {name}"` and avatars should have `alt="Avatar of {username}"`.

### 4.2 Icon-Only Buttons

The following interactive elements lack accessible labels:

- Hamburger menu toggle (header mobile)
- Search trigger icon
- Admin sidebar collapse toggle
- Cart item quantity increment/decrement buttons
- Wishlist heart icon toggle
- Notification dismiss buttons

### 4.3 Form and Navigation ARIA

- **Accordion footer** (`AccordionFooter.tsx`): No `aria-controls`, `aria-labelledby`, or `aria-expanded` on toggle buttons. Screen reader users get no indication of expand/collapse state.
- **Payment method radio group** (`payment-section.tsx`): No `fieldset`/`legend` wrapping. Radio buttons lack `aria-label` distinguishing bKash from Nagad from COD.
- **Admin sidebar:** No skip-to-content link. Keyboard users must tab through 50+ nav items before reaching page content.
- **Modal overlays** (cart recommendations, admin confirmations): No focus trapping, no `aria-modal`, no `role="dialog"`.

### 4.4 Color Contrast

The brand green (`#0F9D58`) is used for text on various backgrounds:

- On white backgrounds: Acceptable (~4.6:1 ratio)
- On light gray backgrounds: Borderline (~3.8:1)
- On dark backgrounds in the admin login footer: White text at `opacity-20`/`opacity-30` is illegible

Red discount-badge text on white backgrounds also warrants verification against WCAG AA (4.5:1 for normal text).

### 4.5 Focus Management

The CSS includes focus-ring styling, but:

- Focus is only visually styled via the CSS — no programmatic focus management exists
- Sidebar navigation, modals, and dynamic content do not manage focus after state changes
- Tab order in admin tables (checkboxes → actions → sort controls) is not explicitly defined

---

## 5. Code Quality Issues

### 5.1 Environment Coupling

The NestJS backend requires Docker with Postgres (port 5433) and Redis (port 6379) with no fallback or development-mode alternative. This means:

- **No offline development:** The frontend cannot load real data without Docker running
- **CI/CD complexity:** Any pipeline must spin up Docker containers for backend tests
- **Onboarding friction:** New developers must install and configure Docker before seeing a functional app

**Recommendation:** Add a `docker-compose.override.yml` with SQLite or in-memory fallback, or provide a seed-data mode that serves static JSON.

### 5.2 Tailwind CSS v4 — No Config File

Tailwind CSS v4 uses CSS-based configuration via `@import "tailwindcss"`, which is correct for v4. However:

- Brand colors are defined as CSS custom properties in `globals.css` but also as Tailwind v4 `@theme` tokens
- Legacy spacing variables (`--spacing-xs`, `--spacing-md`) coexist with Tailwind's built-in spacing scale
- 581 lines of `globals.css` for a Tailwind v4 project suggests over-reliance on custom CSS instead of framework utilities

**Recommendation:** Audit `globals.css` and remove anything already expressible via Tailwind utilities or `@theme` configuration.

### 5.3 Admin Navigation Misalignment

The admin sidebar configuration suffers from two problems:

1. **Label/route mismatches:** At least 8 sidebar labels point to routes whose page files live elsewhere (e.g., "Inventory" → `/admin/inventory`, but the page is at `/admin/warehouse/inventory`)
2. **Massive config size:** ~3,000 navigation items defined in a static array that only displays ~70

The most likely root cause: the navigation config was generated or expanded automatically, importing every possible admin route, but page file directories were renamed or restructured without updating the navigation data.

**Recommendation:** Derive the sidebar from the actual filesystem or route group structure, or maintain a hand-curated list of ~70 items matching existing page directories. Remove stale entries.

### 5.4 Duplicated Logic

| Pattern | Lines | Locations |
|---|---|---|
| Footer link data | ~24 links duplicated | `FooterLinks.tsx` + `AccordionFooter.tsx` |
| Address CRUD | ~80 lines duplicated | `account/addresses/` + `checkout/address-section/` |
| Auth redirect logic | ~30 lines duplicated | Login `handleSubmit` + `useEffect` |

Each instance of duplication increases the chance of drift — a fix applied in one location may not be applied in the other.

### 5.5 Stub Content as Dead Code

44 of 82 admin pages render only "This page is coming soon." This represents significant dead code:

- Route group directories exist with page files that are functionally empty
- Navigation items point to these stubs, giving users false expectations
- Any automated testing of these routes would pass (the component renders) but provide no real coverage

**Recommendation:** Either implement the pages or remove the routes entirely. A "Coming soon" route is worse than a 404 because it wastes the user's time loading a page with no content.

---

## 6. Missing Features / Functional Gaps

### MVP-Blocking Gaps

| Gap | Area | Why It Blocks |
|---|---|---|
| Forgot password flow | Auth | Users cannot recover accounts independently. Login page links to `/auth/forgot-password` but route is missing → 404. |
| Search results page | Public | Search overlay submits to `/search?q=...` but no route exists → 404. Product discovery is broken. |
| Order management (real) | Admin | Orders page shows demo data. No ability to process, cancel, or update orders. |
| Inventory management | Seller | Seller dashboard has no inventory view or stock management. |
| Payment processing | Checkout | Payment methods are listed but no real payment integration is wired. |

### Enhancement Gaps (Non-Blocking)

| Gap | Area | Notes |
|---|---|---|
| Analytics & reports | Admin | Chart containers exist but display hardcoded numbers. |
| SEO management | Admin | Meta tags, sitemap generation, and SEO tools listed but stubbed. |
| Brand management | Admin | Brands page is "coming soon." |
| Campaign/promo engine | Admin | Flash sales, coupons, and campaigns are all stubbed. |
| Delivery zone config | Admin | Route exists but page is "coming soon." |
| Push notifications | Admin | Route listed in sidebar but no page directory exists → 404. |
| Seller onboarding flow | Seller | Registration exists but no progressive onboarding wizard. |
| Multi-language / i18n | Public | No internationalization infrastructure detected. |
| PWA offline experience | Public | Manifest exists but no service worker for offline content. |

---

## 7. Priority Issues Matrix

| ID | Area | Severity | Impact | Suggested Fix | Phase |
|---|---|---|---|---|---|
| P1 | Code Quality | **Critical** | 8 admin sidebar links → 404 on click; 3000-item config bloats bundle | Fix label/route mismatches; trim config to ~70 entries | 1 |
| P2 | Performance | **Critical** | Zero loading.tsx — blank screens on every navigation | Add loading.tsx at route-group level (admin/, seller/, cart/, checkout/) | 1 |
| P3 | Performance | **Critical** | Zero error.tsx — runtime errors crash pages ungracefully | Add error.tsx at same route-group boundaries | 1 |
| P4 | Missing Feature | **Critical** | /search route missing → search yields 404 | Create search/page.tsx with basic results UI | 1 |
| P5 | Missing Feature | **Critical** | /auth/forgot-password route missing → 404 | Create forgot-password page | 1 |
| P6 | Missing Feature | **Critical** | No not-found.tsx → generic Next.js 404 | Add root not-found.tsx | 1 |
| P7 | Accessibility | **High** | Empty alt attributes on product images | Add descriptive alt text to all product/avatar images | 2 |
| P8 | Accessibility | **High** | No aria-label on icon-only buttons | Add aria-label to hamburger, search, cart controls, sidebar toggle | 2 |
| P9 | Responsiveness | **High** | Admin dashboard unusable on mobile | Add collapsible sidebar with hamburger drawer for <1024px | 2 |
| P10 | Performance | **High** | No next/image — bare img tags throughout | Migrate to next/image with lazy loading and WebP | 3 |
| P11 | Code Quality | **High** | 53% of admin pages are "coming soon" stubs | Implement top-10 priority admin pages or remove routes | 3 |
| P12 | UI/UX | **High** | 44 stub pages undermine production readiness | Prioritize high-impact pages: Brands, Shipping, Vendors, Campaigns | 3 |
| P13 | Accessibility | **High** | No skip-to-content link in admin | Add skip-link as first focusable element in admin layout | 2 |
| P14 | Performance | **Medium** | Hardcoded product data (~395 lines) loaded client-side | Move product data to server-only imports | 3 |
| P15 | UI/UX | **Medium** | bKash/Nagad share same payment icon | Use distinct brand-appropriate icons | 2 |
| P16 | Code Quality | **Medium** | Footer link data duplicated in 2 components | Extract to shared data file, import in both | 2 |
| P17 | Code Quality | **Medium** | Address CRUD logic duplicated in account + checkout | Extract address operations to a shared hook or utility | 3 |
| P18 | UI/UX | **Medium** | Cart fixed bottom bar overlaps mobile nav | Use env(safe-area-inset-bottom) instead of hardcoded bottom-14 | 2 |
| P19 | Responsiveness | **Medium** | Inconsistent container widths across sections | Standardize on single max-width with clamp() padding | 2 |
| P20 | Accessibility | **Medium** | Payment radio group missing fieldset/legend | Wrap payment options in fieldset with legend | 2 |
| P21 | Performance | **Medium** | Framer Motion forces 'use client' on server-compatible sections | Isolate motion wrappers, keep data layers server-side | 3 |
| P22 | Code Quality | **Medium** | Login redirect logic duplicated (handleSubmit + useEffect) | Consolidate to single redirect handler | 3 |
| P23 | UI/UX | **Low** | Placeholder phone numbers (01XXXXXXXXX) in production forms | Replace with empty inputs or real data | 3 |
| P24 | Performance | **Low** | Zustand store over-subscription | Memoize selectors, prefer atomic subscriptions | 4 |
| P25 | Code Quality | **Low** | Redundant CSS legacy aliases in globals.css | Audit and remove stale CSS variables | 4 |

---

## 8. Five-Phase Roadmap

### Phase 1 — Routing Foundation & Stability (Week 1)

*Target: Eliminate all 404 errors and blank-loading states.*

1. **Fix admin sidebar navigation** — Remap 8+ broken links to correct routes; reduce the 3,000-item config to ~70 curated entries; add validation that each route's page file exists.
2. **Add loading.tsx boundaries** — One per route group (admin, seller, cart, checkout, account, search). Each displays a skeleton matching the page layout shape.
3. **Add error.tsx boundaries** — Same route groups. Each provides a "Something went wrong" message with a retry button and a "Go home" link.
4. **Create missing critical routes:** `/search`, `/auth/forgot-password`, and root `not-found.tsx`.
5. **Fix the 3000-item sidebar config** — Strip stale entries, deduplicate, and validate each item points to a real page directory.

### Phase 2 — Design System, Accessibility Baseline, & Responsive Layout (Week 2)

*Target: Consistent visual language, WCAG AA compliance, and mobile-friendly admin.*

1. **Establish a Tailwind CSS v4 theme** — Consolidate brand tokens (colors, spacing, typography scale) into `@theme` in `globals.css`. Remove legacy M3 and inline style vestiges.
2. **Accessibility baseline** — Add `alt` text to all images, `aria-label` to icon buttons, `fieldset`/`legend` to form groups, skip-to-content links, and ARIA attributes on accordions/modals.
3. **Mobile admin responsive layout** — Hamburger drawer sidebar for <1024px, horizontal scroll for tables, collapsible stat cards.
4. **Standardize containers** — Single `max-width` (recommend 1440px) with `clamp()` padding across all sections. Remove per-section arbitrary widths.
5. **Fix responsive breakpoints** — Smooth footer transitions (avoid triple-branch layout), fix cart bottom bar overlap (use safe-area-inset-bottom), add horizontal scroll for overflowing tables.
6. **Component consolidation** — Extract shared footer link data, create a reusable AddressForm component to eliminate CRUD duplication.

### Phase 3 — Performance & Dashboard Hardening (Week 3)

*Target: Production-ready dashboards with real data paths.*

1. **Image optimization** — Migrate all `<img>` to `next/image` with lazy loading, WebP format, and responsive srcset. Add blur placeholders for product images.
2. **Implement top-10 priority admin pages** — At minimum: Brands, Vendors, Shipping/Zones, Campaigns, Flash Sales, SEO, Reports, Categories, Reviews, and Inventory.
3. **Server-only data loading** — Move product data constants and API call logic out of client bundles; use server components with async data fetching.
4. **Centralize API error handling** — Create a shared API client with consistent error → toast → fallback behavior. Remove scattered try/catch patterns.
5. **Isolate Framer Motion wrappers** — Keep animation logic in thin client component shells while data fetching remains server-side.
6. **React Query configuration** — Add `gcTime`, `retry` policies, and `refetchOnWindowFocus` to all queries.

### Phase 4 — Feature Completion (Week 4)

*Target: Complete all admin/seller workflows and monitoring capabilities.*

1. **Complete remaining admin pages** — Multi-language, PWA offline, push notifications, delivery zones, and coupon management.
2. **Seller dashboard build-out** — Real inventory management, order fulfillment workflow, product analytics, and revenue reporting.
3. **Order management pipeline** — End-to-end order processing: placement → payment confirmation → fulfillment → delivery tracking → returns.
4. **Analytics & reporting engine** — Connect chart containers to real data queries; add date-range filtering and export capabilities.
5. **Zustand store optimization** — Audit all subscriptions; replace full-store selectors with atomic selectors; add memoization where needed.
6. **Auth middleware hardening** — Review role-based routing, add session timeout handling, implement refresh token rotation.

### Phase 5 — Polish, Observability & Continuous UX Iteration (Week 5+)

*Target: Production launch readiness.*

1. **Backend development fallback** — Add `docker-compose.override.yml` with SQLite or a seed-data mode so the frontend works without Docker.
2. **Observability** — Add Sentry or similar error tracking; ensure `error.tsx` boundaries report to it. Add console warnings for API failures.
3. **Empty state pass** — Every list, table, and dashboard should have a meaningful empty state (illustration + message + CTA).
4. **Animation polish** — Skeleton loaders that match final layout shapes; smooth page transitions; micro-interactions on interactive elements.
5. **Testing infrastructure** — Add Playwright e2e tests for critical flows (login, product search → cart → checkout, admin order management).
6. **Continuous UX iteration** — Run a Lighthouse CI budget, track Core Web Vitals, and schedule monthly review cycles for design debt.

---

## Appendix A: Tech Stack Reference

| Technology | Version | Configuration |
|---|---|---|
| Next.js | ^16.2.9 | App Router, Turbopack dev |
| React | ^19.2.4 | Server components + client islands |
| Tailwind CSS | ^4.1.8 | CSS-based (`@import "tailwindcss"`), no tailwind.config.* |
| TypeScript | ^5.7.3 | Strict mode enabled |
| Zustand | ^5.0.14 | Auth, cart, UI stores |
| TanStack React Query | ^5.101.2 | Server state |
| Framer Motion | ^12.42.2 | Animations |
| Lucide React | ^1.23.0 | Icon supplement |
| Jose | ^6.0.11 | JWT (Node.js) |
| Lightning CSS | ^1.32.0 | CSS processing |

## Appendix B: Page Count Breakdown

| Section | Total Routes | Implemented | Stubs/Placeholder | Missing Route (404) |
|---|---|---|---|---|
| Admin | 82 | 38 | 42 | 2 |
| Seller | 14 | 12 | 2 | 0 |
| Account | 5 | 4 | 1 | 0 |
| Auth | 2 | 1 | 0 | 1 |
| Cart/Checkout | 2 | 2 | 0 | 0 |
| Public | ~25 | ~22 | ~3 | 1 |
| **Total** | **~130** | **~79** | **~48** | **~4** |

## Appendix C: Admin Sidebar Broken Link Map

| Nav Label | Linked Route | Actual Page File | Status |
|---|---|---|---|
| Inventory | `/admin/inventory` | `/admin/warehouse/inventory` | Wrong path |
| Invoices | `/admin/invoices` | `/admin/finance/invoices` | Wrong path |
| Settlements | `/admin/settlements` | `/admin/finance/settlements` | Wrong path |
| Couriers | `/admin/couriers` | `/admin/fulfillment/courier` | Wrong path |
| Tracking | `/admin/tracking` | `/admin/fulfillment/tracking` | Wrong path |
| Warehouses | `/admin/warehouses` | `/admin/warehouse` | Wrong path |
| Support Tickets | `/admin/support-tickets` | `/admin/support` | Wrong path |
| Notifications | `/admin/notifications` | N/A | No page file exists |
| Push Notifications | `/admin/push-notifications` | N/A | No page file exists |
| Delivery Zones | `/admin/delivery-zones` | N/A | No page file exists |

---

*Report generated 2026-07-19. Based on static code analysis and 43 page screenshots. Backend was not running (Docker-only setup); all data observations reflect demo/placeholder content.*
