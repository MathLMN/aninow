
-- Créer une table pour les vétérinaires de la clinique
CREATE TABLE public.clinic_veterinarians (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  specialty TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer une table pour les paramètres de la clinique avec les horaires
CREATE TABLE public.clinic_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_name TEXT NOT NULL DEFAULT 'Clinique Vétérinaire',
  asv_enabled BOOLEAN NOT NULL DEFAULT true,
  opening_time TIME NOT NULL DEFAULT '08:00:00',
  closing_time TIME NOT NULL DEFAULT '18:00:00',
  opening_days TEXT[] NOT NULL DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS pour les tables
ALTER TABLE public.clinic_veterinarians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour permettre toutes les opérations (à adapter selon les besoins d'authentification)
CREATE POLICY "Allow all operations on clinic_veterinarians" 
  ON public.clinic_veterinarians 
  FOR ALL 
  USING (true);

CREATE POLICY "Allow all operations on clinic_settings" 
  ON public.clinic_settings 
  FOR ALL 
  USING (true);

-- Créer un trigger pour mettre à jour updated_at
CREATE TRIGGER update_clinic_veterinarians_updated_at
  BEFORE UPDATE ON public.clinic_veterinarians
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER update_clinic_settings_updated_at
  BEFORE UPDATE ON public.clinic_settings
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Insérer des données par défaut
INSERT INTO public.clinic_settings (clinic_name, asv_enabled, opening_time, closing_time, opening_days)
VALUES ('Clinique Vétérinaire', true, '08:00:00', '18:00:00', ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);

-- Insérer quelques vétérinaires par défaut
INSERT INTO public.clinic_veterinarians (name, email, specialty)
VALUES 
  ('Dr. Martin', 'martin@clinique.fr', 'Médecine générale'),
  ('Dr. Dubois', 'dubois@clinique.fr', 'Chirurgie'),
  ('Dr. Leroy', 'leroy@clinique.fr', 'Dermatologie');
