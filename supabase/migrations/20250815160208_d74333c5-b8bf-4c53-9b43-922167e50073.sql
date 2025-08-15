
-- Ajouter la colonne arrival_time à la table bookings
ALTER TABLE public.bookings 
ADD COLUMN arrival_time text;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN public.bookings.arrival_time IS 'Heure d''arrivée du client au format HH:MM';
