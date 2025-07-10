
-- Créer la table des réservations
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Informations sur l'animal principal
  animal_species TEXT NOT NULL,
  animal_name TEXT NOT NULL,
  custom_species TEXT,
  multiple_animals TEXT[] DEFAULT '{}',
  
  -- Informations sur le deuxième animal (si applicable)
  second_animal_species TEXT,
  second_animal_name TEXT,
  second_custom_species TEXT,
  vaccination_type TEXT,
  
  -- Motif de consultation
  consultation_reason TEXT NOT NULL,
  convenience_options TEXT[] DEFAULT '{}',
  custom_text TEXT,
  selected_symptoms TEXT[] DEFAULT '{}',
  custom_symptom TEXT,
  
  -- Motif pour le deuxième animal
  second_animal_different_reason BOOLEAN DEFAULT false,
  second_animal_consultation_reason TEXT,
  second_animal_convenience_options TEXT[] DEFAULT '{}',
  second_animal_custom_text TEXT,
  second_animal_selected_symptoms TEXT[] DEFAULT '{}',
  second_animal_custom_symptom TEXT,
  
  -- Réponses aux questions conditionnelles
  conditional_answers JSONB,
  symptom_duration TEXT,
  additional_points TEXT[] DEFAULT '{}',
  
  -- Informations détaillées sur l'animal principal
  animal_age TEXT,
  animal_breed TEXT,
  animal_weight DECIMAL,
  animal_sex TEXT,
  animal_sterilized BOOLEAN,
  animal_vaccines_up_to_date BOOLEAN,
  
  -- Informations détaillées sur le deuxième animal
  second_animal_age TEXT,
  second_animal_breed TEXT,
  second_animal_weight DECIMAL,
  second_animal_sex TEXT,
  second_animal_sterilized BOOLEAN,
  second_animal_vaccines_up_to_date BOOLEAN,
  
  -- Commentaire du client
  client_comment TEXT,
  
  -- Informations de contact
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  preferred_contact_method TEXT NOT NULL,
  
  -- Informations de rendez-vous
  appointment_date TEXT,
  appointment_time TEXT,
  
  -- Statut et analyse IA
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  ai_analysis JSONB,
  urgency_score INTEGER CHECK (urgency_score >= 0 AND urgency_score <= 10),
  recommended_actions TEXT[] DEFAULT '{}'
);

-- Créer la table des logs d'analyse IA
CREATE TABLE IF NOT EXISTS ai_analysis_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  output_data JSONB NOT NULL,
  confidence_score DECIMAL NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  processing_time_ms INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_appointment_date ON bookings(appointment_date);
CREATE INDEX IF NOT EXISTS idx_bookings_urgency_score ON bookings(urgency_score);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_logs_booking_id ON ai_analysis_logs(booking_id);

-- Créer la fonction de mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour la mise à jour automatique
DROP TRIGGER IF EXISTS set_timestamp ON bookings;
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

-- Activer la sécurité au niveau des lignes (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_logs ENABLE ROW LEVEL SECURITY;

-- Créer les politiques de sécurité (pour l'instant, permettre tout pour les tests)
-- À adapter selon vos besoins de sécurité
CREATE POLICY "Allow all operations on bookings" ON bookings FOR ALL USING (true);
CREATE POLICY "Allow all operations on ai_analysis_logs" ON ai_analysis_logs FOR ALL USING (true);
