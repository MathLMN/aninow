-- Ajouter une colonne pour stocker l'ordre des colonnes des vétérinaires dans le planning
ALTER TABLE public.clinic_settings 
ADD COLUMN veterinarian_columns_order text[] DEFAULT '{}';

COMMENT ON COLUMN public.clinic_settings.veterinarian_columns_order IS 'Ordre personnalisé des colonnes de vétérinaires dans le planning (tableau des IDs de vétérinaires)';