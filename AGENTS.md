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

---

## Session 2026-07-26 — Forecast IDOR fix, H-1 role wiring, H-2 per-session logout, H-3 AI rate limiting

### What was done

- **Forecast IDOR (C-4):** Added product ownership check in `forecastDemand()` — looks up product, verifies `store.userId` matches requester. SELLER accessing another seller's product gets 404 (choice: 404 over 403 to avoid leaking product existence). ADMIN/SUPER_ADMIN bypass the check.
- **Cross-sell/upsell 500 fix:** Root cause = `@Query('productId')` on `:productId` route param in `ai.controller.ts`. `@Query` reads query string, not route params → `findUnique(undefined)` throws. Fixed by changing to `@Param('productId')`. Same bug across all three recommendation endpoints.
- **H-1 (LOGISTICS role wiring):** Added `@Roles('LOGISTICS','ADMIN','SUPER_ADMIN')` + RolesGuard to 5 gated fulfillment endpoints (assign, shipments, pickup, courier-performance, cod-reconciliation). 4 read-only endpoints left JWT-only.
- **H-2 (per-session logout):** `logout()` in `auth.service.ts` now accepts optional `refreshTokenValue`, decodes its `jti` via `refreshJwtService.verify()`, and revokes only that specific token. Falls back to revoke-all if no token provided or decoding fails. `logoutAll()` unchanged.
- **H-3 (rate limiting on AI):** Added `@Throttle()` to all 14 endpoints in `ai.controller.ts` — 10/min (heavy AI), 20/min (chat/moderate/search), 60/min (recommendation reads), 120/min (track-interaction).

### Files changed

| File | Change |
|---|---|
| `backend/src/modules/auth/auth.controller.ts` | Updated `logout()` to read refresh token from body/cookies |
| `backend/src/modules/auth/auth.service.ts` | `logout()` now revokes single token by jti; `logoutAll()` unchanged |
| `backend/src/modules/ai/ai.controller.ts` | Added `@Throttle()` to all 14 endpoints; fixed `@Query`→`@Param` on cross-sell/upsell |
| `backend/src/modules/ai/ai.service.ts` | Added product ownership check in `forecastDemand()` |
| `backend/src/modules/fulfillment/fulfillment.controller.ts` | Added `@Roles('LOGISTICS','ADMIN','SUPER_ADMIN')` to 5 gated endpoints |

### Verification evidence

- **H-1**: CUSTOMER=403 on all 5 gated endpoints, LOGISTICS=passes guard (verified via handler messages)
- **H-2**: Session A logout → A's refresh=401, B's refresh=200 (still alive). logoutAll kills all sessions
- **H-3**: AI/recommendations/feed hit limit=60 at request #61 → 429
- **Forecast IDOR**: SELLER2→SELLER1's Samsung=404, SELLER2→own iPhone=201, ADMIN→any=201
- **Cross-sell fix**: SELLER→/cross-sell/:productId returns 200 (was 500)
- **Frequently-bought**: Returns real co-purchases from seeded order data

---

## Session 2026-07-27 — H-1 MODERATOR role gating + Moderation Queue UI

### What was done

- **Added `@Roles('MODERATOR', 'ADMIN', 'SUPER_ADMIN')`** to 9 admin endpoints across 3 controllers:
  - `support.controller.ts`: GET /admin/reviews, PUT /admin/reviews/:id
  - `seller.controller.ts`: GET /admin/sellers, PUT /admin/sellers/:id/store-status, POST approve/reject
  - `dashboard.controller.ts`: GET /admin/compliance
- **Updated `admin/layout.tsx`**: Added MODERATOR to both JSX guard and server check
- **Added "Moderation" sidebar section** with link to `/admin/moderation`
- **Created `src/app/admin/moderation/page.tsx`** — 3-tab queue UI:
  - **Pending Products** tab — approve/reject with reason prompt, paginated table + mobile cards
  - **Flagged Reviews** tab — approve/hide reviews with star rating, desktop table + mobile cards
  - **Vendor Approvals** tab — approve/reject KYC + toggle store active/suspend, filter by KYC status

### Files changed

