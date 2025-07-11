
-- Table pour les vétérinaires
CREATE TABLE public.veterinarians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  specialty TEXT,
  clinic_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table pour les types de consultation avec durées
CREATE TABLE public.consultation_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table pour les créneaux disponibles
CREATE TABLE public.available_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  veterinarian_id UUID REFERENCES public.veterinarians(id) ON DELETE CASCADE NOT NULL,
  consultation_type_id UUID REFERENCES public.consultation_types(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(veterinarian_id, date, start_time, end_time)
);

-- Insérer quelques types de consultation par défaut
INSERT INTO public.consultation_types (name, duration_minutes, description, color) VALUES
('Consultation générale', 30, 'Examen général et diagnostic', '#3B82F6'),
('Vaccination', 15, 'Administration de vaccins', '#10B981'),
('Chirurgie mineure', 60, 'Interventions chirurgicales légères', '#F59E0B'),
('Urgence', 45, 'Consultation d''urgence', '#EF4444'),
('Contrôle post-opératoire', 20, 'Suivi après intervention', '#8B5CF6');

-- Insérer un vétérinaire d'exemple
INSERT INTO public.veterinarians (name, email, specialty, clinic_name) VALUES
('Dr. Martin Dubois', 'martin.dubois@clinique.fr', 'Médecine générale', 'Clinique Vétérinaire du Centre'),
('Dr. Sophie Laurent', 'sophie.laurent@clinique.fr', 'Chirurgie', 'Clinique Vétérinaire du Centre');

-- Activer RLS
ALTER TABLE public.veterinarians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_slots ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (permettre tout pour l'instant, à adapter selon vos besoins de sécurité)
CREATE POLICY "Allow all operations on veterinarians" ON public.veterinarians FOR ALL USING (true);
CREATE POLICY "Allow all operations on consultation_types" ON public.consultation_types FOR ALL USING (true);
CREATE POLICY "Allow all operations on available_slots" ON public.available_slots FOR ALL USING (true);
