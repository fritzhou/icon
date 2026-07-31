-- ============================================================
-- iConnect — Open Access Patch
-- Removes login/role requirements: anyone can now insert,
-- update, or delete officers, members, announcements, events,
-- gallery, socials, adviser, and site settings/stats.
-- Run this AFTER schema.sql has already been run once.
-- Safe to re-run.
-- ============================================================

-- Drop the old role-gated write policies
drop policy if exists "president manages officers" on officers;
drop policy if exists "president manages members" on members;
drop policy if exists "president manages settings" on site_settings;
drop policy if exists "president manages stats" on site_stats;
drop policy if exists "president manages adviser" on adviser;
drop policy if exists "president manages socials" on social_links;
drop policy if exists "roles manage announcements" on announcements;
drop policy if exists "roles manage events" on events;
drop policy if exists "roles manage gallery" on gallery;
drop policy if exists "adviser approves announcements" on announcements;
drop policy if exists "adviser approves gallery" on gallery;

-- Also open up public read for announcements/gallery (previously
-- required status='published' / approved=true, which only the
-- old approval workflow could set)
drop policy if exists "public read announcements" on announcements;
drop policy if exists "public read gallery" on gallery;
create policy "public read announcements" on announcements for select using (true);
create policy "public read gallery" on gallery for select using (true);

-- Wide-open write access — anyone, logged in or not, can manage everything
create policy "open write officers" on officers for all using (true) with check (true);
create policy "open write members" on members for all using (true) with check (true);
create policy "open write settings" on site_settings for all using (true) with check (true);
create policy "open write stats" on site_stats for all using (true) with check (true);
create policy "open write adviser" on adviser for all using (true) with check (true);
create policy "open write socials" on social_links for all using (true) with check (true);
create policy "open write announcements" on announcements for all using (true) with check (true);
create policy "open write events" on events for all using (true) with check (true);
create policy "open write gallery" on gallery for all using (true) with check (true);

-- ---------- Storage buckets (create them — they never existed yet) ----------
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('covers', 'covers', true) on conflict (id) do nothing;

drop policy if exists "open bucket read" on storage.objects;
drop policy if exists "open bucket write" on storage.objects;
drop policy if exists "open bucket update" on storage.objects;
drop policy if exists "open bucket delete" on storage.objects;

create policy "open bucket read" on storage.objects for select
  using (bucket_id in ('gallery','avatars','covers'));
create policy "open bucket write" on storage.objects for insert
  with check (bucket_id in ('gallery','avatars','covers'));
create policy "open bucket update" on storage.objects for update
  using (bucket_id in ('gallery','avatars','covers'));
create policy "open bucket delete" on storage.objects for delete
  using (bucket_id in ('gallery','avatars','covers'));
