
-- Ajouter la colonne client_status à la table bookings
ALTER TABLE public.bookings
ADD COLUMN client_status text;

-- Documentation
COMMENT ON COLUMN public.bookings.client_status IS 'Statut du client (ex: existing | new) choisi lors de la création du RDV';
