-- Run once in Supabase SQL Editor.
-- Required for Admin delete and sponsor JSON files.
-- Replace the UUID only if your admin UID changes.

drop policy if exists "Admin can delete gallery files" on storage.objects;
create policy "Admin can delete gallery files"
on storage.objects for delete to authenticated
using (
  bucket_id = 'gallery'
  and auth.uid() = '89a2fd68-393b-45df-8220-431dca902d3d'::uuid
);

drop policy if exists "Public can read gallery files" on storage.objects;
create policy "Public can read gallery files"
on storage.objects for select to anon, authenticated
using (bucket_id = 'gallery');

-- The existing Admin INSERT policy must allow the same admin UUID.
-- Sponsor names are stored as JSON in gallery/sponsors/, so no sponsors table is required.
