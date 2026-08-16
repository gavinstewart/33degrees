-- ============================================================
-- Thirty Three Degrees — schema, RLS, storage, seed data
-- Run this once in the Supabase SQL Editor for a fresh project.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- shows ----------
create table shows (
  id          uuid primary key default gen_random_uuid(),
  show_date   date not null,               -- 'YYYY-MM-DD', parsed as a local date — see lib/format.ts
  title       text not null,
  venue       text not null,
  city        text not null,
  ticket_url  text,
  notes       text,
  created_at  timestamptz not null default now()
);

-- ---------- gallery_items ----------
create table gallery_items (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null check (kind in ('photo', 'video')),
  media_url    text not null,              -- Supabase storage public URL, YouTube/Vimeo URL, or local /seed path
  caption      text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------- merch_items ----------
create table merch_items (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  price_cents  integer not null,
  image_url    text,
  sizes        text[],
  in_stock     boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------- news_posts ----------
create table news_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  body         text not null,
  post_date    date not null,
  created_at   timestamptz not null default now()
);

-- ---------- band_members ----------
create table band_members (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text not null,
  bio          text,
  photo_url    text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------- enquiries (public contact form submissions) ----------
create table enquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  message      text not null,
  created_at   timestamptz not null default now()
);

-- ---------- site_settings (singleton, id always 1) ----------
create table site_settings (
  id               integer primary key default 1,
  band_name        text not null default 'Thirty Three Degrees',
  kicker           text,
  tagline          text,
  logo_url         text,
  facebook_url     text,
  instagram_url    text,
  spotify_url      text,
  youtube_url      text,
  linktree_url     text,
  booking_email    text,
  constraint site_settings_singleton check (id = 1)
);

-- ---------- enquiry_settings (singleton, id always 1) ----------
-- Kept separate from site_settings, which is publicly readable — recipient
-- addresses must never be exposed via the anon API.
create table enquiry_settings (
  id           integer primary key default 1,
  recipients   text,                    -- comma-separated notification email addresses
  constraint enquiry_settings_singleton check (id = 1)
);

-- ============================================================
-- RLS: anon = SELECT only; authenticated = full CRUD
-- ============================================================
alter table shows           enable row level security;
alter table gallery_items   enable row level security;
alter table merch_items     enable row level security;
alter table news_posts      enable row level security;
alter table band_members    enable row level security;
alter table site_settings   enable row level security;
alter table enquiries       enable row level security;
alter table enquiry_settings enable row level security;

create policy "shows_select_anon"       on shows         for select using (true);
create policy "shows_all_authenticated" on shows         for all    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "gallery_select_anon"       on gallery_items for select using (true);
create policy "gallery_all_authenticated" on gallery_items for all    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "merch_select_anon"       on merch_items   for select using (true);
create policy "merch_all_authenticated" on merch_items   for all    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "news_select_anon"       on news_posts     for select using (true);
create policy "news_all_authenticated" on news_posts     for all    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "band_select_anon"       on band_members   for select using (true);
create policy "band_all_authenticated" on band_members   for all    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "settings_select_anon"       on site_settings for select using (true);
create policy "settings_all_authenticated" on site_settings for all    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- enquiries: anyone can submit (insert), only admins can read/delete — no anon select at all
create policy "enquiries_insert_anon"       on enquiries for insert with check (true);
create policy "enquiries_select_authenticated" on enquiries for select using (auth.role() = 'authenticated');
create policy "enquiries_delete_authenticated" on enquiries for delete using (auth.role() = 'authenticated');

-- enquiry_settings: admin-only, no anon access at all (recipient list is private)
create policy "enquiry_settings_all_authenticated" on enquiry_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- Storage: public "media" bucket (for admin-uploaded photos/video going forward)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_public_read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media_authenticated_write"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "media_authenticated_update"
  on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "media_authenticated_delete"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');

-- ============================================================
-- Seed data
-- ============================================================

insert into site_settings (id, band_name, kicker, tagline, logo_url, facebook_url, instagram_url, spotify_url, youtube_url, linktree_url, booking_email)
values (
  1,
  'Thirty Three Degrees',
  'CENTRAL COAST, NSW',
  'Sun-baked three-piece rock, straight off the Coast.',
  '/seed/logo-33d-lofi.jpg',
  'https://www.facebook.com/ThirtyThreeDegreesBand',
  'https://www.instagram.com/thirtythreedegrees.band/',
  'https://open.spotify.com/artist/2MwPAA2OIKMH3jrqWSAGod',
  'https://music.youtube.com/channel/UCHnKojV-stjE_ugEXCpHN_g',
  'https://linktr.ee/thirtythreedegreesband',
  null
)
on conflict (id) do nothing;

insert into enquiry_settings (id, recipients)
values (1, null)
on conflict (id) do nothing;

insert into band_members (name, role, bio, photo_url, sort_order) values
  ('Shane Romeyn', 'Vocals, Guitar', null, '/seed/drifters-shaggy-sm.jpeg', 1),
  ('Chris Roberts', 'Drums', null, '/seed/drifters-chris-sm.jpeg', 2),
  ('Gavin Stewart', 'Bass', null, '/seed/gavin-stewart.jpg', 3);

insert into gallery_items (kind, media_url, caption, sort_order) values
  ('photo', '/seed/photo-setlist.jpg', 'Setlist, live', 1),
  ('photo', '/seed/drifters-wide-sm.jpeg', 'The band, live', 2),
  ('photo', '/seed/drifters-shaggy-sm.jpeg', 'On stage', 3),
  ('photo', '/seed/drifters-chris-sm.jpeg', 'Chris behind the kit', 4),
  ('photo', '/seed/studio-live-room.jpg', 'In the live room', 6),
  ('photo', '/seed/van-load-in.jpg', 'Load-in', 7),
  ('photo', '/seed/guitar-tech-check.jpg', 'Gear check', 8),
  ('photo', '/seed/gig-disco-ball.jpg', 'Under the disco ball', 9),
  ('photo', '/seed/gig-full-band.jpg', 'Full band, live', 10);
