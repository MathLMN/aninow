
-- Ajouter une colonne pour la durée des créneaux par défaut dans clinic_settings
ALTER TABLE public.clinic_settings 
ADD COLUMN default_slot_duration_minutes INTEGER NOT NULL DEFAULT 30;

-- Mettre à jour les enregistrements existants avec la valeur par défaut
UPDATE public.clinic_settings 
SET default_slot_duration_minutes = 30 
WHERE default_slot_duration_minutes IS NULL;
