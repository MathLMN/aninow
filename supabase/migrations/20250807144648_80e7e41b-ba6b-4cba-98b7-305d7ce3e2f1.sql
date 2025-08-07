
-- Add slug column to clinics table for multi-tenant URLs
ALTER TABLE public.clinics 
ADD COLUMN slug text;

-- Create unique index on slug to ensure no duplicates
CREATE UNIQUE INDEX clinics_slug_idx ON public.clinics (slug);

-- Update existing clinics with default slugs (you may want to customize these)
UPDATE public.clinics 
SET slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), '''', '')) 
WHERE slug IS NULL;

-- Make slug NOT NULL after setting default values
ALTER TABLE public.clinics 
ALTER COLUMN slug SET NOT NULL;

-- Add a function to generate unique slugs
CREATE OR REPLACE FUNCTION generate_unique_clinic_slug(clinic_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    base_slug text;
    final_slug text;
    counter integer := 0;
BEGIN
    -- Generate base slug from clinic name
    base_slug := LOWER(REPLACE(REPLACE(TRIM(clinic_name), ' ', '-'), '''', ''));
    base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9-]', '', 'g');
    base_slug := REGEXP_REPLACE(base_slug, '-+', '-', 'g');
    base_slug := TRIM(base_slug, '-');
    
    -- Start with base slug
    final_slug := base_slug;
    
    -- Check if slug exists and increment counter until we find a unique one
    WHILE EXISTS (SELECT 1 FROM public.clinics WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$;
