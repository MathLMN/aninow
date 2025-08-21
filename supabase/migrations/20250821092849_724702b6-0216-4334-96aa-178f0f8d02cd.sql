
-- 1) Ajouter la colonne booking_source
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS booking_source text NOT NULL DEFAULT 'manual';

-- 2) Backfill des enregistrements existants
-- a) Créneaux bloqués
UPDATE public.bookings
SET booking_source = 'blocked'
WHERE is_blocked = true;

-- b) RDV probablement pris en ligne (heuristique: ai_analysis renseigné)
UPDATE public.bookings
SET booking_source = 'online'
WHERE is_blocked = false
  AND ai_analysis IS NOT NULL;

-- Le reste (non bloqué, sans ai_analysis) reste 'manual'

-- 3) Fonction trigger: déterminer automatiquement la source à l’INSERT
CREATE OR REPLACE FUNCTION public.set_booking_source()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_blocked IS TRUE THEN
    NEW.booking_source := 'blocked';
  ELSIF auth.uid() IS NULL THEN
    -- Insertion anonyme (prise de RDV publique)
    NEW.booking_source := 'online';
  ELSE
    -- Insertion authentifiée (interne)
    NEW.booking_source := COALESCE(NEW.booking_source, 'manual');
  END IF;
  RETURN NEW;
END;
$$;

-- 4) Trigger avant insertion
DROP TRIGGER IF EXISTS set_booking_source_before_insert ON public.bookings;
CREATE TRIGGER set_booking_source_before_insert
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.set_booking_source();

-- 5) Index pour accélérer les listes par clinique et source
CREATE INDEX IF NOT EXISTS idx_bookings_clinic_source
  ON public.bookings (clinic_id, booking_source);
