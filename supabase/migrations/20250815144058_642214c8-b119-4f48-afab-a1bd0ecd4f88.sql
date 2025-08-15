
-- Ajouter les colonnes start_date et end_date à la table recurring_slot_blocks
ALTER TABLE recurring_slot_blocks 
ADD COLUMN start_date date,
ADD COLUMN end_date date;

-- Mettre à jour les blocages existants avec une start_date (aujourd'hui)
-- pour qu'ils commencent à être actifs immédiatement
UPDATE recurring_slot_blocks 
SET start_date = CURRENT_DATE 
WHERE start_date IS NULL;

-- Ajouter des commentaires pour documenter les colonnes
COMMENT ON COLUMN recurring_slot_blocks.start_date IS 'Date de début de validité du blocage récurrent (optionnel)';
COMMENT ON COLUMN recurring_slot_blocks.end_date IS 'Date de fin de validité du blocage récurrent (optionnel, null = sans limite)';
