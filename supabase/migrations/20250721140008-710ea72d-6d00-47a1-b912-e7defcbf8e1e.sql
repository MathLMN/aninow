-- Nettoyer les doublons en gardant le plus ancien pour chaque (date, time_slot)
WITH numbered_assignments AS (
  SELECT id, 
         ROW_NUMBER() OVER (PARTITION BY date, time_slot ORDER BY created_at ASC) as rn
  FROM slot_assignments
)
DELETE FROM slot_assignments 
WHERE id IN (
  SELECT id 
  FROM numbered_assignments 
  WHERE rn > 1
);

-- Ajouter une contrainte unique pour empêcher les futurs doublons
ALTER TABLE slot_assignments 
ADD CONSTRAINT slot_assignments_date_time_unique 
UNIQUE (date, time_slot);