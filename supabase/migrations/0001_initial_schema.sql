-- Desi Tours and Travels — initial schema.
-- Tables, triggers, row-level security, storage bucket and analytics views.
-- Apply with `npm run db:push` (linked project) or paste into the SQL editor.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('user', 'admin');
create type public.booking_status as enum ('pending', 'confirmed', 'rejected', 'cancelled');
create type public.analytics_event as enum ('page_view', 'package_view', 'booking_started', 'booking_submitted');

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user, created by trigger
-- ---------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  avatar_url  text,
  phone       text,
  role        public.user_role not null default 'user',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- True when the calling user has the admin role. SECURITY DEFINER so it can
-- read profiles without recursing into the profiles policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- Create the profile row when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Only admins (or the service role / SQL editor) may change a role.
-- SECURITY INVOKER on purpose: current_user is the PostgREST role here.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role
     and current_user not in ('postgres', 'service_role', 'supabase_admin')
     and not public.is_admin() then
    raise exception 'only admins can change roles' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- ---------------------------------------------------------------------------
-- packages
-- ---------------------------------------------------------------------------
create table public.packages (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  summary         text not null default '',
  description     text not null default '',
  location        text not null,
  country         text not null,
  price_minor     integer not null check (price_minor >= 0),   -- per person, minor units
  currency        char(3) not null default 'INR',
  duration_days   smallint not null check (duration_days > 0),
  max_guests      smallint not null default 4 check (max_guests > 0),
  rating          numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  cover_image_url text,
  is_featured     boolean not null default false,
  is_published    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  search          tsvector generated always as (
    to_tsvector('simple',
      coalesce(title, '') || ' ' || coalesce(location, '') || ' ' ||
      coalesce(country, '') || ' ' || coalesce(summary, ''))
  ) stored
);

create index packages_published_created_idx on public.packages (is_published, created_at desc);
create index packages_featured_idx on public.packages (is_featured) where is_featured;
create index packages_country_idx on public.packages (country);
create index packages_price_idx on public.packages (price_minor);
create index packages_search_idx on public.packages using gin (search);

create trigger packages_set_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- package_images, package_itinerary
-- ---------------------------------------------------------------------------
create table public.package_images (
  id          uuid primary key default gen_random_uuid(),
  package_id  uuid not null references public.packages (id) on delete cascade,
  url         text not null,
  alt         text not null default '',
  sort_order  smallint not null default 0,
  created_at  timestamptz not null default now()
);

create index package_images_package_idx on public.package_images (package_id, sort_order);

create table public.package_itinerary (
  id          uuid primary key default gen_random_uuid(),
  package_id  uuid not null references public.packages (id) on delete cascade,
  day_no      smallint not null check (day_no > 0),
  title       text not null,
  description text not null default '',
  unique (package_id, day_no)
);

-- ---------------------------------------------------------------------------
-- bookings: booking requests, confirmed or rejected by an admin
-- ---------------------------------------------------------------------------
create table public.bookings (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  package_id    uuid not null references public.packages (id) on delete restrict,
  check_in      date not null,
  check_out     date not null,
  guests        smallint not null check (guests > 0),
  total_minor   integer not null default 0 check (total_minor >= 0),
  currency      char(3) not null default 'INR',
  status        public.booking_status not null default 'pending',
  contact_name  text not null,
  contact_phone text not null,
  note          text,
  admin_note    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (check_out > check_in),
  check (check_in >= current_date - interval '1 day')
);

create index bookings_user_idx on public.bookings (user_id, created_at desc);
create index bookings_package_idx on public.bookings (package_id);
create index bookings_status_idx on public.bookings (status, created_at desc);

create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- The server, not the client, decides the price: total = per-person price × guests,
-- capped by max_guests, and only for published packages.
create or replace function public.set_booking_total()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  pkg public.packages%rowtype;
begin
  select * into pkg from public.packages where id = new.package_id;
  if not found or not pkg.is_published then
    raise exception 'package is not available' using errcode = '23503';
  end if;
  if new.guests > pkg.max_guests then
    raise exception 'guests exceed the package limit of %', pkg.max_guests using errcode = '23514';
  end if;
  new.total_minor := pkg.price_minor * new.guests;
  new.currency := pkg.currency;
  return new;
