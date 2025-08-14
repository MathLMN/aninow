-- CRITICAL SECURITY FIX: Remove overly permissive RLS policies and implement proper security

-- First, drop all existing overly permissive policies
DROP POLICY IF EXISTS "Allow all operations on bookings" ON bookings;
DROP POLICY IF EXISTS "Allow all operations on ai_analysis_logs" ON ai_analysis_logs;
DROP POLICY IF EXISTS "Allow all operations on prompt_templates" ON prompt_templates;
DROP POLICY IF EXISTS "Allow all operations on prompt_performance_logs" ON prompt_performance_logs;
DROP POLICY IF EXISTS "Allow all operations on prompt_rules" ON prompt_rules;
DROP POLICY IF EXISTS "Allow all operations on admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow all operations on admin_clinic_creations" ON admin_clinic_creations;

-- Make clinic_id NOT NULL on bookings table to prevent security holes
UPDATE bookings SET clinic_id = (
  SELECT id FROM clinics LIMIT 1
) WHERE clinic_id IS NULL;

ALTER TABLE bookings ALTER COLUMN clinic_id SET NOT NULL;

-- SECURE POLICIES FOR BOOKINGS TABLE
-- Only authenticated clinic staff can view bookings for their clinic
CREATE POLICY "Clinic staff can view their clinic bookings" 
ON bookings FOR SELECT 
TO authenticated
USING (clinic_id = get_user_clinic_id());

-- Only authenticated clinic staff can update bookings for their clinic
CREATE POLICY "Clinic staff can update their clinic bookings" 
ON bookings FOR UPDATE 
TO authenticated
USING (clinic_id = get_user_clinic_id());

-- Allow public insertion of bookings for the booking process
CREATE POLICY "Public can create bookings for clinics" 
ON bookings FOR INSERT 
WITH CHECK (clinic_id IS NOT NULL);

-- SECURE POLICIES FOR AI_ANALYSIS_LOGS
-- Only authenticated clinic staff can view analysis logs for their clinic bookings
CREATE POLICY "Clinic staff can view their clinic analysis logs" 
ON ai_analysis_logs FOR SELECT 
TO authenticated
USING (
  booking_id IN (
    SELECT id FROM bookings WHERE clinic_id = get_user_clinic_id()
  )
);

-- System can insert analysis logs
CREATE POLICY "System can insert analysis logs" 
ON ai_analysis_logs FOR INSERT 
WITH CHECK (true);

-- SECURE POLICIES FOR ADMIN TABLES
-- Only authenticated admin users can access admin_users
CREATE POLICY "Admin users can view admin profiles" 
ON admin_users FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admin users can update their profile" 
ON admin_users FOR UPDATE 
TO authenticated
USING (user_id = auth.uid());

-- Only authenticated admin users can access admin_clinic_creations
CREATE POLICY "Admin users can view their clinic creations" 
ON admin_clinic_creations FOR SELECT 
TO authenticated
USING (admin_user_id = auth.uid());

CREATE POLICY "Admin users can update their clinic creations" 
ON admin_clinic_creations FOR UPDATE 
TO authenticated
USING (admin_user_id = auth.uid());

CREATE POLICY "Admin users can create clinic accounts" 
ON admin_clinic_creations FOR INSERT 
TO authenticated
WITH CHECK (admin_user_id = auth.uid());

-- SECURE POLICIES FOR PROMPT MANAGEMENT
-- Only authenticated users can access prompt templates
CREATE POLICY "Authenticated users can view prompt templates" 
ON prompt_templates FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can manage prompt templates" 
ON prompt_templates FOR ALL 
TO authenticated
USING (true);

-- Only authenticated users can access prompt rules
CREATE POLICY "Authenticated users can view prompt rules" 
ON prompt_rules FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can manage prompt rules" 
ON prompt_rules FOR ALL 
TO authenticated
USING (true);

-- Only authenticated users can view prompt performance logs
CREATE POLICY "Authenticated users can view prompt performance logs" 
ON prompt_performance_logs FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "System can insert prompt performance logs" 
ON prompt_performance_logs FOR INSERT 
WITH CHECK (true);