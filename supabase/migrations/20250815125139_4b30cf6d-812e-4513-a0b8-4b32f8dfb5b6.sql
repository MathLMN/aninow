
-- Créer une table pour les blocages récurrents de créneaux
CREATE TABLE public.recurring_slot_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL,
  veterinarian_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contrainte pour s'assurer que l'heure de fin est après l'heure de début
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Activer RLS
ALTER TABLE public.recurring_slot_blocks ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les blocages récurrents
CREATE POLICY "Users can view their clinic recurring blocks" 
  ON public.recurring_slot_blocks 
  FOR SELECT 
  USING (clinic_id = get_user_clinic_id());

CREATE POLICY "Users can create their clinic recurring blocks" 
  ON public.recurring_slot_blocks 
  FOR INSERT 
  WITH CHECK (clinic_id = get_user_clinic_id());

CREATE POLICY "Users can update their clinic recurring blocks" 
  ON public.recurring_slot_blocks 
  FOR UPDATE 
  USING (clinic_id = get_user_clinic_id());

CREATE POLICY "Users can delete their clinic recurring blocks" 
  ON public.recurring_slot_blocks 
  FOR DELETE 
  USING (clinic_id = get_user_clinic_id());

-- Trigger pour updated_at
CREATE TRIGGER handle_updated_at_recurring_slot_blocks
  BEFORE UPDATE ON public.recurring_slot_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Index pour améliorer les performances
CREATE INDEX idx_recurring_slot_blocks_clinic_vet_day 
  ON public.recurring_slot_blocks(clinic_id, veterinarian_id, day_of_week);
