-- Create email_logs table to track sent emails
CREATE TABLE IF NOT EXISTS public.email_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  email_type text NOT NULL,
  recipient_email text NOT NULL,
  status text NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  resend_id text,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Policy for clinic staff to view their clinic's email logs
CREATE POLICY "Clinic staff can view their clinic email logs"
ON public.email_logs
FOR SELECT
USING (
  booking_id IN (
    SELECT id FROM public.bookings 
    WHERE clinic_id = get_user_clinic_id()
  )
);

-- Policy for system to insert email logs
CREATE POLICY "System can insert email logs"
ON public.email_logs
FOR INSERT
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_booking_id ON public.email_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs(created_at);

-- Create trigger function to send confirmation email
CREATE OR REPLACE FUNCTION public.notify_booking_confirmed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  function_url text;
  service_role_key text;
BEGIN
  -- Only proceed if status changes to 'confirmed' and email exists
  IF NEW.status = 'confirmed' 
     AND (OLD.status IS NULL OR OLD.status != 'confirmed')
     AND NEW.client_email IS NOT NULL 
     AND NEW.appointment_date IS NOT NULL 
     AND NEW.appointment_time IS NOT NULL THEN
    
    -- Build the function URL
    function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-confirmation-email';
    service_role_key := current_setting('app.settings.service_role_key', true);
    
    -- Call the Edge Function asynchronously
    PERFORM net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object(
        'booking_id', NEW.id,
        'client_email', NEW.client_email,
        'client_name', NEW.client_name,
        'animal_name', NEW.animal_name,
        'appointment_date', NEW.appointment_date,
        'appointment_time', NEW.appointment_time
      )
    );
    
    RAISE NOTICE 'Confirmation email triggered for booking %', NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE WARNING 'Error sending confirmation email for booking %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger on bookings table
DROP TRIGGER IF EXISTS booking_confirmed_trigger ON public.bookings;
CREATE TRIGGER booking_confirmed_trigger
AFTER UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.notify_booking_confirmed();

-- Create trigger to update email_logs updated_at
CREATE TRIGGER update_email_logs_updated_at
BEFORE UPDATE ON public.email_logs
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Set up the required configuration for the trigger function
-- These settings need to be configured at the database level
DO $$
BEGIN
  -- Note: These settings need to be set via Supabase dashboard or CLI
  -- ALTER DATABASE postgres SET app.settings.supabase_url = 'https://ddbxghuhjssguklrdrkp.supabase.co';
  -- ALTER DATABASE postgres SET app.settings.service_role_key = 'your-service-role-key';
  
  RAISE NOTICE 'Email confirmation automation setup complete';
  RAISE NOTICE 'Remember to configure app.settings.supabase_url and app.settings.service_role_key';
END $$;