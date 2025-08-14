-- SECURITY FIX: Restrict veterinarian data access while maintaining booking functionality

-- Drop the overly permissive public read policy
DROP POLICY IF EXISTS "Allow public read access to active veterinarians" ON clinic_veterinarians;

-- Create a secure policy for clinic staff to manage their veterinarians
CREATE POLICY "Clinic staff can view their clinic veterinarians" 
ON clinic_veterinarians FOR SELECT 
TO authenticated
USING (clinic_id = get_user_clinic_id());

CREATE POLICY "Clinic staff can update their clinic veterinarians" 
ON clinic_veterinarians FOR UPDATE 
TO authenticated
USING (clinic_id = get_user_clinic_id());

CREATE POLICY "Clinic staff can insert their clinic veterinarians" 
ON clinic_veterinarians FOR INSERT 
TO authenticated
WITH CHECK (clinic_id = get_user_clinic_id());

CREATE POLICY "Clinic staff can delete their clinic veterinarians" 
ON clinic_veterinarians FOR DELETE 
TO authenticated
USING (clinic_id = get_user_clinic_id());

-- Create a security definer function for public booking access
-- This exposes only minimal data (id, name) needed for booking
CREATE OR REPLACE FUNCTION public.get_clinic_veterinarians_for_booking(clinic_slug text)
RETURNS TABLE(
  id uuid,
  name text,
  is_active boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    cv.id,
    cv.name,
    cv.is_active
  FROM clinic_veterinarians cv
  INNER JOIN clinics c ON c.id = cv.clinic_id
  WHERE c.slug = clinic_slug 
    AND cv.is_active = true
  ORDER BY cv.name;
$$;

-- Grant execute permission to anonymous users for the booking function
GRANT EXECUTE ON FUNCTION public.get_clinic_veterinarians_for_booking(text) TO anon;