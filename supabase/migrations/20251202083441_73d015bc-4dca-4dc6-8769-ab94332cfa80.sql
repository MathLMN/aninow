-- Migration pour corriger le bug de grisage des jours de repos des vétérinaires
-- Étape 1: Supprimer les schedules orphelins (veterinarian_id qui n'existe plus ou vétérinaires inactifs)
DELETE FROM veterinarian_schedules 
WHERE veterinarian_id NOT IN (
  SELECT id FROM clinic_veterinarians WHERE is_active = true
);

-- Étape 2: Créer les schedules manquants pour chaque vétérinaire actif
-- (Lundi-Vendredi travaillés, Samedi-Dimanche en repos par défaut)
INSERT INTO veterinarian_schedules (veterinarian_id, clinic_id, day_of_week, is_working, morning_start, morning_end, afternoon_start, afternoon_end)
SELECT 
  cv.id,
  cv.clinic_id,
  day.day_of_week,
  CASE WHEN day.day_of_week BETWEEN 1 AND 5 THEN true ELSE false END as is_working,
  '08:00' as morning_start,
  '12:00' as morning_end,
  '14:00' as afternoon_start,
  '18:00' as afternoon_end
FROM clinic_veterinarians cv
CROSS JOIN (SELECT generate_series(0, 6) as day_of_week) day
WHERE cv.is_active = true
AND NOT EXISTS (
  SELECT 1 FROM veterinarian_schedules vs 
  WHERE vs.veterinarian_id = cv.id 
  AND vs.day_of_week = day.day_of_week
);