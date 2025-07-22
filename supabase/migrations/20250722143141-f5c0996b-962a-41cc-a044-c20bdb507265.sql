
-- Supprimer la colonne email de la table clinic_veterinarians
ALTER TABLE public.clinic_veterinarians DROP COLUMN IF EXISTS email;

-- Créer une table pour les sessions vétérinaires si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.vet_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  clinic_email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS pour la table des sessions
ALTER TABLE public.vet_sessions ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour permettre toutes les opérations sur les sessions
CREATE POLICY "Allow all operations on vet_sessions" 
  ON public.vet_sessions 
  FOR ALL 
  USING (true);

-- Créer un trigger pour mettre à jour updated_at si il n'existe pas déjà
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vet_sessions_updated_at') THEN
    CREATE TRIGGER update_vet_sessions_updated_at
      BEFORE UPDATE ON public.vet_sessions
      FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
  END IF;
END $$;
