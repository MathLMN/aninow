
-- First, let's create a clinics table to represent different veterinary clinics
CREATE TABLE public.clinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on the clinics table
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- Add clinic_id to all relevant tables
ALTER TABLE public.clinic_veterinarians ADD COLUMN clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE;
ALTER TABLE public.clinic_settings ADD COLUMN clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE;
ALTER TABLE public.veterinarian_schedules ADD COLUMN clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE;
ALTER TABLE public.veterinarian_absences ADD COLUMN clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE;
ALTER TABLE public.bookings ADD COLUMN clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE;
ALTER TABLE public.available_slots ADD COLUMN clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE;
ALTER TABLE public.consultation_types ADD COLUMN clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE;
ALTER TABLE public.slot_assignments ADD COLUMN clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE;

-- Create a table to link auth users to clinics (for multi-clinic access if needed)
CREATE TABLE public.user_clinic_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'veterinarian',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, clinic_id)
);

ALTER TABLE public.user_clinic_access ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to get user's clinic ID
CREATE OR REPLACE FUNCTION public.get_user_clinic_id()
RETURNS UUID AS $$
  SELECT clinic_id FROM public.user_clinic_access 
  WHERE user_id = auth.uid() AND is_active = true 
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create RLS policies for all tables to filter by clinic_id

-- Clinics table policies
CREATE POLICY "Users can view their clinic" ON public.clinics
  FOR SELECT USING (id = public.get_user_clinic_id());

CREATE POLICY "Users can update their clinic" ON public.clinics
  FOR UPDATE USING (id = public.get_user_clinic_id());

-- User clinic access policies
CREATE POLICY "Users can view their clinic access" ON public.user_clinic_access
  FOR SELECT USING (user_id = auth.uid());

-- Clinic veterinarians policies
CREATE POLICY "Users can view clinic veterinarians" ON public.clinic_veterinarians
  FOR SELECT USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can insert clinic veterinarians" ON public.clinic_veterinarians
  FOR INSERT WITH CHECK (clinic_id = public.get_user_clinic_id());

CREATE POLICY "Users can update clinic veterinarians" ON public.clinic_veterinarians
  FOR UPDATE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can delete clinic veterinarians" ON public.clinic_veterinarians
  FOR DELETE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

-- Clinic settings policies
CREATE POLICY "Users can view clinic settings" ON public.clinic_settings
  FOR SELECT USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can insert clinic settings" ON public.clinic_settings
  FOR INSERT WITH CHECK (clinic_id = public.get_user_clinic_id());

CREATE POLICY "Users can update clinic settings" ON public.clinic_settings
  FOR UPDATE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

-- Veterinarian schedules policies
CREATE POLICY "Users can view veterinarian schedules" ON public.veterinarian_schedules
  FOR SELECT USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can insert veterinarian schedules" ON public.veterinarian_schedules
  FOR INSERT WITH CHECK (clinic_id = public.get_user_clinic_id());

CREATE POLICY "Users can update veterinarian schedules" ON public.veterinarian_schedules
  FOR UPDATE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can delete veterinarian schedules" ON public.veterinarian_schedules
  FOR DELETE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

-- Veterinarian absences policies
CREATE POLICY "Users can view veterinarian absences" ON public.veterinarian_absences
  FOR SELECT USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can insert veterinarian absences" ON public.veterinarian_absences
  FOR INSERT WITH CHECK (clinic_id = public.get_user_clinic_id());

CREATE POLICY "Users can update veterinarian absences" ON public.veterinarian_absences
  FOR UPDATE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can delete veterinarian absences" ON public.veterinarian_absences
  FOR DELETE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

-- Bookings policies
CREATE POLICY "Users can view clinic bookings" ON public.bookings
  FOR SELECT USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can insert clinic bookings" ON public.bookings
  FOR INSERT WITH CHECK (clinic_id = public.get_user_clinic_id());

CREATE POLICY "Users can update clinic bookings" ON public.bookings
  FOR UPDATE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

-- Available slots policies
CREATE POLICY "Users can view available slots" ON public.available_slots
  FOR SELECT USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can insert available slots" ON public.available_slots
  FOR INSERT WITH CHECK (clinic_id = public.get_user_clinic_id());

CREATE POLICY "Users can update available slots" ON public.available_slots
  FOR UPDATE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can delete available slots" ON public.available_slots
  FOR DELETE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

-- Consultation types policies
CREATE POLICY "Users can view consultation types" ON public.consultation_types
  FOR SELECT USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can insert consultation types" ON public.consultation_types
  FOR INSERT WITH CHECK (clinic_id = public.get_user_clinic_id());

CREATE POLICY "Users can update consultation types" ON public.consultation_types
  FOR UPDATE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can delete consultation types" ON public.consultation_types
  FOR DELETE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

-- Slot assignments policies
CREATE POLICY "Users can view slot assignments" ON public.slot_assignments
  FOR SELECT USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can insert slot assignments" ON public.slot_assignments
  FOR INSERT WITH CHECK (clinic_id = public.get_user_clinic_id());

CREATE POLICY "Users can update slot assignments" ON public.slot_assignments
  FOR UPDATE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

CREATE POLICY "Users can delete slot assignments" ON public.slot_assignments
  FOR DELETE USING (clinic_id = public.get_user_clinic_id() OR clinic_id IS NULL);

-- Drop existing policies that allow all operations (replace with clinic-specific ones)
DROP POLICY IF EXISTS "Allow all operations on clinic_veterinarians" ON public.clinic_veterinarians;
DROP POLICY IF EXISTS "Allow all operations on clinic_settings" ON public.clinic_settings;
DROP POLICY IF EXISTS "Allow all operations on veterinarian_schedules" ON public.veterinarian_schedules;
DROP POLICY IF EXISTS "Allow all operations on veterinarian_absences" ON public.veterinarian_absences;
DROP POLICY IF EXISTS "Allow all operations on bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow all operations on available_slots" ON public.available_slots;
DROP POLICY IF EXISTS "Allow all operations on consultation_types" ON public.consultation_types;
DROP POLICY IF EXISTS "Allow all operations on slot_assignments" ON public.slot_assignments;

-- Create a default clinic and migrate existing data
INSERT INTO public.clinics (id, name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Clinique par défaut')
ON CONFLICT DO NOTHING;

-- Update existing records to use the default clinic
UPDATE public.clinic_veterinarians SET clinic_id = '00000000-0000-0000-0000-000000000001' WHERE clinic_id IS NULL;
UPDATE public.clinic_settings SET clinic_id = '00000000-0000-0000-0000-000000000001' WHERE clinic_id IS NULL;
UPDATE public.veterinarian_schedules SET clinic_id = '00000000-0000-0000-0000-000000000001' WHERE clinic_id IS NULL;
UPDATE public.veterinarian_absences SET clinic_id = '00000000-0000-0000-0000-000000000001' WHERE clinic_id IS NULL;
UPDATE public.bookings SET clinic_id = '00000000-0000-0000-0000-000000000001' WHERE clinic_id IS NULL;
UPDATE public.available_slots SET clinic_id = '00000000-0000-0000-0000-000000000001' WHERE clinic_id IS NULL;
UPDATE public.consultation_types SET clinic_id = '00000000-0000-0000-0000-000000000001' WHERE clinic_id IS NULL;
UPDATE public.slot_assignments SET clinic_id = '00000000-0000-0000-0000-000000000001' WHERE clinic_id IS NULL;

-- Create triggers to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.clinics
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_clinic_access
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
