-- Add column to track if veterinarian was selected by client
ALTER TABLE public.bookings
ADD COLUMN veterinarian_preference_selected boolean DEFAULT false;

COMMENT ON COLUMN public.bookings.veterinarian_preference_selected IS 'Indique si le client a spécifiquement choisi ce vétérinaire (true) ou si le vétérinaire a été assigné automatiquement par le système (false)';