-- ============================================================
-- Full reset — wipes the OLD iConnect schema (profiles/officers/
-- members/announcements/documentaries + its functions/policies)
-- so the NEW iconnect-main schema.sql can be created cleanly on
-- this same Supabase project. Safe to run even if some of these
-- don't exist.
-- ============================================================

drop table if exists public.documentaries cascade;
drop table if exists public.announcements cascade;
drop table if exists public.members cascade;
drop table if exists public.officers cascade;
drop table if exists public.profiles cascade;
drop table if exists public.adviser cascade;
drop table if exists public.events cascade;
drop table if exists public.gallery cascade;
drop table if exists public.social_links cascade;
drop table if exists public.site_stats cascade;
drop table if exists public.site_settings cascade;

drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.approve_user(uuid, text) cascade;
drop function if exists public.is_admin() cascade;
drop function if exists public.is_approved() cascade;
drop function if exists public.current_officer_role() cascade;

drop policy if exists "documentaries_bucket_public_read" on storage.objects;
drop policy if exists "documentaries_bucket_officer_write" on storage.objects;
drop policy if exists "documentaries_bucket_officer_update" on storage.objects;
drop policy if exists "documentaries_bucket_officer_delete" on storage.objects;
