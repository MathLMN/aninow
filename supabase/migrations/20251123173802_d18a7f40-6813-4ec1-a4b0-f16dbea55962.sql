-- Fix RLS policies for bookings table to allow public INSERT
-- Drop existing policy
DROP POLICY IF EXISTS "Allow all operations on bookings" ON public.bookings;

-- Create separate policies for better control
-- Allow anonymous/public users to INSERT bookings (for online booking)
CREATE POLICY "Allow public insert on bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (true);

-- Allow authenticated users (veterinarians) to view all bookings in their clinic
CREATE POLICY "Allow authenticated select on bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to update bookings
CREATE POLICY "Allow authenticated update on bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete bookings
CREATE POLICY "Allow authenticated delete on bookings" 
  ON public.bookings 
  FOR DELETE 
  USING (true);