
-- Ajouter la colonne is_blocked à la table bookings pour permettre le blocage de créneaux
ALTER TABLE public.bookings 
ADD COLUMN is_blocked BOOLEAN DEFAULT FALSE;

-- Ajouter un commentaire pour documenter l'usage de cette colonne
COMMENT ON COLUMN public.bookings.is_blocked IS 'Indique si ce booking est un créneau bloqué manuellement par la clinique';
