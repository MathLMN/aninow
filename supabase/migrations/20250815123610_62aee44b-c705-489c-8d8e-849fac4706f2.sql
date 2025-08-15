-- Fix security issue: Restrict user_clinic_access table access to authenticated users only
-- Current issue: Table is publicly readable exposing sensitive user-clinic relationships

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can view their clinic access" ON public.user_clinic_access;
DROP POLICY IF EXISTS "Allow admin clinic creation" ON public.user_clinic_access;

-- Create secure policies that only allow authenticated users to access their own data
CREATE POLICY "Users can view their own clinic access" 
ON public.user_clinic_access 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Allow admin users to view records they created (for admin panel functionality)
CREATE POLICY "Admins can view clinic access they created" 
ON public.user_clinic_access 
FOR SELECT 
TO authenticated
USING (
  created_by_admin IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

-- Allow authenticated admin users to create clinic access records
CREATE POLICY "Admins can create clinic access records" 
ON public.user_clinic_access 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

-- Allow users to update their own clinic access (for password change tracking)
CREATE POLICY "Users can update their own clinic access" 
ON public.user_clinic_access 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());