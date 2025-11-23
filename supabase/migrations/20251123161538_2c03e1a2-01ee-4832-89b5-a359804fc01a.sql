-- Fix bookings table public exposure security issue
-- Remove overly permissive policies that allow unrestricted access

-- Drop policies that allow all users unrestricted access
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bookings;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.bookings;
DROP POLICY IF EXISTS "Enable update for all users" ON public.bookings;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.bookings;

-- The following policies are kept and provide proper security:
-- 1. "Public can create bookings for clinics" - Allows unauthenticated users to INSERT bookings (online booking flow)
-- 2. "Clinic staff can view their clinic bookings" - Authenticated staff can SELECT their clinic's bookings
-- 3. "Clinic staff can update their clinic bookings" - Authenticated staff can UPDATE their clinic's bookings
-- 4. "Users can view clinic bookings" - Authenticated users can SELECT clinic bookings via get_user_clinic_id()
-- 5. "Users can update clinic bookings" - Authenticated users can UPDATE clinic bookings via get_user_clinic_id()
-- 6. "Users can insert clinic bookings" - Authenticated users can INSERT clinic bookings via get_user_clinic_id()

-- No new policies needed - existing clinic-scoped policies provide proper access control