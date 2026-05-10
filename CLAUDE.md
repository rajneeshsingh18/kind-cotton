# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev

# Build (runs prisma migrate deploy first, then next build)
npm run build

# Start production server
npm run start

# Lint
npm run lint

# After installing dependencies (auto-runs postinstall)
npx prisma generate

# Database migrations
npx prisma migrate dev --name <migration-name>
npx prisma studio  # GUI for database
npx prisma db seed  # Seed initial categories and products
```

**No test framework is configured** (no Jest, Vitest, Playwright, or Cypress).

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — PostgreSQL connection string (Neon)
- `AUTH_SECRET` — NextAuth session secret
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth credentials
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — Razorpay payment keys

## Architecture

### Stack
- **Next.js 15 (canary) App Router** with React 19
- **TailwindCSS v4** (PostCSS plugin, not the legacy config)
- **Prisma 6** with PostgreSQL (Neon)
- **NextAuth v5 (beta)** — JWT sessions, Google OAuth, Prisma adapter
- **Zustand** — client-side cart state (persisted to localStorage under key `cart-storage`)
- **Redux Toolkit** — theme (light/dark) and UI state (announcement banner); see `src/store/`
- **shadcn/ui** — component library (new-york style, neutral base, Lucide icons)
- **Razorpay** — payment processing (INR, amounts in paise)
- **framer-motion** — animations (QuickView modal, product cards)

### Directory Structure

```
src/
├── app/
│   ├── (auth)/          # Login page, no main layout
│   ├── (main)/          # Cart, checkout, products — wrapped in main layout
│   ├── admin/           # Admin dashboard + product management (role-protected)
│   ├── api/             # API routes: auth, razorpay, address, products, cart, checkout, admin, webhooks
│   └── postcard/        # Postcard feature
├── components/
│   ├── ui/              # shadcn/ui primitives
│   ├── modules/         # Feature components (homepage, products, cart, postcard)
│   ├── checkout/        # Checkout-specific components
│   └── shared/          # Header and Footer layout components
├── lib/
│   ├── auth/index.ts    # NextAuth config
│   ├── db/index.ts      # Prisma client singleton
│   ├── payments/        # Payment utilities
│   └── razorpay.ts      # Razorpay script loader
├── store/
│   ├── cart.store.ts    # Zustand cart store
│   ├── index.ts         # Redux store (theme + ui slices)
│   ├── theme.slice.ts   # setTheme / toggleTheme actions
│   └── ui.slice.ts      # dismissBanner action
├── config/              # Site config, navigation, theme
├── hooks/
├── types/
└── middleware.ts        # Protects /admin routes — checks session + ADMIN role
```

### Key Patterns

**Route protection**: `src/middleware.ts` guards all `/admin/*` routes. It checks both the session and the user's `role === "ADMIN"` (stored in JWT via auth callbacks).

**Database access**: Use the Prisma singleton from `src/lib/db/index.ts`. Never instantiate `PrismaClient` directly.

**Auth session**: The session contains `user.id` and `user.role` (injected in the `session` and `jwt` callbacks in `src/lib/auth/index.ts`). Only Google OAuth is configured — no email/password auth. Call `await auth()` in server components/routes to get the session.

**Cart state**: Zustand store in `src/store/cart.store.ts` handles all cart logic client-side. Cart is persisted to localStorage.

**Theme state**: Redux Toolkit manages theme (light/dark) and UI state. The `ThemeApplier` component reads the Redux store and applies `.dark` to `<html>`. Dark mode uses a `.dark` class strategy, not `prefers-color-scheme` at runtime.

**Payment flow** (Razorpay):
1. `/api/razorpay/customer` — create/fetch Razorpay customer
2. `/api/razorpay/order` — create order (amount in paise)
3. Client-side Razorpay checkout modal
4. `/api/razorpay/verify` — verify payment signature, update Order in DB

**Database schema**: Core models are `User`, `Product`, `ProductVariant`, `Order`, `OrderItem`, `Category`, `Review`, `Address`. Orders store `razorpayOrderId`, `razorpayPaymentId`, and `razorpaySignature`.

### Build Notes

- ESLint is intentionally disabled during builds (`ignoreDuringBuilds: true` in `next.config.ts`)
- `vercel.json` disables manifest mismatch errors
- Image domains allowed: `bing.com`, `pexels.com`, `unsplash.com`
- Webpack alias: `react-native` → `react-native-web`
- Path alias `@/*` maps to `src/*`
