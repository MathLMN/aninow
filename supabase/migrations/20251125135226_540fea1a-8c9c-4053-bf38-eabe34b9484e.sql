-- Supprimer l'ancienne contrainte
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Créer la nouvelle contrainte avec 'no-show' inclus
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'cancelled'::text, 'completed'::text, 'no-show'::text]));