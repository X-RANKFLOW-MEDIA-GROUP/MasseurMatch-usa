# Copilot / AI Agent Instructions for MasseurMatch

Welcome — this file captures the essential knowledge an AI coding agent needs to be immediately productive in this repo.

## Quick orientation ✅
- Monorepo-style project with 3 main apps:
  - `masseurmatch-nextjs` (Next.js frontend + API routes - primary app)
  - `ia-backend` (Node/Express micro service for auxiliary AI endpoints)
  - `dashboard-vite` (admin dashboard built with Vite)
- Database: **Supabase (Postgres)** — schema and authoritative enums live in `sql/` and `SUPABASE-SCHEMA-SETUP.md`.
- Payments & identity: **Stripe** (see `lib/stripe.ts`, `app/api/stripe/**`).
- Moderation: **Sightengine** used for photo moderation (see `lib/sightengine.ts`).

## Big picture architecture (what to know) 🔧
- The Next.js app uses the **App Router** (`/app`) and implements server route handlers as `route.ts` files under `app/api/*`.
- Server-side Supabase clients are created via `lib/supabase/server.ts` (`createServerSupabaseClient`) and client/browser via `lib/supabase.ts`.
- Onboarding logic is centralized in `lib/onboarding/stateMachine.ts` (state names, transitions, validation rules). Treat it as the source of truth for onboarding flow.
- Publishing rules and auto-publish logic: see `lib/auto-approve.ts` and `lib/onboarding/*` — these contain domain rules (identity verified, moderation passed, no duplicate display names).

## Key workflows — run, test, debug ▶️
- Run the frontend (from repo root):
  - `npm run dev` (this forwards to `masseurmatch-nextjs`) or `cd masseurmatch-nextjs && npm run dev`
- Backend service (ia-backend):
  - `cd ia-backend && npm install && npm run dev`
- Database & schema:
  - Authoritative SQL in `sql/onboarding_schema_supabase.sql` and other SQL files.
  - See `SUPABASE-SCHEMA-SETUP.md` and `nextjs-implementation/` (contains migration/seed scripts and guides).
- Tests & linting (frontend):
  - `cd masseurmatch-nextjs && npm test` (Vitest)
  - Run coverage: `npm run test:coverage`
  - Lint: `npm run lint`

## Project-specific conventions and gotchas ⚠️
- Server/client split: use `createServerSupabaseClient()` in server contexts (see `lib/supabase/server.ts`) and the browser supabase client for client-side code.
- Onboarding stages and enums are used across SQL, TypeScript types, and state machine code. If you change an enum:
  - Update the SQL migration (`sql/*.sql`) and `SUPABASE-SCHEMA-SETUP.md`
  - Update TypeScript types in `lib/onboarding/stateMachine.ts` and `lib/types/database.ts` (watch for mismatches)
- Photo moderation: if Sightengine credentials are missing, the code falls back to `auto_flagged` mode — do not assume moderation will always pass in local dev.
- Rate validation rules: the `33% rule` lives in `lib/onboarding/validators.ts` and is covered by unit tests in `lib/onboarding/__tests__`. Keep tests up-to-date when changing pricing logic.
- Stripe: `lib/stripe.ts` expects `STRIPE_SECRET_KEY` and plan `STRIPE_PRICE_*` env vars. Webhook verification is implemented — modify tests to stub `stripe.webhooks.constructEvent` when needed.

## Integration points & secrets 🔐
- Required env vars (examples):
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `STRIPE_SECRET_KEY`, `STRIPE_PRICE_STANDARD`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_ELITE`, `STRIPE_WEBHOOK_SECRET`
  - `SIGHTENGINE_API_USER`, `SIGHTENGINE_API_SECRET`
- Webhook endpoints: `app/api/stripe/webhook/route.ts`, `app/api/subscription/webhook/route.ts`, and identity webhooks in `app/api/identity/webhook/route.ts`.
- Database seeds & helpers: see `nextjs-implementation/` scripts and `sql/` directory.

## Testing guidance for agents ✅
- Add tests alongside logic (Vitest). Look at `lib/onboarding/__tests__` for examples of testing validators and state logic.
- For integrations that require secrets (Stripe/Sightengine), prefer **stubbing** the client or returning deterministic mock responses in tests.
- Run `npm run test:run` in `masseurmatch-nextjs` during PRs or when updating domain logic.

## Files / places to inspect for common tasks 📁
- Onboarding & publishing: `lib/onboarding/stateMachine.ts`, `lib/onboarding/validators.ts`, `lib/auto-approve.ts`
- Supabase helpers: `lib/supabase.ts`, `lib/supabase/server.ts`, `lib/supabase/*`
- Moderation: `lib/sightengine.ts`
- Stripe: `lib/stripe.ts`, `app/api/stripe/**`
- API routes (Next.js App Router): `app/api/**/*/route.ts` (onboarding, subscription, identity, explore)
- SQL and migrations: `sql/` and `SUPABASE-SCHEMA-SETUP.md`
- Seed & CI scripts: `nextjs-implementation/` (see `apply-schema-*`, `seed-*` scripts)

## Best practices for PRs (what reviewers expect) ✔️
- Explain DB changes and include SQL migrations or `SUPABASE-SCHEMA-SETUP.md` updates.
- Update TypeScript types if you modify enums or DB shapes (search for the same enum across `lib/` and `lib/types/`).
- Add or update unit tests for business logic (validators, state transitions, auto-approve flow).
- Do not commit secrets — verify `.env.local` is ignored.

---

If something in the above is unclear or you'd like more examples (e.g., a code snippet for stubbing Stripe in Vitest), tell me which section to expand and I'll iterate. 🙏
