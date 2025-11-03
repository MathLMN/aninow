-- Ajouter le champ pour le délai minimum de réservation en ligne
ALTER TABLE clinic_settings 
ADD COLUMN IF NOT EXISTS minimum_booking_delay_hours integer DEFAULT 0;

COMMENT ON COLUMN clinic_settings.minimum_booking_delay_hours IS 'Délai minimum en heures avant lequel un client peut prendre rendez-vous en ligne (0 = jour même autorisé, 24 = uniquement à partir de demain, etc.)';