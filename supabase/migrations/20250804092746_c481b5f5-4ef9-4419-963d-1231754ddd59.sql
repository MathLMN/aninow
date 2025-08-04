
-- Create a table to link Supabase auth users to veterinarian profiles
CREATE TABLE public.veterinarian_auth_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  veterinarian_id UUID REFERENCES clinic_veterinarians(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for veterinarian auth users
ALTER TABLE public.veterinarian_auth_users ENABLE ROW LEVEL SECURITY;

-- Allow veterinarians to read their own auth link
CREATE POLICY "Veterinarians can view their own auth link"
  ON public.veterinarian_auth_users
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow all operations for now (will be restricted later with proper admin roles)
CREATE POLICY "Allow all operations on veterinarian_auth_users"
  ON public.veterinarian_auth_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create an admin users table for system administrators
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS for admin users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow admin users to manage the admin table
CREATE POLICY "Allow all operations on admin_users"
  ON public.admin_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add a migration_status column to track the authentication migration progress
ALTER TABLE public.clinic_veterinarians 
ADD COLUMN auth_migration_status TEXT DEFAULT 'legacy' CHECK (auth_migration_status IN ('legacy', 'migrated'));

-- Add email column to clinic_veterinarians if not exists (for new auth system)
ALTER TABLE public.clinic_veterinarians 
ADD COLUMN email TEXT UNIQUE;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_veterinarian_auth_users_updated_at
    BEFORE UPDATE ON public.veterinarian_auth_users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
