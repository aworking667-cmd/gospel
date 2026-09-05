/*
# Create blog-images storage bucket

1. Storage
- Create a public bucket named `blog-images` for blog post cover photos.
- Public bucket so cover images can be displayed to all visitors without signed URLs.

2. Security (Storage RLS)
- Enable RLS on `storage.objects` for the `blog-images` bucket.
- SELECT: public read (anyone can view cover images).
- INSERT: open to anon + authenticated (admin uploads via anon key).
- UPDATE/DELETE: open to anon + authenticated (admin can replace/remove covers).

3. Notes
- This is a single-tenant app with no sign-in; the admin operates with the anon key.
- File type and size validation are enforced client-side in the admin editor.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- SELECT: public read
DROP POLICY IF EXISTS "blog_images_public_read" ON storage.objects;
CREATE POLICY "blog_images_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'blog-images');

-- INSERT: admin upload
DROP POLICY IF EXISTS "blog_images_anon_insert" ON storage.objects;
CREATE POLICY "blog_images_anon_insert"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'blog-images');

-- UPDATE: admin replace
DROP POLICY IF EXISTS "blog_images_anon_update" ON storage.objects;
CREATE POLICY "blog_images_anon_update"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');

-- DELETE: admin remove
DROP POLICY IF EXISTS "blog_images_anon_delete" ON storage.objects;
CREATE POLICY "blog_images_anon_delete"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'blog-images');