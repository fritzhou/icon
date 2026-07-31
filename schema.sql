-- =========================================================
-- iConnect — Supabase schema
-- Run this in the Supabase SQL editor (Project → SQL Editor)
-- =========================================================

-- ---------- Extension ----------
create extension if not exists "uuid-ossp";

-- ---------- Officers (also holds role + links to auth.users) ----------
create table if not exists officers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  position text not null,               -- e.g. "President", "Secretary"
  role text not null check (role in (
    'president','vice_president','secretary','treasurer','auditor',
    'public_information_officer','documentation_officer','technical_officer','adviser'
  )),
  grade_section text,
  bio text,
  skills text[] default '{}',
  photo_url text,
  socials jsonb default '{}',           -- { "facebook": "...", "github": "..." }
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- Adviser (single-row featured profile) ----------
create table if not exists adviser (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  position text default 'Club Adviser',
  bio text,
  photo_url text,
  updated_at timestamptz default now()
);

-- ---------- Members ----------
create table if not exists members (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  grade_section text,
  committee text,
  bio text,
  photo_url text,
  created_at timestamptz default now()
);

-- ---------- Announcements ----------
create table if not exists announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  cover_image text,
  date_posted date default current_date,
  posted_by text,
  status text default 'published' check (status in ('draft','pending','published')),
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- ---------- Events ----------
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  date date not null,
  time text,
  venue text,
  description text,
  banner_url text,
  status text default 'upcoming' check (status in ('upcoming','ongoing','completed')),
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- ---------- Gallery ----------
create table if not exists gallery (
  id uuid primary key default uuid_generate_v4(),
  title text,
  event text,
  image_url text not null,
  caption text,
  uploaded_by text,
  upload_date date default current_date,
  approved boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- ---------- Social links ----------
create table if not exists social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null,
  handle text,
  description text,
  url text not null,
  sort_order int default 0
);

-- ---------- Site stats (homepage counters) ----------
create table if not exists site_stats (
  id int primary key default 1,
  members int default 0,
  officers int default 0,
  events int default 0,
  projects int default 0,
  constraint single_row check (id = 1)
);
insert into site_stats (id, members, officers, events, projects)
values (1, 0, 0, 0, 0) on conflict (id) do nothing;

-- ---------- Website settings (key/value) ----------
create table if not exists site_settings (
  key text primary key,
  value jsonb
);

-- =========================================================
-- Row Level Security
-- Public (anon) role: read-only on published content.
-- Authenticated officers: write access scoped by role, enforced
-- via a helper function that reads the officer's role.
-- =========================================================

create or replace function current_officer_role()
returns text language sql stable as $$
  select role from officers where user_id = auth.uid() limit 1;
$$;

-- Enable RLS
alter table officers enable row level security;
alter table adviser enable row level security;
alter table members enable row level security;
alter table announcements enable row level security;
alter table events enable row level security;
alter table gallery enable row level security;
alter table social_links enable row level security;
alter table site_stats enable row level security;
alter table site_settings enable row level security;

-- Public read access
create policy "public read officers" on officers for select using (true);
create policy "public read adviser" on adviser for select using (true);
create policy "public read members" on members for select using (true);
create policy "public read announcements" on announcements for select using (status = 'published');
create policy "public read events" on events for select using (true);
create policy "public read gallery" on gallery for select using (approved = true);
create policy "public read socials" on social_links for select using (true);
create policy "public read stats" on site_stats for select using (true);
create policy "public read settings" on site_settings for select using (true);

-- President: full access to everything
create policy "president manages officers" on officers for all
  using (current_officer_role() = 'president') with check (current_officer_role() = 'president');
create policy "president manages members" on members for all
  using (current_officer_role() = 'president') with check (current_officer_role() = 'president');
create policy "president manages settings" on site_settings for all
  using (current_officer_role() = 'president') with check (current_officer_role() = 'president');
create policy "president manages stats" on site_stats for all
  using (current_officer_role() = 'president') with check (current_officer_role() = 'president');
create policy "president manages adviser" on adviser for all
  using (current_officer_role() = 'president') with check (current_officer_role() = 'president');
create policy "president manages socials" on social_links for all
  using (current_officer_role() = 'president') with check (current_officer_role() = 'president');

-- Secretary + Public Information Officer + President: announcements
create policy "roles manage announcements" on announcements for all
  using (current_officer_role() in ('president','secretary','public_information_officer'))
  with check (current_officer_role() in ('president','secretary','public_information_officer'));

-- Secretary + President: events
create policy "roles manage events" on events for all
  using (current_officer_role() in ('president','secretary'))
  with check (current_officer_role() in ('president','secretary'));

-- Documentation Officer + President: gallery
create policy "roles manage gallery" on gallery for all
  using (current_officer_role() in ('president','documentation_officer'))
  with check (current_officer_role() in ('president','documentation_officer'));

-- Adviser: read-only elevated access (approve announcements/gallery)
create policy "adviser approves announcements" on announcements for update
  using (current_officer_role() = 'adviser');
create policy "adviser approves gallery" on gallery for update
  using (current_officer_role() = 'adviser');

-- ---------- Storage buckets (run once) ----------
-- insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('covers', 'covers', true) on conflict do nothing;
