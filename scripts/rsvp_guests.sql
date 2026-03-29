-- Run this in your Supabase SQL editor AFTER running wedding_sites.sql

-- Table: rsvp_guests (admin panel, separate from the Google Apps Script RSVPSection)
create table if not exists rsvp_guests (
  id uuid primary key default gen_random_uuid(),
  slug text not null references wedding_sites(slug) on delete cascade,
  name text not null,
  group_id text,
  group_name text,
  attendance text check (attendance in ('Going', 'Not Going', 'Maybe')),
  updated_at timestamptz default now()
);

create index rsvp_guests_slug_idx on rsvp_guests(slug);

-- Auto-update updated_at
create trigger rsvp_guests_updated_at
  before update on rsvp_guests
  for each row execute procedure update_updated_at_column();

-- Row Level Security
alter table rsvp_guests enable row level security;

create policy "Anyone can read guests for published sites"
  on rsvp_guests for select
  using (
    exists (
      select 1 from wedding_sites
      where wedding_sites.slug = rsvp_guests.slug
        and wedding_sites.published = true
    )
  );

create policy "Anyone can insert guests"
  on rsvp_guests for insert
  with check (true);

create policy "Anyone can update guests"
  on rsvp_guests for update
  using (true);

create policy "Anyone can delete guests"
  on rsvp_guests for delete
  using (true);
