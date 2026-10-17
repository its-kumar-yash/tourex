# Desi Tours and Travels

Repository name: `tourex`.

Tours and travel website: package listings with photos, itinerary and prices,
booking requests, user accounts, an admin dashboard and traffic analytics.

Stack: Next.js 15 (App Router, TypeScript), Tailwind CSS 4, Supabase
(Postgres, Auth, Storage), Google Analytics 4.

## Getting started

```bash
nvm use            # Node 22, see .nvmrc
npm install
cp .env.example .env.local   # fill in Supabase keys
npm run dev
```

Open http://localhost:3000.

## Project layout

```
src/app/            routes (App Router)
src/components/     UI and layout components
src/lib/supabase/   browser, server and admin Supabase clients
src/middleware.ts   session refresh on every request
docs/PLAN.md        phased implementation plan and data model
```

## Database

Schema lives in `supabase/migrations/`, sample data in `supabase/seed.sql`.
No Docker and no CLI login needed: both commands connect straight to the
project with `SUPABASE_DB_URL` from `.env.local` (Supabase dashboard →
Connect → Session pooler, port 5432).

```bash
npm run db:push          # apply migrations
npm run db:seed          # load supabase/seed.sql (safe to re-run)
```

Promote your own account to admin after signing up on the site, in the
SQL editor:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```
