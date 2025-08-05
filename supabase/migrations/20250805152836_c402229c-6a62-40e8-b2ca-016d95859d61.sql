
-- Update admin_clinic_creations table to track password changes and first login completion
-- These columns may already exist, but we'll add them if they don't
ALTER TABLE admin_clinic_creations 
ADD COLUMN IF NOT EXISTS password_changed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS first_login_completed boolean DEFAULT false;

-- Create an index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_admin_clinic_creations_clinic_user_id 
ON admin_clinic_creations(clinic_user_id);