end;
$$;

create trigger bookings_set_total
  before insert on public.bookings
  for each row execute function public.set_booking_total();

-- ---------------------------------------------------------------------------
-- analytics_events: first-party page and package views
-- ---------------------------------------------------------------------------
create table public.analytics_events (
  id          bigint generated always as identity primary key,
  event       public.analytics_event not null,
  path        text not null,
  package_id  uuid references public.packages (id) on delete set null,
  session_id  text not null,
  user_id     uuid references auth.users (id) on delete set null,
  referrer    text,
  device      text check (device in ('mobile', 'tablet', 'desktop')),
  country     text,
  created_at  timestamptz not null default now()
);

create index analytics_events_created_idx on public.analytics_events (created_at desc);
create index analytics_events_event_created_idx on public.analytics_events (event, created_at desc);
create index analytics_events_package_idx on public.analytics_events (package_id, created_at desc)
  where package_id is not null;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.profiles          enable row level security;
alter table public.packages          enable row level security;
alter table public.package_images    enable row level security;
alter table public.package_itinerary enable row level security;
alter table public.bookings          enable row level security;
alter table public.analytics_events  enable row level security;

-- profiles
create policy "profiles: read own or admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

create policy "profiles: update own or admin" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()))
  with check (id = (select auth.uid()) or (select public.is_admin()));

-- packages and children: public reads published, admin does everything
create policy "packages: public read published" on public.packages
  for select to anon, authenticated
  using (is_published or (select public.is_admin()));

create policy "packages: admin write" on public.packages
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "package_images: public read published" on public.package_images
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.packages p
      where p.id = package_id and (p.is_published or (select public.is_admin()))
    )
  );

create policy "package_images: admin write" on public.package_images
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "package_itinerary: public read published" on public.package_itinerary
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.packages p
      where p.id = package_id and (p.is_published or (select public.is_admin()))
    )
  );

create policy "package_itinerary: admin write" on public.package_itinerary
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- bookings
create policy "bookings: read own or admin" on public.bookings
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "bookings: user creates own pending" on public.bookings
  for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'pending');

create policy "bookings: user cancels own pending" on public.bookings
  for update to authenticated
  using (user_id = (select auth.uid()) and status = 'pending')
  with check (user_id = (select auth.uid()) and status = 'cancelled');

create policy "bookings: admin updates" on public.bookings
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "bookings: admin deletes" on public.bookings
  for delete to authenticated
  using ((select public.is_admin()));

-- analytics_events: anyone may record, only admins may read
create policy "analytics: anyone inserts" on public.analytics_events
  for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));

create policy "analytics: admin reads" on public.analytics_events
  for select to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Analytics views (security_invoker: RLS above means admin-only)
-- ---------------------------------------------------------------------------
create view public.daily_visitors
with (security_invoker = true) as
  select
    (created_at at time zone 'Asia/Kolkata')::date as day,
    count(distinct session_id)                       as visitors,
    count(*) filter (where event = 'page_view')      as page_views,
    count(*) filter (where event = 'package_view')   as package_views
  from public.analytics_events
  group by 1;

create view public.top_packages_7d
with (security_invoker = true) as
  select p.id, p.slug, p.title, count(*) as views
  from public.analytics_events e
  join public.packages p on p.id = e.package_id
  where e.event = 'package_view'
    and e.created_at > now() - interval '7 days'
  group by p.id, p.slug, p.title
  order by views desc;

create view public.top_pages_7d
with (security_invoker = true) as
  select path, count(*) as views
  from public.analytics_events
  where event = 'page_view'
    and created_at > now() - interval '7 days'
  group by path
  order by views desc;

create view public.device_split_7d
with (security_invoker = true) as
  select device, count(distinct session_id) as sessions
  from public.analytics_events
  where created_at > now() - interval '7 days'
  group by device;

-- ---------------------------------------------------------------------------
-- Storage: public bucket for package photos, admin-only writes
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'package-images', 'package-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

create policy "package-images: public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'package-images');

create policy "package-images: admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'package-images' and (select public.is_admin()));

create policy "package-images: admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'package-images' and (select public.is_admin()))
  with check (bucket_id = 'package-images' and (select public.is_admin()));

create policy "package-images: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'package-images' and (select public.is_admin()));
