# Desi Tours and Travels

Tours and travel website: package listings with photos, itinerary and prices,
booking requests, user accounts, an admin dashboard and traffic analytics.
Repository name: `tourex`.

Stack: Next.js 15 (App Router, TypeScript), Tailwind CSS 4, Supabase
(Postgres, Auth, Storage), Google Analytics 4 plus first-party events.

## Getting started

```bash
nvm use                      # Node 22, see .nvmrc
npm install
cp .env.example .env.local   # fill in Supabase keys, see below
npm run dev
```

Open http://localhost:3000.

## Environment

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API (project URL, no path) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same page, anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | same page, service role key (server only) |
| `SUPABASE_DB_URL` | Supabase → Connect → direct or session pooler URI with password |
| `NEXT_PUBLIC_SITE_URL` | public URL of the site, used in emails and sitemap |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement id, optional |

In Supabase → Authentication → URL Configuration set the Site URL to your
public URL and add `<site>/auth/callback` to the redirect list, so
confirmation and password-reset emails come back to the app.

## Database

Schema lives in `supabase/migrations/`, sample data in `supabase/seed.sql`.
No Docker and no CLI login needed; both commands connect straight to the
project with `SUPABASE_DB_URL`.

```bash
npm run db:push    # apply migrations
npm run db:seed    # load the 8 sample packages (safe to re-run)
npm run db:types   # regenerate src/lib/supabase/types.ts from the live schema
```

Make yourself admin after signing up on the site, in the SQL editor:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

From then on admins can promote others from Admin → Users.

## What is where

```
src/app/                    routes
  page.tsx                  home
  packages/                 list with filters, [slug] detail
  (auth)/                   login, signup, forgot-password, reset-password
  auth/callback, confirm    email link handlers
  account/                  bookings and profile (signed in)
  admin/                    dashboard: overview, packages, bookings, users, analytics
  api/track                 first-party analytics beacon
src/components/             UI, layout, home, packages, admin, analytics
src/lib/data/packages.ts    public reads (cookie-less client, cacheable)
src/lib/*/actions.ts        server actions (auth, bookings, admin)
src/lib/supabase/           browser, server, public and admin clients, types
src/middleware.ts           session refresh and route protection
supabase/                   migrations and seed
docs/PLAN.md                the original phased plan and data model
```

## How it works

- **Public pages are static.** Home and package pages render from a
  cookie-less Supabase client and revalidate hourly; admin edits call
  `revalidatePath` so changes show immediately.
- **Row-level security does the real access control.** Anonymous visitors see
  published packages only; users see their own bookings; the admin role is
  checked by a Postgres function used in every policy and by the admin layout.
- **Booking totals are computed in the database** by a trigger, never trusted
  from the client. Guests over the package limit and past dates are rejected.
- **Analytics** sends page and package views to `/api/track` with an anonymous
  30-minute session cookie and no personal data. The admin analytics page reads
  from SQL views bucketed in Asia/Kolkata. GA4 loads only when its id is set.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | development server |
| `npm run build` / `npm start` | production build and server |
| `npm run lint`, `npm run typecheck` | checks |
| `npm run db:push`, `db:seed`, `db:types` | database tasks |

## Deploying

Vercel: import the GitHub repo, add the environment variables above, set
`NEXT_PUBLIC_SITE_URL` to the production URL and update the Supabase auth
URLs. No other configuration is required.
