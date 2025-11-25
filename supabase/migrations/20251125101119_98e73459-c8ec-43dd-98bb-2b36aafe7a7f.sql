-- Étape 1: Identifier et garder le bon enregistrement pour chaque clinique
-- Pour la clinique de test, on garde celui avec les données de test
WITH records_to_keep AS (
  -- Garder 1 enregistrement par clinic_id (le plus récent avec des données valides)
  SELECT DISTINCT ON (clinic_id) id
  FROM clinic_settings
  ORDER BY clinic_id, 
    CASE 
      -- Prioriser les enregistrements avec des données de test pour la clinique de test
      WHEN clinic_id = '00000000-0000-0000-0000-000000000001' 
        AND clinic_email = 'contact@cliniquetest.fr' THEN 1
      ELSE 2
    END,
    created_at DESC
)
-- Supprimer tous les doublons
DELETE FROM clinic_settings
WHERE id NOT IN (SELECT id FROM records_to_keep);

-- Étape 2: Ajouter une contrainte unique pour empêcher les doublons futurs
ALTER TABLE clinic_settings 
ADD CONSTRAINT clinic_settings_clinic_id_unique UNIQUE (clinic_id);

-- Étape 3: Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_clinic_settings_clinic_id 
ON clinic_settings(clinic_id);

COMMENT ON CONSTRAINT clinic_settings_clinic_id_unique ON clinic_settings IS 
'Ensures each clinic can only have one settings record to prevent data mixing';
