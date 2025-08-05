
-- Recréer la table admin_clinic_creations
CREATE TABLE IF NOT EXISTS admin_clinic_creations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL REFERENCES admin_users(user_id) ON DELETE CASCADE,
  clinic_user_id UUID NOT NULL,
  provisional_password TEXT NOT NULL,
  password_changed BOOLEAN DEFAULT false,
  first_login_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_admin_clinic_creations_clinic_id ON admin_clinic_creations(clinic_id);
CREATE INDEX IF NOT EXISTS idx_admin_clinic_creations_admin_user_id ON admin_clinic_creations(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_clinic_creations_password_changed ON admin_clinic_creations(password_changed);
CREATE INDEX IF NOT EXISTS idx_admin_clinic_creations_created_at ON admin_clinic_creations(created_at);

-- Créer le trigger pour la mise à jour automatique du timestamp
DROP TRIGGER IF EXISTS set_timestamp_admin_clinic_creations ON admin_clinic_creations;
CREATE TRIGGER set_timestamp_admin_clinic_creations
  BEFORE UPDATE ON admin_clinic_creations
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

-- Activer la sécurité au niveau des lignes (RLS)
ALTER TABLE admin_clinic_creations ENABLE ROW LEVEL SECURITY;

-- Créer les politiques de sécurité (permettre toutes les opérations pour les tests)
-- À adapter selon vos besoins de sécurité
CREATE POLICY "Allow all operations on admin_clinic_creations" 
  ON admin_clinic_creations 
  FOR ALL 
  USING (true)
  WITH CHECK (true);
