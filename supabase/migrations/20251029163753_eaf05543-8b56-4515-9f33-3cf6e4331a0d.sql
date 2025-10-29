-- Allow public read access to clinic_settings for booking process
CREATE POLICY "Public can read clinic settings for booking"
ON public.clinic_settings
FOR SELECT
TO public
USING (true);
