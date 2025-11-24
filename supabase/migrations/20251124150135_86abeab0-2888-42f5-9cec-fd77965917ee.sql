-- Activer REPLICA IDENTITY FULL pour avoir toutes les données dans les événements realtime
ALTER TABLE public.bookings REPLICA IDENTITY FULL;

-- Ajouter la table bookings à la publication realtime pour activer les notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;