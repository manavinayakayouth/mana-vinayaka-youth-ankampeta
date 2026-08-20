-- Run once in Supabase SQL Editor.
-- This version safely replaces policies with the same names.
DROP POLICY IF EXISTS "gallery public read" ON storage.objects;
DROP POLICY IF EXISTS "gallery admin insert" ON storage.objects;
DROP POLICY IF EXISTS "gallery admin update" ON storage.objects;
DROP POLICY IF EXISTS "gallery admin delete" ON storage.objects;

CREATE POLICY "gallery public read"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'gallery');

CREATE POLICY "gallery admin insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery' AND auth.uid() = '89a2fd68-393b-45df-8220-431dca902d3d');

CREATE POLICY "gallery admin update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gallery' AND auth.uid() = '89a2fd68-393b-45df-8220-431dca902d3d')
WITH CHECK (bucket_id = 'gallery' AND auth.uid() = '89a2fd68-393b-45df-8220-431dca902d3d');

CREATE POLICY "gallery admin delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery' AND auth.uid() = '89a2fd68-393b-45df-8220-431dca902d3d');
