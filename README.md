# Tourex

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
