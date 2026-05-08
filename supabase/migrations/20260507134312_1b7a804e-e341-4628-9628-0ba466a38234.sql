
-- Replace permissive insert policies with validated ones
DROP POLICY IF EXISTS "bookings_insert_any" ON public.bookings;
CREATE POLICY "bookings_insert_validated" ON public.bookings FOR INSERT WITH CHECK (
  length(guest_name) BETWEEN 1 AND 120
  AND guest_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(guest_email) <= 255
  AND guests BETWEEN 1 AND 50
  AND date >= CURRENT_DATE
  AND (notes IS NULL OR length(notes) <= 1000)
);

DROP POLICY IF EXISTS "newsletter_insert_any" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_insert_validated" ON public.newsletter_subscribers FOR INSERT WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255
);

-- Restrict storage listing on wine-images: only admins can list; objects still served via public URLs
DROP POLICY IF EXISTS "wine_images_public_read" ON storage.objects;
CREATE POLICY "wine_images_admin_list" ON storage.objects FOR SELECT USING (
  bucket_id = 'wine-images' AND public.has_role(auth.uid(), 'admin')
);

-- Lock down SECURITY DEFINER function execution to service_role only
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
