-- FranchiseOntario.com — Supabase schema
-- Run this once in Supabase → SQL Editor. Safe to re-run (idempotent).
-- RLS is enabled with no public policies, so only the server (service role
-- key) can read/write these tables. The site never queries them from the
-- browser directly.

-- ── Leads (already in use) ──────────────────────────────────────────────
create table if not exists public.leads (
  id text primary key,
  franchise_id text not null,
  franchise_name text not null,
  name text not null,
  email text not null,
  phone text,
  city text,
  investment_budget text,
  message text,
  status text default 'new',
  read boolean default false,
  submitted_at timestamptz default now()
);
alter table public.leads enable row level security;

-- ── Newsletter subscribers (already in use) ─────────────────────────────
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  source text,
  subscribed_at timestamptz default now()
);
alter table public.newsletter_subscribers enable row level security;

-- ── Franchisor accounts ─────────────────────────────────────────────────
create table if not exists public.accounts (
  id text primary key,
  franchise_id text not null,
  franchise_name text not null,
  name text not null,
  email text unique not null,
  title text,
  password_hash text not null,          -- scrypt hash, never plaintext
  tier text default 'basic',            -- basic | premium | enterprise
  stripe_customer_id text,
  registered_at timestamptz default now()
);
alter table public.accounts enable row level security;

-- ── Listings (franchisor-submitted, pending + approved) ─────────────────
create table if not exists public.listings (
  id text primary key,                  -- slug
  name text not null,
  category text,
  plan text default 'Basic',            -- Basic | Premium | Enterprise
  tier text default 'basic',            -- basic | premium | enterprise
  email text,
  contact_name text,
  phone text,
  website text,
  city text,
  description text,
  long_description text,
  locations int default 0,
  established int,
  logo_url text,
  media_images jsonb default '[]'::jsonb,
  video_url text,
  is_vip boolean default false,
  is_featured boolean default false,
  status text default 'pending',        -- pending | approved | rejected
  submitted_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.listings enable row level security;

-- ── Listing claims (someone claiming a sourced listing) ─────────────────
create table if not exists public.claims (
  id text primary key,
  franchise_id text not null,
  franchise_name text not null,
  claimant_name text not null,
  claimant_email text not null,
  claimant_title text,
  message text,
  domain_match boolean default false,
  source_listing_url text,
  source_site text,
  status text default 'pending',        -- pending | approved | rejected
  submitted_at timestamptz default now()
);
alter table public.claims enable row level security;

-- ── Support tickets ─────────────────────────────────────────────────────
create table if not exists public.tickets (
  id text primary key,
  name text not null,
  email text not null,
  category text,
  subject text not null,
  message text,
  status text default 'Open',           -- Open | Resolved
  submitted_at timestamptz default now()
);
alter table public.tickets enable row level security;

-- ── Subscriptions (Stripe truth mirror, written by the webhook) ─────────
create table if not exists public.subscriptions (
  id text primary key,                  -- Stripe subscription id
  customer_id text,
  email text,
  franchise_id text,
  plan text,                            -- premium | enterprise
  status text,                          -- active | canceled | past_due ...
  current_period_end timestamptz,
  updated_at timestamptz default now()
);
alter table public.subscriptions enable row level security;
create index if not exists idx_subscriptions_email on public.subscriptions(email);
create index if not exists idx_subscriptions_franchise on public.subscriptions(franchise_id);
create index if not exists idx_listings_status on public.listings(status);
