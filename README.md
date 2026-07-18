# 🛍️ AmarShop — Multi-Vendor E-Commerce Marketplace

<p align="center">
  <img src="https://img.shields.io/badge/status-production%20ready-22c55e?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Next.js-16.2.9-000000?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/NestJS-11-ee3c3c?style=flat-square&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169e1?style=flat-square&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Redis-cache-dc382d?style=flat-square&logo=redis" alt="Redis" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ed?style=flat-square&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="License" />
</p>

<p align="center">
  <b>A full‑featured, enterprise‑grade multi‑vendor marketplace platform built for the Bangladeshi e‑commerce ecosystem.</b><br />
  <i>Admin dashboard · Seller center · Buyer experience · Real‑time operations · Production‑ready</i>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Who Is This For](#-who-is-this-for)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Overview](#-api-overview)
- [Security](#-security)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🌟 Overview

**AmarShop** (আমারশপ — "My Shop" in Bengali) is a complete multi‑vendor e‑commerce marketplace powering both **buyers** and **sellers** with a seamless, secure, and scalable platform. Built with modern web technologies, it supports the full lifecycle of an online transaction — from product discovery through checkout, payment, fulfillment, and post‑purchase support.

Whether you are launching a new marketplace in Bangladesh or modernising an existing one, AmarShop provides the foundation out of the box.

---

## 🎯 Who Is This For

| Role | What They Get |
|------|---------------|
| **🏪 Marketplace Owner** | Full admin control, commission management, analytics, compliance tools |
| **🛒 Buyers** | Product search, cart, checkout (COD / bKash / Nagad / cards), order tracking, wishlist |
| **📦 Sellers** | Dedicated storefront, inventory management, order fulfillment, earnings dashboard |
| **🔧 Developers** | Clean REST API, real‑time WebSocket events, PostgreSQL with Prisma ORM, full Docker setup |

---

## ✨ Key Features

### 👑 Admin Panel (`/admin`)
| Module | Description |
|--------|-------------|
| **Dashboard** | Real‑time revenue, orders, users, low‑stock alerts with trend charts |
| **Products** | Full CRUD, approval workflow, inventory tracking, category management |
| **Orders** | Lifecycle management, status updates, notes, filters |
| **Users & Sellers** | Role management (CUSTOMER / SELLER / ADMIN), KYC verification, store toggle |
| **Payments** | Transaction log, settlement reconciliation, method distribution |
| **Marketing** | Flash sales, coupons, banners — create, schedule, and track |
| **CMS** | Static pages, announcements, publishing workflow |
| **Support** | Ticket system with threaded replies, priority/status management |
| **Finance** | Revenue overview, settlement processing, tax reports, invoices |
| **BI & Analytics** | Executive metrics, RFM customer segmentation, cohort retention analysis |
| **Roles & Permissions** | Server‑side RBAC via `@Roles()` decorator |
| **Real‑Time** | Live activity feed, orders/min, system health |

### 🧑‍💼 Seller Center (`/seller`)
- Dedicated store profile with branding
- Product management (add / edit / bulk upload)
- Order management and fulfillment
- Earnings and settlement tracking
- Inventory and stock alerts

### 🛍️ Buyer Experience
- Product browsing with category tree and search
- Shopping cart and checkout
- Multiple payment methods (COD, bKash, Nagad, SSLCommerz)
- Order history and tracking
- Address management and wishlist
- Product reviews and ratings

### ⚙️ Platform‑Wide
- **JWT Authentication** with access + refresh token rotation
- **Role‑Based Access Control** (CUSTOMER → SELLER → ADMIN → SUPER_ADMIN)
- **Rate Limiting** and request validation
- **Redis Caching** for high‑traffic endpoints
- **WebSocket / SSE** for real‑time features
- **Audit Logging** for admin actions
- **Coupon engine** with percentage / fixed / free‑shipping types

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 16)                 │
│  React 19 · TypeScript · Tailwind CSS · Zustand         │
│  Material Symbols · next/navigation · Turbopack         │
├─────────────────────────────────────────────────────────┤
│                    BACKEND (NestJS 11)                   │
│  TypeScript · Prisma ORM · Passport JWT · class-validator│
│  WebSocket Gateway · Bull Queue · OpenTelemetry         │
├─────────────────────────────────────────────────────────┤
│                     DATABASE & CACHE                    │
│  PostgreSQL 16 · Redis 7 · Prisma Migrate               │
├─────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE                        │
│  Docker Compose · Nginx · S3 (CloudFront) · Sentry      │
│  Prometheus · Grafana · Loki · Jaeger                   │
└─────────────────────────────────────────────────────────┘
```

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) + NestJS 11 |
| **Language** | TypeScript (strict mode) |
| **Database** | PostgreSQL 16 with Prisma ORM |
| **Cache** | Redis 7 |
| **Auth** | JWT (access 15m + refresh 7d with rotation) |
| **Payments** | bKash, Nagad, SSLCommerz, COD |
| **Storage** | AWS S3 + CloudFront CDN |
| **Monitoring** | OpenTelemetry, Sentry, Prometheus, Grafana |
| **Container** | Docker & Docker Compose |
| **CI/CD** | GitHub Actions ready |

---

## 🏗️ Architecture

```
                         ┌──────────────┐
                         │   Browser     │
                         └──────┬───────┘
                                │ HTTPS
                         ┌──────▼───────┐
                         │   Next.js     │  SSR + Client Components
                         │   (Port 3000) │
                         └──────┬───────┘
                                │ API calls (/api/v1/*)
                         ┌──────▼───────┐
                         │   NestJS      │  REST + WebSocket
                         │  (Port 4000)  │
                         └──────┬───────┘
                    ┌───────────┼───────────┐
                    │           │           │
              ┌─────▼────┐ ┌───▼───┐ ┌────▼────┐
              │PostgreSQL│ │ Redis │ │   S3    │
              │  (5433)  │ │(6379) │ │ Storage │
              └──────────┘ └───────┘ └─────────┘
```

### Key Design Decisions

- **Backend global prefix**: `/api/v1` — all API routes are namespaced
- **Client‑side route guards**: Admin/Seller protection uses `AuthGuard` components (not middleware), because middleware can't read Zustand's localStorage‑persisted state
- **Refresh token rotation**: Each refresh issues a new token pair and invalidates the old one — limits window for token theft
- **Separate JWT secrets**: Access tokens and refresh tokens use different secrets with different expiry windows
- **Sticky sidebar layout**: Admin sidebar uses `position: sticky` with internal scroll — never disturbs the main content flow

---

## 📸 Screenshots

> 81 screenshots covering every page of the platform — admin panel, seller center, user experience, and more. All images are JPEG at 85% quality.

<details>
<summary>🏠 Home & Auth (4)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| Homepage | <img src="public/screenshots/home/homepage.jpg" width="240" alt="Homepage" /> |
| Login | <img src="public/screenshots/auth/login.jpg" width="240" alt="Login" /> |
| Register | <img src="public/screenshots/auth/register.jpg" width="240" alt="Register" /> |

</details>

<details>
<summary>📦 Products & Categories (3)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| Categories | <img src="public/screenshots/products/categories.jpg" width="240" alt="Categories" /> |
| Category (Electronics) | <img src="public/screenshots/products/category-electronics.jpg" width="240" alt="Category" /> |
| Product Detail | <img src="public/screenshots/products/product-detail.jpg" width="240" alt="Product Detail" /> |

</details>

<details>
<summary>🛒 Cart, Checkout & Orders (3)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| Shopping Cart | <img src="public/screenshots/cart-checkout/cart.jpg" width="240" alt="Cart" /> |
| Checkout | <img src="public/screenshots/cart-checkout/checkout.jpg" width="240" alt="Checkout" /> |
| Orders | <img src="public/screenshots/orders/orders.jpg" width="240" alt="Orders" /> |

</details>

<details>
<summary>👤 Account & Profile (4)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| Account Overview | <img src="public/screenshots/account/account.jpg" width="240" alt="Account" /> |
| Addresses | <img src="public/screenshots/account/addresses.jpg" width="240" alt="Addresses" /> |
| Wishlist | <img src="public/screenshots/account/wishlist.jpg" width="240" alt="Wishlist" /> |
| Settings | <img src="public/screenshots/account/settings.jpg" width="240" alt="Account Settings" /> |

</details>

<details>
<summary>🛠️ Admin Dashboard & CRUD (14)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| Dashboard | <img src="public/screenshots/admin/dashboard.jpg" width="240" alt="Admin Dashboard" /> |
| Products | <img src="public/screenshots/admin/products.jpg" width="240" alt="Admin Products" /> |
| Orders | <img src="public/screenshots/admin/orders.jpg" width="240" alt="Admin Orders" /> |
| Users | <img src="public/screenshots/admin/users.jpg" width="240" alt="Admin Users" /> |
| Sellers | <img src="public/screenshots/admin/sellers.jpg" width="240" alt="Admin Sellers" /> |
| Categories | <img src="public/screenshots/admin/categories.jpg" width="240" alt="Admin Categories" /> |
| Payments | <img src="public/screenshots/admin/payments.jpg" width="240" alt="Admin Payments" /> |
| Coupons | <img src="public/screenshots/admin/coupons.jpg" width="240" alt="Admin Coupons" /> |
| Reviews | <img src="public/screenshots/admin/reviews.jpg" width="240" alt="Admin Reviews" /> |
| Banners | <img src="public/screenshots/admin/banners.jpg" width="240" alt="Admin Banners" /> |
| Flash Sales | <img src="public/screenshots/admin/flash-sales.jpg" width="240" alt="Admin Flash Sales" /> |
| CMS Pages | <img src="public/screenshots/admin/cms.jpg" width="240" alt="Admin CMS" /> |
| Affiliates | <img src="public/screenshots/admin/affiliates.jpg" width="240" alt="Admin Affiliates" /> |
| Creators | <img src="public/screenshots/admin/creators.jpg" width="240" alt="Admin Creators" /> |

</details>

<details>
<summary>📊 Admin BI & Analytics (4)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| BI Dashboard | <img src="public/screenshots/admin-bi/bi-dashboard.jpg" width="240" alt="BI Dashboard" /> |
| RFM Analysis | <img src="public/screenshots/admin-bi/rfm.jpg" width="240" alt="RFM Analysis" /> |
| Cohort Analysis | <img src="public/screenshots/admin-bi/cohorts.jpg" width="240" alt="Cohort Analysis" /> |
| Reports | <img src="public/screenshots/admin-bi/reports.jpg" width="240" alt="BI Reports" /> |

</details>

<details>
<summary>💰 Admin Finance (4)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| Finance Dashboard | <img src="public/screenshots/admin-finance/finance-dashboard.jpg" width="240" alt="Finance Dashboard" /> |
| Settlements | <img src="public/screenshots/admin-finance/settlements.jpg" width="240" alt="Settlements" /> |
| Tax Reports | <img src="public/screenshots/admin-finance/tax.jpg" width="240" alt="Tax Reports" /> |
| Invoices | <img src="public/screenshots/admin-finance/invoices.jpg" width="240" alt="Invoices" /> |

</details>

<details>
<summary>🏭 Admin Warehouse (4)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| Warehouse Dashboard | <img src="public/screenshots/admin-warehouse/warehouse.jpg" width="240" alt="Warehouse" /> |
| Inbound Orders | <img src="public/screenshots/admin-warehouse/inbound.jpg" width="240" alt="Inbound" /> |
| Inventory | <img src="public/screenshots/admin-warehouse/inventory.jpg" width="240" alt="Inventory" /> |
| Pick Lists | <img src="public/screenshots/admin-warehouse/pick-lists.jpg" width="240" alt="Pick Lists" /> |

</details>

<details>
<summary>📦 Admin Fulfillment (4)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| Fulfillment Dashboard | <img src="public/screenshots/admin-fulfillment/fulfillment.jpg" width="240" alt="Fulfillment" /> |
| Courier Management | <img src="public/screenshots/admin-fulfillment/courier.jpg" width="240" alt="Courier" /> |
| Pickup Management | <img src="public/screenshots/admin-fulfillment/pickup.jpg" width="240" alt="Pickup" /> |
| Tracking | <img src="public/screenshots/admin-fulfillment/tracking.jpg" width="240" alt="Tracking" /> |

</details>

<details>
<summary>⚙️ Admin Settings & Misc (6)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| Real-Time Monitor | <img src="public/screenshots/admin/realtime.jpg" width="240" alt="Real-Time" /> |
| Reports | <img src="public/screenshots/admin/reports.jpg" width="240" alt="Reports" /> |
| Roles & Permissions | <img src="public/screenshots/admin/roles.jpg" width="240" alt="Roles" /> |
| Settings | <img src="public/screenshots/admin/settings.jpg" width="240" alt="Admin Settings" /> |
| Support Tickets | <img src="public/screenshots/admin/support.jpg" width="240" alt="Support" /> |
| Compliance | <img src="public/screenshots/admin/compliance.jpg" width="240" alt="Compliance" /> |

</details>

<details>
<summary>🏪 Seller Center (13)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| Dashboard | <img src="public/screenshots/seller/dashboard.jpg" width="240" alt="Seller Dashboard" /> |
| Products | <img src="public/screenshots/seller/products.jpg" width="240" alt="Seller Products" /> |
| Add Product | <img src="public/screenshots/seller/products-new.jpg" width="240" alt="New Product" /> |
| Orders | <img src="public/screenshots/seller/orders.jpg" width="240" alt="Seller Orders" /> |
| Inventory | <img src="public/screenshots/seller/inventory.jpg" width="240" alt="Seller Inventory" /> |
| Finance | <img src="public/screenshots/seller/finance.jpg" width="240" alt="Seller Finance" /> |
| Analytics | <img src="public/screenshots/seller/analytics.jpg" width="240" alt="Seller Analytics" /> |
| Store Profile | <img src="public/screenshots/seller/store.jpg" width="240" alt="Store Profile" /> |
| Settings | <img src="public/screenshots/seller/settings.jpg" width="240" alt="Seller Settings" /> |
| Campaigns | <img src="public/screenshots/seller/campaigns.jpg" width="240" alt="Campaigns" /> |
| Chat | <img src="public/screenshots/seller/chat.jpg" width="240" alt="Seller Chat" /> |
| AI Campaign Generator | <img src="public/screenshots/seller/ai-campaign-generator.jpg" width="240" alt="AI Campaign" /> |
| AI Description Generator | <img src="public/screenshots/seller/ai-description-generator.jpg" width="240" alt="AI Description" /> |

</details>

<details>
<summary>🔗 Affiliate Portal (5)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| Dashboard | <img src="public/screenshots/affiliate/dashboard.jpg" width="240" alt="Affiliate Dashboard" /> |
| Analytics | <img src="public/screenshots/affiliate/analytics.jpg" width="240" alt="Affiliate Analytics" /> |
| Earnings | <img src="public/screenshots/affiliate/earnings.jpg" width="240" alt="Affiliate Earnings" /> |
| Tracking Links | <img src="public/screenshots/affiliate/links.jpg" width="240" alt="Affiliate Links" /> |
| Products | <img src="public/screenshots/affiliate/products.jpg" width="240" alt="Affiliate Products" /> |

</details>

<details>
<summary>💻 Developer Portal (6)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| Dashboard | <img src="public/screenshots/developer/dashboard.jpg" width="240" alt="Developer Dashboard" /> |
| API Keys | <img src="public/screenshots/developer/api-keys.jpg" width="240" alt="API Keys" /> |
| Documentation | <img src="public/screenshots/developer/docs.jpg" width="240" alt="Dev Docs" /> |
| API Playground | <img src="public/screenshots/developer/playground.jpg" width="240" alt="Playground" /> |
| Usage Analytics | <img src="public/screenshots/developer/usage.jpg" width="240" alt="Usage" /> |
| Webhooks | <img src="public/screenshots/developer/webhooks.jpg" width="240" alt="Webhooks" /> |

</details>

<details>
<summary>🔔 Other Pages (8)</summary>
<br />

| Page | Screenshot |
|------|-----------|
| Flash Sale | <img src="public/screenshots/other/flash-sale.jpg" width="240" alt="Flash Sale" /> |
| Notifications | <img src="public/screenshots/other/notifications.jpg" width="240" alt="Notifications" /> |
| Messages | <img src="public/screenshots/other/messages.jpg" width="240" alt="Messages" /> |
| Wallet | <img src="public/screenshots/other/wallet.jpg" width="240" alt="Wallet" /> |
| Help Center | <img src="public/screenshots/other/help.jpg" width="240" alt="Help" /> |
| Support Tickets | <img src="public/screenshots/other/support-tickets.jpg" width="240" alt="Support Tickets" /> |
| Live Chat | <img src="public/screenshots/other/support-chat.jpg" width="240" alt="Live Chat" /> |
| AI Assistant | <img src="public/screenshots/other/ai-assistant.jpg" width="240" alt="AI Assistant" /> |

</details>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** (recommended) or npm
- **Docker Desktop** (for PostgreSQL + Redis)
- **Git**

### 1. Clone & Install

```bash
git clone https://github.com/your-org/amarshop.git
cd amarshop

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../src  # or root
npm install
```

### 2. Environment Variables

Copy the template file to `.env` in both the root and `backend/` directories:

```bash
# Root (frontend)
cp .env.example .env

# Backend
cp .env.example backend/.env
```

Then edit each `.env` with your real values. See `.env.example` for all available variables.

Key variables to configure:
| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres:...` | PostgreSQL connection string |
| `JWT_SECRET` | (required) | JWT signing secret — generate a strong random value |
| `JWT_REFRESH_SECRET` | (required) | JWT refresh secret — different from JWT_SECRET |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api/v1` | Backend API base URL (client‑safe) |

### 3. Start Infrastructure

```bash
docker compose up -d postgres redis
```

### 4. Run Database Migrations

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 5. Seed Data (Optional)

```bash
cd backend
npx ts-node prisma/seed.ts
# or for products only:
npx ts-node prisma/seed-products.ts
```

### 6. Start Development

```bash
# Terminal 1 — Backend
cd backend
npm run start:dev

# Terminal 2 — Frontend
cd ..  # root
npx next dev --turbopack
```

### 7. Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@amarshop.com` | `admin123` |
| **Seller** | `seller@amarshop.com` | `seller123` |
| **Customer** | `customer@amarshop.com` | `customer123` |

---

## 📁 Project Structure

```
amarshop/
├── backend/                    # NestJS API server
│   ├── prisma/                 # Schema, migrations, seeds
│   │   ├── schema.prisma       # 97 tables
│   │   ├── seed.ts
│   │   └── seed-products.ts
│   └── src/
│       ├── modules/
│       │   ├── admin/          # Admin panel endpoints
│       │   ├── auth/           # JWT auth, roles guard
│       │   ├── bi/             # RFM, cohorts, analytics
│       │   ├── fulfillment/    # Shipments, couriers
│       │   ├── wms/            # Warehouse management
│       │   ├── finance/        # Settlements, invoices, tax
│       │   ├── compliance/     # KYC, disputes
│       │   └── realtime/       # WebSocket gateway
│       └── common/             # Guards, decorators, interceptors
│
├── src/                        # Next.js frontend
│   ├── app/
│   │   ├── admin/              # 30+ admin page routes
│   │   ├── seller/             # Seller dashboard routes
│   │   ├── account/            # User account pages
│   │   ├── auth/               # Login, register
│   │   ├── orders/             # Order tracking
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout flow
│   │   └── products/           # Product listing/detail
│   ├── components/             # Shared React components
│   │   ├── auth/               # AuthGuard, providers
│   │   └── layout/             # Header, footer, sidebar
│   ├── lib/
│   │   └── api/                # API client + admin helpers
│   ├── stores/                 # Zustand stores (auth, cart)
│   └── services/               # HTTP client, API wrapper
│
├── docker-compose.yml          # PostgreSQL, Redis, etc.
├── AGENTS.md                   # AI assistant instructions
└── README.md
```

---

## 📡 API Overview

All API routes are prefixed with `/api/v1`.

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Email or phone + password |
| POST | `/auth/register` | Create account |
| POST | `/auth/refresh` | Rotate refresh token |
| POST | `/auth/logout` | Revoke refresh token |
| GET | `/auth/profile` | Current user |

### Admin (`/admin/*`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/dashboard` | Stats + revenue chart |
| GET | `/admin/products` | Paginated product list |
| GET | `/admin/orders` | Orders with filters |
| GET | `/admin/users` | User management |
| GET | `/admin/sellers` | Seller + KYC status |
| GET | `/admin/payments` | Transaction log |
| GET | `/admin/reviews` | Review moderation |
| PUT | `/admin/reviews/:id` | Approve / hide / delete |
| GET | `/admin/finance/dashboard` | Revenue + settlements |
| GET | `/admin/coupons` | Coupon management |
| GET | `/admin/banners` | Banner management |
| GET | `/admin/flash-sales` | Flash sale campaigns |
| GET | `/admin/support-tickets` | Ticket list + detail |
| GET | `/admin/analytics` | BI analytics data |
| GET | `/admin/reports/:type` | Custom reports |
| GET | `/admin/compliance` | KYC + disputes overview |
| GET | `/wms/dashboard/:id` | Warehouse metrics |
| GET | `/wms/stock-alerts/:id` | Low‑stock alerts |
| GET | `/bi/rfm-segments` | RFM customer segments |
| GET | `/bi/cohorts` | Cohort retention data |
| GET | `/fulfillment/courier-performance` | Courier stats |

---

## 🔒 Security

- **JWT with refresh rotation** — Access tokens expire in 15 minutes; refresh tokens (7 days) are rotated on each use and invalidated server‑side
- **Role‑based guards** — `@Roles('ADMIN')` decorator + `RolesGuard` on every protected route
- **Rate limiting** — Built‑in throttling to prevent abuse
- **Input validation** — `class-validator` + `class-transformer` on all DTOs
- **Audit logging** — Interceptor logs admin mutations
- **API key scoping** — Developer module supports scoped API keys
- **HTTPS** — Enforced in production via Nginx reverse proxy

### ⚠️ Secrets in Git History

**WARNING:** If you previously cloned or forked this repository before the secret-safety pass (July 2026), the following secrets may exist in your local git history and must be rotated immediately:

| Secret | Previous Value | Files Affected |
|--------|---------------|----------------|
| Database password | `shawon12` | `backend/prisma/seed.ts`, `backend/prisma/seed-products.ts`, `backend/prisma/demo-seed.ts`, `backend/prisma.config.ts`, `backend/test/global-setup.ts`, `backend/src/common/prisma.service.ts` |
| JWT fallback secret | `your-secret-key-change-in-production` | `src/lib/auth/jwt.ts` |

**Action required:**
1. **Rotate these secrets in production** — the old values are compromised
2. **Run `git filter-branch` or BFG Repo-Cleaner** to purge them from your git history if this is a public repository
3. **Any forks or clones** should be re-cloned from the cleaned repository

See [.env.example](./.env.example) for all required environment variables.

---

## 🐳 Deployment

### Docker Compose (Production)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

This spins up:
- **PostgreSQL 16** on port `5433`
- **Redis 7** on port `6379`
- **NestJS backend** (compiled)
- **Next.js frontend** (standalone output)
- **Nginx** reverse proxy (optional)

### Manual Deployment

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd ..
npx next build

# Run with PM2 or systemd
pm2 start backend/dist/main.js --name amarshop-api
pm2 start node_modules/.bin/next --name amarshop-web -- start -p 3000
```

### Environment Variables Required in Production

```
DATABASE_URL, REDIS_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET,
NEXT_PUBLIC_API_URL, S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY,
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
SSLCOMMERZ_STORE_ID, SSLCOMMERZ_STORE_PASSWORD,
BKASH_MERCHANT_NUMBER, BKASH_API_KEY,
NAGAD_MERCHANT_NUMBER, NAGAD_API_KEY,
SENTRY_DSN, OTEL_EXPORTER_OTLP_ENDPOINT
```

---

## ⚠️ Security: Secret Rotation Required

If you cloned or forked this repository, **any secrets that were previously hardcoded still exist in git history**, even if they've been moved to environment variables in the latest commit.

**Immediately rotate the following if you've used this codebase:**
- Database password (`shawon12` was previously hardcoded)
- JWT signing secrets (`amarshop-jwt-secret-2026-prod` and `amarshop-refresh-secret-2026-prod` were previously hardcoded)
- Encryption key (`amarshop-encryption-key-2026` was previously the fallback)

To purge secrets from git history, use [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) or `git filter-branch`.

---

## 📄 License

**MIT** — See [LICENSE](./LICENSE) for details.

---

<p align="center">
  <b>AmarShop</b> — Built with ❤️ for the Bangladeshi e‑commerce ecosystem.<br />
  <i>Questions? Reach out via <a href="https://github.com/your-org/amarshop/issues">GitHub Issues</a>.</i>
</p>
