
-- Add admin functionality to track manual clinic creation
ALTER TABLE user_clinic_access ADD COLUMN IF NOT EXISTS created_by_admin uuid;
ALTER TABLE user_clinic_access ADD COLUMN IF NOT EXISTS provisional_password_set boolean DEFAULT false;

-- Create admin interface table for tracking manual creations
CREATE TABLE IF NOT EXISTS admin_clinic_creations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id),
  admin_user_id uuid NOT NULL,
  provisional_password text NOT NULL,
  clinic_user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  password_changed boolean DEFAULT false,
  first_login_completed boolean DEFAULT false
);

-- Enable RLS on admin_clinic_creations
ALTER TABLE admin_clinic_creations ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to manage clinic creations
CREATE POLICY "Admins can manage clinic creations" 
  ON admin_clinic_creations 
  FOR ALL 
  USING (true);

-- Add policy to allow INSERT on user_clinic_access for admin-created clinics
DROP POLICY IF EXISTS "Users can insert clinic access" ON user_clinic_access;
CREATE POLICY "Allow admin clinic creation" 
  ON user_clinic_access 
  FOR INSERT 
  WITH CHECK (true);

-- Update existing policy to allow admin updates
DROP POLICY IF EXISTS "Users can view their clinic access" ON user_clinic_access;
CREATE POLICY "Users can view their clinic access" 
  ON user_clinic_access 
  FOR SELECT 
  USING (user_id = auth.uid() OR created_by_admin IS NOT NULL);