| File | Change |
|---|---|
| `backend/src/modules/admin/controllers/support.controller.ts` | Added `@Roles` to 2 review endpoints |
| `backend/src/modules/admin/controllers/seller.controller.ts` | Added `@Roles` to 4 seller endpoints |
| `backend/src/modules/admin/controllers/dashboard.controller.ts` | Added `@Roles` to compliance endpoint |
| `src/app/admin/layout.tsx` | MODERATOR in JSX guard + server check + sidebar nav |
| `src/app/admin/moderation/page.tsx` | New 3-tab moderation queue UI (products, reviews, sellers) |

---

## Session 2026-07-27 (continued) — M-2 Refresh token rotation reuse detection

### What was done

- **Fixed reuse detection** in `auth.service.ts` `refresh()` — when a **revoked** (already rotated) refresh token is replayed, all active sessions for that user are revoked (mass-revocation on theft). Previously only returned 401 silently, allowing the attacker to keep any other sessions alive.
- **Expired-but-unrevoked tokens** continue to revoke individually (existing behavior, not theft).

### Files changed

| File | Change |
|---|---|
| `backend/src/modules/auth/auth.service.ts` | Revoke all sessions on revoked-token reuse (theft) vs single-token on expiry |

---

## Session 2026-07-27 (continued) — M-3 Deactivation cascade + Phase 5 Item 3 Seller-level coupon limits

### M-3 — Deactivation cascade

- **`AdminUserService.updateUser`** now cascades `isActive` changes to the user's `Store`. Deactivating a user sets `Store.isActive = false`; reactivating sets it back to `true`.
- No self-serve deactivation endpoint existed — only admin path was covered.

### Phase 5 Item 3 — Seller-level coupon usage limits

- **Schema**: Added `maxUsesPerSeller: Int?` to `Coupon`, `sellerId: String?` to `CouponUsage`
- **`CouponService.validateCoupon`**: accepts optional `sellerId`, checks `maxUsesPerSeller` by counting per-seller usage (only when both `maxUsesPerSeller` and `sellerId` are set)
- **`CouponService.applyCoupon`**: accepts optional `sellerId`, stores it on `CouponUsage` for per-seller tracking
- **`CouponService.createCoupon` / `updateCoupon`**: accept `maxUsesPerSeller` for CRUD
- **`OrdersService.createOrder`**: passes the first order item's `storeId` as seller context to coupon validation and application
- Multi-seller orders use the first item's store for seller-level limit checking

### Files changed

| File | Change |
|---|---|
| `backend/prisma/schema.prisma` | Added `maxUsesPerSeller` to Coupon, `sellerId` to CouponUsage |
| `backend/src/modules/coupons/coupon.service.ts` | Seller-level validation + tracking in validateCoupon/applyCoupon/create/update |
| `backend/src/modules/orders/orders.service.ts` | Pass sellerId from first order item to coupon methods |
| `backend/src/modules/admin/services/user.service.ts` | Cascade `isActive` to Store when updating user |

---

## Session 2026-07-27 (end) — 🔴 Logout infinite redirect loop fix

### Root cause

`src/stores/auth-store.ts:89` `logout()` captured `get().accessToken` → but `accessToken` is **NOT persisted** by Zustand (`partialize` only persists `user`). After any page navigation, `accessToken` rehydrates as `null` → `if (token)` guard **skipped the API call entirely** → cookies never cleared → proxy.ts middleware saw cookies → 307 redirect → infinite `/admin/login` → `/admin` → `/auth/login` → `/admin` loop.

### Fix applied

- **Removed** `if (token)` guard — logout API is now called unconditionally.
- **Removed** `Authorization` header — backend JWT strategy reads token from cookie first (`jwt.strategy.ts:17`), so cookies alone suffice.
- **Added** `isLoggingOut` re-entrancy guard — prevents infinite recursion when `request()` 401 handler calls `logout()` re-entrantly.

### Verification

- Backend `clearTokenCookies(res)` works correctly (verified via `Invoke-WebRequest` to `localhost:4000`)
- **Next.js rewrite DOES forward Set-Cookie** (verified via `Invoke-WebRequest` to `localhost:3000/api/auth/logout` — cookies cleared, no redirect on subsequent `/auth/login`)
- Previous false negatives from `fetch()` were due to **`Set-Cookie` being a forbidden response header name in the Fetch API** — `res.headers.get('Set-Cookie')` returns `null` even when present. Use `playwright.context().cookies()` or an HTTP client to verify cookie behavior.
- PowerShell end-to-end test: login → logout (no Auth header) → 200 OK → cookies cleared → `/auth/login` stays on login page (no redirect) ✓

