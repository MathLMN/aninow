
-- Ajouter les nouveaux champs à la table clinic_settings
ALTER TABLE public.clinic_settings 
ADD COLUMN IF NOT EXISTS clinic_phone text,
ADD COLUMN IF NOT EXISTS clinic_email text,
ADD COLUMN IF NOT EXISTS clinic_address_street text,
ADD COLUMN IF NOT EXISTS clinic_address_city text,
ADD COLUMN IF NOT EXISTS clinic_address_postal_code text,
ADD COLUMN IF NOT EXISTS clinic_address_country text DEFAULT 'France';
