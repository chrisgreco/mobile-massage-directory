-- ============================================================================
-- Mobile Massage Directory — Supabase Schema
-- Run this in the Supabase SQL Editor to create all tables, indexes, and RLS.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

create table if not exists mm_listings (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  business_name text not null,
  owner_name    text,
  email         text,
  phone         text,
  website       text,
  description   text,
  city          text not null,
  state         text not null,
  state_abbr    text not null,
  zip_codes     text[],
  cities_served text[],
  modalities    text[],
  price_range   text,
  is_mobile     boolean default true,
  licensed      boolean default true,
  insured       boolean default true,
  featured      boolean default false,
  status        text default 'pending',
  rating        numeric(3,2),
  review_count  integer default 0,
  photos        text[],
  created_at    timestamptz default now()
);

create table if not exists mm_reviews (
  id            uuid primary key default gen_random_uuid(),
  listing_id    uuid references mm_listings(id) on delete cascade,
  reviewer_name text,
  rating        integer check (rating between 1 and 5),
  body          text,
  created_at    timestamptz default now()
);

create table if not exists mm_leads (
  id              uuid primary key default gen_random_uuid(),
  name            text,
  email           text,
  city            text,
  state           text,
  modality        text,
  session_length  text,
  reason          text,
  created_at      timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 2. Indexes
-- ---------------------------------------------------------------------------

create index if not exists idx_mm_listings_city_state
  on mm_listings (city, state_abbr);

create index if not exists idx_mm_listings_status
  on mm_listings (status);

create index if not exists idx_mm_listings_featured
  on mm_listings (featured)
  where status = 'approved';

create index if not exists idx_mm_listings_slug
  on mm_listings (slug);

create index if not exists idx_mm_listings_modalities
  on mm_listings using gin (modalities);

create index if not exists idx_mm_listings_rating
  on mm_listings (rating desc nulls last)
  where status = 'approved';

create index if not exists idx_mm_reviews_listing_id
  on mm_reviews (listing_id);

create index if not exists idx_mm_reviews_rating
  on mm_reviews (rating);

create index if not exists idx_mm_leads_created_at
  on mm_leads (created_at desc);

-- ---------------------------------------------------------------------------
-- 3. Row Level Security (RLS)
-- ---------------------------------------------------------------------------

alter table mm_listings enable row level security;
alter table mm_reviews  enable row level security;
alter table mm_leads    enable row level security;

-- Listings: anyone can read approved listings
create policy "Public can read approved listings"
  on mm_listings for select
  using (status = 'approved');

-- Listings: only service_role can insert/update/delete (via seed script or admin)
create policy "Service role can manage listings"
  on mm_listings for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Reviews: anyone can read reviews for approved listings
create policy "Public can read reviews"
  on mm_reviews for select
  using (
    exists (
      select 1 from mm_listings
      where mm_listings.id = mm_reviews.listing_id
        and mm_listings.status = 'approved'
    )
  );

-- Reviews: service_role can manage reviews
create policy "Service role can manage reviews"
  on mm_reviews for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Reviews: anonymous users can insert reviews (moderated later)
create policy "Anon can insert reviews"
  on mm_reviews for insert
  with check (true);

-- Leads: anonymous users can insert leads (contact form submissions)
create policy "Anon can insert leads"
  on mm_leads for insert
  with check (true);

-- Leads: only service_role can read leads
create policy "Service role can read leads"
  on mm_leads for select
  using (auth.role() = 'service_role');

-- Leads: service_role can manage leads
create policy "Service role can manage leads"
  on mm_leads for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
