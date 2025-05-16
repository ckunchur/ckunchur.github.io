-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public access to the photos bucket
CREATE POLICY "Give public access to photos bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

-- Create a policy that allows authenticated users to upload to the photos bucket
CREATE POLICY "Allow authenticated uploads to photos bucket"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
);

-- Create a policy that allows authenticated users to update their own uploads
CREATE POLICY "Allow authenticated updates to photos bucket"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
);

-- Create a policy that allows authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated deletes to photos bucket"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'photos'
  AND auth.role() = 'authenticated'
); 