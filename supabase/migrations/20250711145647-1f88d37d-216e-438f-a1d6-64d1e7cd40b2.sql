
-- Ajouter les colonnes pour gérer la durée personnalisable des rendez-vous
ALTER TABLE bookings 
ADD COLUMN appointment_end_time TEXT,
ADD COLUMN duration_minutes INTEGER;

-- Ajouter une colonne pour le type de consultation si elle n'existe pas déjà
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'consultation_type_id') THEN
        ALTER TABLE bookings ADD COLUMN consultation_type_id UUID REFERENCES consultation_types(id);
    END IF;
END $$;

-- Mettre à jour les rendez-vous existants pour avoir une durée par défaut de 15 minutes
UPDATE bookings 
SET duration_minutes = 15 
WHERE duration_minutes IS NULL AND appointment_time IS NOT NULL;

-- Calculer l'heure de fin pour les rendez-vous existants
UPDATE bookings 
SET appointment_end_time = (
    (appointment_time::time + (COALESCE(duration_minutes, 15) || ' minutes')::interval)::time
)::text
WHERE appointment_end_time IS NULL AND appointment_time IS NOT NULL;