### Files changed

| File | Change |
|---|---|
| `src/stores/auth-store.ts` | Removed `if(token)` guard + Auth header from `logout()`; added `isLoggingOut` re-entrancy guard |

---

## Session 2026-07-30 — Sidebar positioning: fixed → sticky flex layout

### Problem

Sidebar used `fixed top-32` = 128px offset (64px header + 64px gap). Despite multiple `top-` adjustments (`top-4` → `top-[76px]` → `top-16` → `top-20` → `top-24` → `top-32`), user reported "no changes seen" — likely due to stale build cache / missing hard refresh. More fundamentally, `fixed` positioning requires manual gap tuning and breaks at different viewport heights.

### Fix

Replaced `fixed` sidebar with `sticky` inside a flex container:

- **Desktop (`>=lg`):** Layout now uses `<div className="flex gap-6 items-start">` wrapping sidebar and main content
  - Sidebar: `sticky top-20 self-start` in the flex flow — no `fixed`, no `absolute`
  - Height capped with `maxHeight: 'calc(100vh - 5.5rem)'` via inline style
  - Content: `<main className="flex-1 min-w-0 mt-6">` in the same flex row
  - Sidebar naturally sits *below* the sticky header (sticky header at `top-0`, sidebar at `top-20`)
  - Removed `pl-[calc(16rem+2rem)]` spacer hack — flex layout handles spacing naturally

- **Mobile (`<lg`):** Drawer stays `fixed top-20 left-4 bottom-4` (unaffected)

- **Both admin and seller layouts** updated identically (admin: primary accent, seller: emerald accent)

### Files changed

| File | Change |
|---|---|
| `src/app/admin/layout.tsx` | Desktop sidebar: `fixed top-32` → `sticky top-20 self-start` inside flex; removed spacer |
| `src/app/seller/layout.tsx` | Same structural changes |

---

## Session 2026-07-30 (second pass) — Header height enhanced + mobile collapse toggle

### What was done

- **Header**: `h-16` (64px) → `h-18` (72px) with `bg-white/80`, `shadow-sm shadow-black/5`, `gap-4` on both admin and seller layouts
- **Desktop sidebar**: `sticky top-20` → `sticky top-24`; `maxHeight: calc(100vh - 7rem)` (recalculated for taller header)
- **Mobile sidebar**: `fixed top-20` → `fixed top-24` to match new header bottom
- **Mobile collapse toggle**: Removed `{isDesktop &&}` guard from the collapse button — now available on both desktop *and* mobile. Mobile sidebar can expand/collapse between icon-only (`w-[72px]`) and full (`w-70 max-w-[85vw]`) modes.
- **Mobile responsive width**: `transition-all` (was `transition-transform` only) so width change animates smoothly; width class switches based on `sidebarCollapsed` state
- **Both admin and seller** updated identically

### Files changed

| File | Change |
|---|---|
| `src/app/admin/layout.tsx` | Header `h-16`→`h-18`; sidebar `top-20`→`top-24`; mobile collapse toggle + responsive width |
| `src/app/seller/layout.tsx` | Same |

### Summary of current layout

| Property | Desktop | Mobile |
|---|---|---|
| Header height | `h-18` (72px) | `h-18` (72px) |
| Sidebar positioning | `sticky top-24` in flex | `fixed top-24 left-4 bottom-4` |
| Sidebar width (expanded) | `w-60` (240px) | `w-70 max-w-[85vw]` |
| Sidebar width (collapsed) | `w-[72px]` | `w-[72px]` |
| Max height | `calc(100vh - 7rem)` | `calc(100vh - 7rem)` (via bottom-4) |
| Collapse toggle | Yes | Yes (new) |

---

## Session 2026-07-31 — Cart responsive fix, mobile-first header overhaul, auth hydration fix

### Cart page fix (commit `9899a75`, deploy `dpl_Fr5kZCZxjbWymmsT87t7rPa2PDns`)

