-- Ajouter la colonne available_for_online_booking à la table veterinarian_schedules
-- Valeur par défaut true pour préserver le comportement actuel
ALTER TABLE veterinarian_schedules 
ADD COLUMN IF NOT EXISTS available_for_online_booking BOOLEAN DEFAULT true;