# Tourex — Implementation Plan

Tours and travel website with package listings, package details, auth, booking requests,
an admin dashboard and traffic analytics. Reference design: `docs/design-reference.webp`.

## Decisions (confirmed 18 Oct 2026)

| Area | Decision |
|------|----------|
| Location | `~/Desktop/Project/tourex`, fresh git repo |
| Stack | Next.js 15 (App Router, TypeScript), Tailwind CSS v4, Supabase (Postgres + Auth + Storage), `@supabase/ssr` |
| Runtime | Node 22 via `.nvmrc` (machine default is 18; Next 15 needs 18.18+) |
| Booking | Booking *request*: user picks dates + guests, row created as `pending`, admin confirms or rejects. No payments. |
| Analytics | GA4 (`@next/third-parties`) for traffic **plus** first-party events in a Supabase table so the admin dashboard shows visitors and popular packages |
| Hosting | Vercel (assumed; nothing in the code depends on it) |
| Scope | Tours/packages only. The Flight and Hotels tabs from the design are rendered but disabled ("coming soon"). |

## Assumptions to confirm

1. **Supabase project** — you create it on supabase.com; I need the project URL, anon key and service-role key placed in `.env.local` (never pasted in chat). Migrations run with `npx supabase db push` or via the SQL editor.
2. **Sign-in methods** — email + password with email verification. Google OAuth is wired behind a flag and only switched on if you provide a Google client id.
3. **Currency** — prices stored as integer minor units with a `currency` column per package; site displays INR by default. Change if you want USD like the mock.
4. **Seed content** — 8 packages from the design (Mount Bromo, Mount Fuji, Raja Ampat, Kauai, Azores, Braies lake, +2) with Unsplash placeholder photos. Replace with real photos later via the admin.
5. **Brand** — "tourex" from the design, with the paper-plane mark.
6. **GA4** — you create the property; the measurement id goes in `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

## Data model (Supabase Postgres)

```
profiles           id (= auth.users.id), full_name, avatar_url, role ('user'|'admin'), created_at
                   -- created by trigger on auth.users insert
packages           id, slug, title, summary, description, location, country,
                   price_minor, currency, duration_days, max_guests, rating,
                   cover_image_url, is_featured, is_published, created_at, updated_at
package_images     id, package_id, url, alt, sort_order
package_itinerary  id, package_id, day_no, title, description
bookings           id, user_id, package_id, check_in, check_out, guests, total_minor,
                   status ('pending'|'confirmed'|'rejected'|'cancelled'), note, admin_note, created_at
analytics_events   id, event ('page_view'|'package_view'|'booking_started'|'booking_submitted'),
                   path, package_id, session_id, user_id, referrer, device, created_at
```

Row-level security:
- `packages`, `package_images`, `package_itinerary`: anyone reads published rows; admin reads and writes all.
- `bookings`: user reads and inserts own rows; admin reads and updates all.
- `analytics_events`: anonymous insert; admin-only read.
- `profiles`: user reads own; admin reads all and updates `role`.
- Storage bucket `package-images`: public read, admin write.

Admin check is a Postgres function `is_admin()` reading `profiles.role`, used by every policy.

## Routes

Public
- `/` — hero with search card, stats, "Experience Our Destination" grid, features, CTA
- `/packages` — list with filters (destination, price range, duration, guests), URL-driven, paginated
- `/packages/[slug]` — gallery, overview, itinerary, price card, reserve form (dates + guests)
- `/login`, `/signup`, `/forgot-password`, `/auth/callback`
- `/account` — profile + my bookings with status

Admin (`/admin`, role = admin, server-side guard)
- `/admin` — KPIs: visitors today / 7d, bookings by status, top 5 packages, latest bookings
- `/admin/packages` — table, create/edit form, image upload to Storage, publish toggle
- `/admin/bookings` — filter by status, confirm / reject with note
- `/admin/users` — list, booking count, promote/demote admin
- `/admin/analytics` — daily visitors chart, top pages, device split, package views

## Performance plan

- Server components by default; client components only for search card, gallery, forms, charts.
- Package pages use ISR (`revalidate = 3600`) and `revalidatePath` on admin edits.
- `next/image` with Supabase image transformations for responsive sizes; blur placeholders.
- `next/font` for the typeface; no external font requests.
- Charts loaded with `next/dynamic` on the admin side only.
- Mobile-first layout, tested at 375 / 768 / 1280.
- Target: Lighthouse ≥ 90 mobile on home, list and detail pages.

## Analytics plan

- GA4 via `<GoogleAnalytics gaId=…>` from `@next/third-parties`.
- First-party: a tiny client hook fires on route change → `POST /api/track` → insert into `analytics_events`. Anonymous `session_id` cookie, 30 min idle. No PII.
- Admin reads from SQL views: `daily_visitors`, `top_packages_7d`, `device_split_7d`.

## Phases (each phase stops for your go)

| # | Phase | Done when |
|---|-------|-----------|
| 0 | Scaffold | Next app, Tailwind, Supabase clients, env template, layout shell, dev server shows placeholder home |
| 1 | Database | Migrations + RLS + storage + seed applied to your Supabase project |
| 2 | Public site | Home, packages list with filters, package detail, SEO metadata, sitemap |
| 3 | Auth + booking | Login/signup/forgot, middleware, account page, reserve flow creates pending booking |
| 4 | Admin | Layout, packages CRUD with uploads, bookings approve/reject, users |
| 5 | Analytics | GA4 wired, event beacon, admin analytics page with charts |
| 6 | Polish + deploy | Error/404 pages, a11y pass, Lighthouse run, Vercel deploy, README |
