-- Ajouter la colonne online_booking_enabled (par défaut true pour ne pas casser l'existant)
ALTER TABLE public.clinic_settings 
ADD COLUMN online_booking_enabled boolean NOT NULL DEFAULT true;

-- Mettre à jour le commentaire de la colonne
COMMENT ON COLUMN public.clinic_settings.online_booking_enabled IS 
'Permet d''activer ou désactiver la prise de rendez-vous en ligne pour les clients';

-- Index pour optimiser les requêtes publiques
CREATE INDEX idx_clinic_settings_online_booking ON public.clinic_settings(clinic_id, online_booking_enabled);

-- Désactiver la prise de RDV pour la clinique de test initialement
UPDATE public.clinic_settings 
SET online_booking_enabled = false 
WHERE clinic_id IN (
  SELECT id FROM public.clinics WHERE slug = 'clinic-00000000'
);