- **Desktop grid**: `lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]` (minmax(0,…) keeps grid children from blowing out the container; `fr` alone does not constrain min-content width)
- **Product line item**: `grid-cols-[72px_1fr_auto]` + truncation on name/options; price cell `text-right whitespace-nowrap` (force `justify-self-end` — grid children only shrink when it's set)
- **Variants/size pills**: `flex-wrap` so small screens wrap instead of overflowing; fixed bottom bar hides at `lg:`
- Verification: playwright overflow checks at 320–1440 (worst overflow 0); production verified via Vercel SSO share URL

### Header mobile overhaul (commit `87d3cd8`, deploy `dpl_8QvUW64nkMQAZzoW46rre8167SM8`)

User decisions: **2 action icons on <sm** (cart + account; wishlist + notifications live in the drawer on phones) and **collapse search row on scroll** (collapses scrolling down, restores scrolling up).

- **`header/index.tsx`**: single `app-container` wraps two stacked rows — row 1 (`h-16 md:h-18 lg:h-20`) = menu + logo (`min-w-0`) + DesktopSearch + Actions; row 2 = `<MobileSearchButton scrolled={scrolled} />` driven by `useScrollState(4)`
- **`MobileSearchButton.tsx`**: `md:hidden` collapsible row — `h-[52px] opacity-100` ↔ `h-0 opacity-0` (300ms, `overflow-hidden`); removed ⌘K kbd chip
- **`Actions.tsx`**: Notification + Wishlist wrapped in `hidden sm:block`; Cart + AuthSection get `compact`; `ml-auto`
- **Compact buttons**: `w-10 h-10 sm:w-11 sm:h-11`, `active:bg-gray-100` (touch feedback) on CartButton/AuthSection/NotificationButton/WishlistButton
- **`SearchOverlay.tsx`** (was unclosable): always-visible X Close button, Escape key, backdrop click (`e.target === e.currentTarget`), `prevFocusRef` focus restore, `safe-top`, results `max-h-[calc(100dvh-8rem)] md:max-h-[70vh]`
- Verified locally (320/360/375/390/414 → overflow 0, 2 icons; 768 → 5 items; search row 52px↔0 on scroll; overlay closes 3 ways; focus restored) and on production via share URL
- Drawer regression note: mobile drawer dialog has an **empty id** — `#navigation-drawer` selector fails; use `[role="dialog"]`

### Auth hydration fix (commit `f685429`, deploy `dpl_GUfCQ6drDVSbkZJa39Xm5Dn8FCSv`)

- **Root cause**: zustand 5 persist `hydrate()` always calls `options.merge()` even with **no persisted state** (`migratedState = undefined`). `auth-store.ts` merge did `p.user ?? current.user` → TypeError → hydration promise rejected → `hasHydrated()` never fired → permanent skeleton pulse instead of Sign In icon for **every fresh visitor** (pre-existing, site-wide)
- **Fix**: `merge: (persisted, current) => { const p = persisted as AuthPersist | undefined; return { ...current, user: p?.user ?? current.user, isAuthenticated: !!p?.user }; }`
- Verified on production: fresh visitor → `a[href="/auth/login"]` visible, 0 pulse elements; seeded `amarshop-auth` → `a[href="/account"]` visible, 0 pulse
- Prod console still shows 4 errors (prior pattern = backend-down artifacts; uninvestigated)

### Patterns / gotchas

- Vercel team ID for this project: `team_F1cEOGelGW4yPCGOAidAOOk8` (slug `shawon2210s-projects`) — a stale/wrong `team_Gcq…` token causes 403
- `_vercel_share` URLs are per-deployment; regenerate with `vercel_get_access_to_vercel_url` after each deploy (expire ~24h)
- `tsconfig.json` excludes `tests` — `tests/playwright/mobile-sidebar-visibility.test.ts` is a pre-existing Python-style file saved as `.ts` (triple-quoted docstring) that breaks `tsc`; needs conversion or deletion
- `tsc --noEmit` + `eslint` on changed files is the verification gate before commits
- git push stderr warnings are benign (PowerShell renders remote output to stderr)

---

## Session 2026-07-31 (second pass) — Responsive mobile sidebar drawer width

### Problem

Mobile drawer was a fixed `w-[280px] max-w-[85vw]` on every phone (only 75% of a 375px viewport, 68% of 414px) and **shared the persisted desktop collapse state** — collapsing on desktop made the mobile drawer open as a 72px icon rail on phones.

### Fix (commit `c66d6ee`)

- **Responsive width**: mobile drawer expanded = `w-[min(88vw,300px)]` — scales with viewport (282px at 320vw → 300px cap), matching modern ecommerce admin drawer proportions. Applied to both admin (`src/app/admin/layout.tsx`) and seller (`src/app/seller/layout.tsx`) drawers.
- **State decoupling**: new `mobileCollapsed` state (`useState(false)`, not persisted) replaces `sidebarCollapsed` in the mobile drawer branch. Mobile always opens expanded regardless of desktop collapse; the in-drawer collapse toggle still works locally (72px rail) and never leaks to desktop. Desktop branch keeps the persisted `sidebarCollapsed`.

### Verification (Playwright, dev server with `/api/**` stubbed to 500 to avoid 401→logout→login redirect)

- Drawer widths: 320→282px (88%), 360/375/390/414→300px (80%/77%/72%)
- With `amarshop-admin-sidebar=true` persisted, mobile drawer still opened at full responsive width (no 72px rail leak)
- Mobile toggle: collapse→72px, expand→300px; desktop unaffected (240px expanded, 72px collapsed, persistence intact)
- Seller layout: 300px at 375vw, desktop 240px expanded
- `tsc --noEmit` + `eslint` clean

### Gotcha

- Local `/admin` testing: backend down → rewrite returns 401 → `api.ts` logs out and redirects to `/auth/login` mid-test. Stub `/api/**` with `page.route` returning 500 JSON to keep the session alive while testing layout.
- `dev-server.log` at repo root is a transient artifact when launching `npm run dev` via `Start-Process` — delete after use.

---

## Session 2026-08-01 — Cart Phase 2 verification + mobile-first empty cart state

### Cart Phase 2 todo completion (verification pass over existing `9899a75` fix)

- Re-verified cart page at 360/375/768/1024 with seeded `amarshop-cart` localStorage (3 items, subtotal < ৳999): item cards, variant labels (`colors[0] · sizes[0]` text line), free-shipping bar + progress, sticky Order Summary (lg), mobile checkout bar (`fixed bottom-14 md:hidden`, 65px, "Check Out"), undo toast — all pass, zero horizontal overflow
- **Undo toast round-trip**: remove → toast "Item removed from cart" → Undo restores (3→2→3). Toast at `bottom-[8.5rem] md:bottom-6`
- Cold-load flake: first visit at a viewport may show skeleton past 1200ms — use `waitForFunction` on page text instead of fixed sleeps
- Bottom bar CTA text is "**Check Out**" (two words) — `includes('Checkout')` fails; mobile coupon UI lives in the bar's "Details / Price & promo" sheet (`detailsOpen`/`promoOpen`), not the `hidden md:block` coupon card

### Mobile-first empty cart state (commit `4a1ff04`, deploy `dpl_FwXG6BAJPFre1svWdNiY3D9N6Rt5`)

- `src/app/cart/page.tsx` empty state: icon `w-16 h-16`→`sm:w-20`, heading `text-lg`→`sm:text-2xl`, copy `text-[13px]` + `max-w-[280px]`, container `py-6 md:py-10`
- Recently Removed rows: `p-2.5 sm:p-3`, `gap-2.5 sm:gap-3`, thumb `w-10 h-10 sm:w-11`, name `text-[13px] font-medium`, Undo `min-h-[44px]`
- Continue Shopping: `w-full` full-width on mobile (336px @ 375, 48px tall) → `sm:w-auto` centered (178px @ ≥768)
- Verified 320/360/375/414/768/1024: overflow 0, rows in bounds, button geometry correct

### Customer-facing drawer widths (commit `6382c3d`, deploy `dpl_C1dxnCRoG235wMdLk2csSTR2eJR4`)

- `NavigationDrawer.tsx`: `clamp(280px, 80vw, 400px)` → `clamp(280px, 85vw, 320px)` (was 331–344px on 414–430 phones)
- `category-filter-sidebar.tsx`: `w-[280px] max-w-[80vw]` → `w-[clamp(280px,85vw,320px)]`
- Verified 320/375/414/430: 280px (88%) → 319px (85%) → 320px (77%/74%); zero overflow at 320×568

### Gotcha

- `.playwright-mcp/` is **accidentally git-tracked** (old commits) — deleting the directory stages ~200 deletions; `git checkout -- .playwright-mcp` to restore. Consider gitignoring later.
<!-- END:session-summary -->
