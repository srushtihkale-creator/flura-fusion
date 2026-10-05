-- =============================================================================
-- Flora Fusion — Supabase Storage Bucket & Security Policy Provisioning
-- Idempotent, safe to run repeatedly, zero data loss
-- =============================================================================

-- 1. Create public bucket for product photography, studio assets & CMS banners
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'flora-fusion-media',
    'flora-fusion-media',
    true,
    10485760, -- 10MB per asset limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Idempotent policy: Allow public read access to flora-fusion-media bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Public Media Read Policy'
    ) THEN
        CREATE POLICY "Public Media Read Policy"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'flora-fusion-media');
    END IF;
END $$;

-- 4. Idempotent policy: Allow authenticated service-role / admin uploads
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Service Role Upload Policy'
    ) THEN
        CREATE POLICY "Service Role Upload Policy"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'flora-fusion-media');
    END IF;
END $$;
