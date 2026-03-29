-- Run this in your Supabase SQL editor to create the wedding-assets storage bucket
-- Alternatively, create it via: Storage → New Bucket → Name: "wedding-assets" → Public: ON

insert into storage.buckets (id, name, public)
values ('wedding-assets', 'wedding-assets', true)
on conflict (id) do nothing;

-- Allow anyone to upload files (revisit auth before prod)
create policy "Anyone can upload wedding assets"
  on storage.objects for insert
  with check (bucket_id = 'wedding-assets');

create policy "Public can read wedding assets"
  on storage.objects for select
  using (bucket_id = 'wedding-assets');
