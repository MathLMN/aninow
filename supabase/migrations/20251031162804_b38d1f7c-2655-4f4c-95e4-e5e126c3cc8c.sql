-- Fix the notify_booking_confirmed function with proper search_path and hardcoded URL
CREATE OR REPLACE FUNCTION public.notify_booking_confirmed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  function_url text := 'https://ddbxghuhjssguklrdrkp.supabase.co/functions/v1/send-confirmation-email';
BEGIN
  -- Only proceed if status changes to 'confirmed' and email exists
  IF NEW.status = 'confirmed' 
     AND (OLD.status IS NULL OR OLD.status != 'confirmed')
     AND NEW.client_email IS NOT NULL 
     AND NEW.appointment_date IS NOT NULL 
     AND NEW.appointment_time IS NOT NULL THEN
    
    -- Call the Edge Function asynchronously using pg_net
    PERFORM net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYnhnaHVoanNzZ3VrbHJkcmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNDg5ODIsImV4cCI6MjA2NzcyNDk4Mn0.K_2Afby3TV9bfnC3WxHYvzEBfikrnV-J6nr0BpRE--Y'
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