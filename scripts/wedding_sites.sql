-- Run this in your Supabase SQL editor at: https://supabase.com/dashboard
-- Project → SQL Editor → New Query

-- Table: wedding_sites
create table if not exists wedding_sites (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  config jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published boolean default false
);

-- Auto-update updated_at on row change
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger wedding_sites_updated_at
  before update on wedding_sites
  for each row execute procedure update_updated_at_column();

-- Row Level Security
alter table wedding_sites enable row level security;

-- Allow public to read published sites (for /site/:slug rendering)
create policy "Public can read published sites"
  on wedding_sites for select
  using (published = true);

-- Allow anonymous users to insert/update (no auth in v1 — revisit before prod)
create policy "Anyone can create a site"
  on wedding_sites for insert
  with check (true);

create policy "Anyone can update their site"
  on wedding_sites for update
  using (true);
