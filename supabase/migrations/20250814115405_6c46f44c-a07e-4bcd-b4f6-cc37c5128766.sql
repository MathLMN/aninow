
-- Permettre l'accès public en lecture aux vétérinaires actifs
CREATE POLICY "Allow public read access to active veterinarians"
ON public.clinic_veterinarians
FOR SELECT
USING (is_active = true);
