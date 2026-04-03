# KindCotton — Sustainable Fashion E-Commerce

A full-stack e-commerce platform built with **Next.js 15 App Router**, designed around a bespoke **"Tactile Editorial"** design system. KindCotton sells sustainable cotton clothing with a premium, editorial UI inspired by organic textures and soft minimalism.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, canary) |
| Language | TypeScript |
| Styling | TailwindCSS v4 + custom design system |
| Fonts | Epilogue (display) · Inter (body) |
| Database | PostgreSQL via [Neon](https://neon.tech) |
| ORM | Prisma 6 |
| Auth | NextAuth v5 (beta) — Google OAuth, JWT sessions |
| State — Server | Server Components + Prisma direct queries |
| State — Client | Redux Toolkit (theme, UI) · Zustand (cart) |
| Payments | Razorpay (INR) |
| Animations | Framer Motion |
| UI Components | shadcn/ui (new-york style) |
| Deployment | Vercel |

---

## Features

### Storefront
- **Homepage** — Hero video, category navigation, limited-time deals countdown, featured products, sustainability pillars, newsletter signup, testimonials carousel, and a final CTA section
- **Product listing** — Animated grid with filtering by category
- **Product detail** — Full product page with variant selection
- **Quick View** — Framer Motion modal, accessible, glassmorphism surface
- **Cart** — Zustand-powered client-side cart with localStorage persistence

### Checkout & Payments
- Multi-step checkout with address selection
- Razorpay integration: customer creation → order creation → client-side payment modal → server-side signature verification
- Order stored with `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`

### Authentication
- Google OAuth via NextAuth v5
- JWT sessions — `user.id` and `user.role` injected into all sessions
- Middleware-protected `/admin` routes (redirects non-`ADMIN` users)

### Admin
- Product management — create, edit, list products with variants
- Dashboard overview

### UI / UX
- **Dark / Light theme** — toggled via Redux, persisted to `localStorage`, respects `prefers-color-scheme` on first visit
- **Announcement banner** — dismissible via Redux `ui` slice
- **Scroll-to-top** button — appears after 400px scroll
- **Accessibility** — `FocusTrap` on mobile nav drawer, ARIA labels throughout

---

## Design System — The Tactile Editorial

The UI is governed by a custom design token system (`--kc-*` CSS variables) that maps directly to Tailwind utility classes via `@theme inline`.

### Color Palette

| Token | Light | Dark |
|---|---|---|
| `--kc-primary` | `#344b2e` (eco green) | `#8fc98a` (sage) |
| `--kc-background` | `#f9f9f7` (warm white) | `#0e1410` (deep forest) |
| `--kc-on-surface` | `#1a1c1b` (charcoal) | `#dde4dc` (off-white) |
| `--kc-surface-lowest` | `#ffffff` | `#090d09` |

Surface hierarchy goes from `surface-lowest` → `surface-low` → `surface-container` → `surface-high` → `surface-highest` — depth is expressed through tonal layering, not borders.

### Typography
- **Epilogue** — display headlines, brand wordmark, product prices (`font-display` class)
- **Inter** — all body copy, UI labels, navigation

### Key Rules
- **No explicit 1px borders** — section separation uses background tonal shifts
- **Ambient shadows only** — `0 12px 40px rgba(26, 28, 27, 0.06)` (`.kc-shadow`)
- **Primary CTA** — 145° gradient from `#344b2e` → `#4b6344` (`.kc-btn-primary`)
- **Glass surfaces** — 80% opacity + 20px backdrop blur (`.kc-glass`) — used on the sticky header

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — fonts, Redux + ThemeApplier, announcement banner
│   ├── page.tsx                # Homepage (Server Component, fetches featured products)
│   ├── globals.css             # Design tokens, Tailwind theme, utility classes
│   ├── (auth)/login/           # Login page (no main layout)
│   ├── (main)/                 # Cart, checkout, products — wrapped in main layout
│   ├── admin/                  # Protected admin dashboard + product CRUD
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth handlers
│       ├── razorpay/           # order/, customer/, verify/
│       ├── address/            # Address CRUD
│       ├── products/           # Product API
│       ├── cart/               # Cart API
│       ├── checkout/           # Checkout flow
│       ├── admin/              # Admin API routes
│       └── webhooks/           # Payment webhooks
├── components/
│   ├── ui/                     # shadcn/ui primitives + ThemeToggle, ScrollToTop
│   ├── modules/
│   │   ├── homepage/           # HeroSection, CategoryNav, DealsSection, SustainabilitySection,
│   │   │                       #   NewsletterSignup, AnnouncementBanner
│   │   ├── products/           # ProductCard, ProductCarousel, AnimatedProductGrid, QuickViewModal
│   │   ├── cart/               # Cart components
│   │   └── auth/               # AuthButtons
│   ├── checkout/               # AddressSelection
│   ├── shared/
│   │   ├── header/             # Header (server) → HeaderClient (client, glass, ThemeToggle)
│   │   └── footer/             # Footer
│   └── providers/
│       ├── ReduxProvider.tsx   # <Provider store={store}>
│       └── ThemeApplier.tsx    # Reads Redux theme → applies .dark class to <html>
├── store/
│   ├── index.ts                # configureStore
│   ├── theme.slice.ts          # setTheme / toggleTheme
│   ├── ui.slice.ts             # dismissBanner
│   └── cart.store.ts           # Zustand cart store (persisted)
├── lib/
│   ├── auth/index.ts           # NextAuth config — Google provider, JWT callbacks
│   ├── db/index.ts             # Prisma singleton
│   └── razorpay.ts             # Razorpay script loader
├── hooks/
│   └── use-quick-view.ts       # Zustand store for QuickView modal state
├── middleware.ts                # Protects /admin — checks session + ADMIN role
└── types/
```

---

## Database Schema (Prisma)

```
User          ── has many → Account, Session, Address, Order, Review
Product       ── has many → ProductVariant, Review
              ── belongs to → Category
Order         ── has many → OrderItem
              ── has one  → ShippingAddress (Address)
              ── stores   → razorpayOrderId, razorpayPaymentId, razorpaySignature
```

**Enums:** `Role` (USER · ADMIN) · `OrderStatus` (PENDING → PROCESSING → SHIPPED → DELIVERED · CANCELLED) · `Size` (XS–XXL)

---

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd kind-cotton
npm install
```

### 2. Environment variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://...       # Neon PostgreSQL connection string
AUTH_SECRET=...                     # NextAuth secret (generate with: openssl rand -base64 32)
AUTH_GOOGLE_ID=...                  # Google OAuth client ID
AUTH_GOOGLE_SECRET=...              # Google OAuth client secret
RAZORPAY_KEY_ID=...                 # Razorpay test key ID
RAZORPAY_KEY_SECRET=...             # Razorpay test secret
```

### 3. Database setup

```bash
npx prisma migrate dev --name init
# or for production:
npx prisma migrate deploy
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

```bash
npm run dev          # Start dev server (Next.js HMR)
npm run build        # prisma migrate deploy && next build
npm run start        # Start production server
npm run lint         # ESLint
npx prisma studio    # Open Prisma GUI for database
npx prisma generate  # Re-generate Prisma client after schema changes
```

---

## Payment Flow (Razorpay)

1. User proceeds to checkout → selects address
2. **`POST /api/razorpay/customer`** — create or fetch Razorpay customer
3. **`POST /api/razorpay/order`** — create Razorpay order (amount in paise, currency INR)
4. Client-side Razorpay checkout modal opens
5. On success → **`POST /api/razorpay/verify`** — verifies HMAC signature, updates `Order` status in DB

---

## Admin Access

Set a user's `role` to `ADMIN` directly in the database (via Prisma Studio or migration seed). The middleware at `src/middleware.ts` blocks all `/admin/*` routes for non-admin sessions.

---

## Deployment

The project is configured for **Vercel**. `vercel.json` disables manifest mismatch errors. The `build` script runs `prisma migrate deploy` before `next build`, so database migrations apply automatically on each deploy.

```bash
vercel deploy
```

Ensure all environment variables are set in the Vercel project dashboard.
