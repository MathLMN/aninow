
-- Table pour stocker les horaires individuels de chaque vétérinaire
CREATE TABLE public.veterinarian_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  veterinarian_id uuid NOT NULL REFERENCES public.clinic_veterinarians(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Dimanche, 1=Lundi, etc.
  is_working boolean NOT NULL DEFAULT true,
  morning_start time,
  morning_end time,
  afternoon_start time,
  afternoon_end time,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(veterinarian_id, day_of_week)
);

-- Table pour les périodes d'absence (congés, vacances, etc.)
CREATE TABLE public.veterinarian_absences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  veterinarian_id uuid NOT NULL REFERENCES public.clinic_veterinarians(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  absence_type text NOT NULL DEFAULT 'vacation',
  reason text,
  is_recurring boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

-- Activer RLS sur les deux tables
ALTER TABLE public.veterinarian_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veterinarian_absences ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour permettre toutes les opérations (comme les autres tables de la clinique)
CREATE POLICY "Allow all operations on veterinarian_schedules" 
  ON public.veterinarian_schedules 
  FOR ALL 
  USING (true);

CREATE POLICY "Allow all operations on veterinarian_absences" 
  ON public.veterinarian_absences 
  FOR ALL 
  USING (true);

-- Triggers pour mettre à jour updated_at automatiquement
CREATE TRIGGER set_timestamp_veterinarian_schedules
  BEFORE UPDATE ON public.veterinarian_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER set_timestamp_veterinarian_absences
  BEFORE UPDATE ON public.veterinarian_absences
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();
