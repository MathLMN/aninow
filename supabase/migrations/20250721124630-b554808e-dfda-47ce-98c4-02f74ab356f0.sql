
-- Créer la table slot_assignments pour stocker les attributions permanentes
CREATE TABLE IF NOT EXISTS slot_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time_slot TIME NOT NULL,
  veterinarian_id UUID NOT NULL REFERENCES clinic_veterinarians(id) ON DELETE CASCADE,
  assignment_type TEXT NOT NULL DEFAULT 'auto' CHECK (assignment_type IN ('auto', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Contrainte unique pour éviter les doublons d'attribution
  UNIQUE(date, time_slot, veterinarian_id)
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_slot_assignments_date_time ON slot_assignments(date, time_slot);
CREATE INDEX IF NOT EXISTS idx_slot_assignments_vet ON slot_assignments(veterinarian_id);

-- Activer RLS
ALTER TABLE slot_assignments ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour permettre toutes les opérations (à adapter selon vos besoins)
CREATE POLICY "Allow all operations on slot_assignments" ON slot_assignments FOR ALL USING (true);

-- Trigger pour la mise à jour automatique du timestamp
DROP TRIGGER IF EXISTS set_timestamp_slot_assignments ON slot_assignments;
CREATE TRIGGER set_timestamp_slot_assignments
  BEFORE UPDATE ON slot_assignments
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();
