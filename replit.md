# Proxi Nigeria
A hyper-local marketplace connecting traders, skilled workers, and earners across Nigeria's informal economy — buy, sell, hire, and complete tasks in your neighbourhood.

## Run & Operate
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

### Running the apps
- `pnpm --filter @workspace/proxi run dev` — run the web app (Vite, React)
- `pnpm --filter @workspace/proxi-mobile run start` — start the Expo dev server (mobile app)

## Stack
- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Web app: React + Vite + React Router
- Mobile app: Expo + Expo Router + React Native (iOS, Android, Web)
- Live backend: hosted on Railway at `https://proxi-production.up.railway.app`

## Where things live
- `artifacts/proxi/` — React web app (Vite + React Router)
- `artifacts/proxi-mobile/` — Expo mobile app (Expo Router)
- `packages/api-server/` — Express 5 API server
- `packages/db/` — Drizzle ORM schema (source of truth for DB structure)
- `packages/api-spec/` — OpenAPI spec (source of truth for API contracts)
- `packages/api-spec/generated/` — Orval-generated hooks and Zod schemas (do not edit manually)

## Architecture decisions
- **Monorepo with pnpm workspaces** — web app, mobile app, API server, and DB schema are separate packages sharing types and generated code via the workspace.
- **Orval codegen from OpenAPI** — all API hooks and Zod validation schemas are generated from the OpenAPI spec. Always run `codegen` after changing the spec; never hand-edit files in `generated/`.
- **Expo Router for mobile navigation** — file-based routing mirrors the tab + stack structure (Explore, Post, Inbox, Profile tabs; onboarding as a separate stack before tabs are shown).
- **Railway for backend hosting** — the live API at `proxi-production.up.railway.app` is what both the web app and mobile app fetch from. Local dev can point to `localhost:5000` via env override.
- **Trust score computed server-side** — trust scores are not stored as a single column; they are calculated from verification events (phone, ID, reviews, transactions) and returned as a derived field on user responses.

## Product
Proxi has two user-facing surfaces:

**Web app** (`artifacts/proxi`)
- Homepage with live listings and tasks fetched from the Railway API, hero search, category filter chips, and a stats bar showing live counts
- Listing detail page with image gallery, price, location, seller trust score, and a Message Seller CTA
- Admin dashboard for internal platform data
- Fully responsive: mobile (hamburger menu, stacked layout), tablet (2-column grids), desktop (3–4 column grids, inline search)

**Mobile app** (`artifacts/proxi-mobile`)
- 5-screen onboarding: Splash → Phone signup → OTP → User type selection (Trader / Skilled / Earner) → Location → Profile setup
- 4-tab main app:
  - **Explore** — nearby listings, open tasks, top traders carousels; listing/task detail screens; notifications
  - **Post** — post type picker → multi-step forms for Product, Service, or Task listings (photos, pricing, escrow info)
  - **Inbox** — chat threads with offer cards (accept/counter/decline), order escrow timeline, task applications
  - **Profile** — trust score ring, verification breakdown, wallet (balance, add, withdraw, transaction history), reviews
- Notifications system: bell icon with live unread badge, 7 notification types, mark-all-as-read with haptic feedback
- Responsive for all screen sizes; on web the app renders centred in a 480px container

**Three user types:** Trader (sells goods/vehicles), Skilled Worker (offers services), Earner (completes gig tasks)

## User preferences
- Use Nigerian Naira (₦) for all currency display
- Use Nigerian names and Lagos locations for all dummy/seed data (e.g. Emeka, Blessing, Chukwudi; Ikeja, Surulere, Lagos Island)
- Trust score colour coding: green for 70–100, amber for 40–69, red for 0–39
- All new screens should include realistic dummy data — no empty shells
- Pro-only features should show a "Pro" badge and an upgrade prompt when accessed on a free account

## Gotchas
- Never hand-edit files inside `packages/api-spec/generated/` — always regenerate via `pnpm --filter @workspace/api-spec run codegen` after updating the OpenAPI spec
- Always run `pnpm --filter @workspace/db run push` after schema changes before testing API endpoints locally
- The mobile app's web preview centres itself in a 480px max-width container — this is intentional (phone preview behaviour), not a bug
- Card widths in the mobile app use `useWindowDimensions()` — don't hardcode widths in list/card components
- Trust scores are derived fields, not stored columns — do not try to write a trust score directly to the DB

## Pointers
- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Live API base URL: `https://proxi-production.up.railway.app`
- OpenAPI spec location: `packages/api-spec/` — this is the contract between frontend and backend
- DB schema source of truth: `packages/db/` (Drizzle)