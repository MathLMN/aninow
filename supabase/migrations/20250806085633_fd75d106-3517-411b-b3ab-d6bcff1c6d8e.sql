
-- Add slug column to clinics table for multi-tenant URLs
ALTER TABLE public.clinics 
ADD COLUMN slug text UNIQUE;

-- Update existing clinics with default slugs (you can change these later)
UPDATE public.clinics 
SET slug = 'clinic-' || SUBSTRING(id::text, 1, 8)
WHERE slug IS NULL;

-- Make slug required for new clinics
ALTER TABLE public.clinics 
ALTER COLUMN slug SET NOT NULL;

-- Add index for better performance on slug lookups
CREATE INDEX idx_clinics_slug ON public.clinics(slug);

-- Add RLS policy for public access to clinic slugs (needed for routing)
CREATE POLICY "Allow public read access to clinic slugs" 
ON public.clinics 
FOR SELECT 
TO public
USING (true);

-- Update bookings table to ensure clinic_id is always set
ALTER TABLE public.bookings 
ALTER COLUMN clinic_id SET NOT NULL;

-- Add a function to get clinic by slug
CREATE OR REPLACE FUNCTION public.get_clinic_by_slug(clinic_slug text)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT id, name, slug, created_at, updated_at 
  FROM public.clinics 
  WHERE clinics.slug = clinic_slug;
$$;
