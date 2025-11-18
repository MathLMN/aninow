-- Update trigger to pass clinic_id in the request body
CREATE OR REPLACE FUNCTION public.notify_booking_cancelled()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  function_url text := 'https://ddbxghuhjssguklrdrkp.supabase.co/functions/v1/send-cancellation-email';
BEGIN
  -- Only send email if booking has valid appointment data and client email
  IF OLD.client_email IS NOT NULL 
     AND OLD.appointment_date IS NOT NULL 
     AND OLD.appointment_time IS NOT NULL THEN
    
    -- Call the Edge Function asynchronously using pg_net
    PERFORM net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYnhnaHVoanNzZ3VrbHJkcmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNDg5ODIsImV4cCI6MjA2NzcyNDk4Mn0.K_2Afby3TV9bfnC3WxHYvzEBfikrnV-J6nr0BpRE--Y'
      ),
      body := jsonb_build_object(
        'booking_id', OLD.id,
        'client_email', OLD.client_email,
        'client_name', OLD.client_name,
        'animal_name', OLD.animal_name,
        'appointment_date', OLD.appointment_date,
        'appointment_time', OLD.appointment_time,
        'clinic_id', OLD.clinic_id
      )
    );
    
    RAISE NOTICE 'Cancellation email triggered for booking %', OLD.id;
  END IF;
  
  RETURN OLD;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE WARNING 'Error sending cancellation email for booking %: %', OLD.id, SQLERRM;
    RETURN OLD;
END;
$function$;