
-- Supprimer la table veterinarians obsolète
-- La table clinic_veterinarians est maintenant la seule table de référence pour les vétérinaires
DROP TABLE IF EXISTS public.veterinarians CASCADE;
