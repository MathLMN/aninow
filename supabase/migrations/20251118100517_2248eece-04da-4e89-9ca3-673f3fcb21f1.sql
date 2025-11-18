-- Create trigger function to send cancellation email before deleting a booking
CREATE OR REPLACE FUNCTION public.notify_booking_cancelled()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  function_url text := 'https://ddbxghuhjssguklrdrkp.supabase.co/functions/v1/send-cancellation-email';
BEGIN
  -- Only send email if booking has valid appointment data and client email
  IF OLD.client_email IS NOT NULL 
     AND OLD.appointment_date IS NOT NULL 
     AND OLD.appointment_time IS NOT NULL 
     AND OLD.status != 'cancelled' THEN
    
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
        'appointment_time', OLD.appointment_time
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
$$;

-- Create trigger that fires BEFORE delete on bookings
DROP TRIGGER IF EXISTS on_booking_deleted ON bookings;
CREATE TRIGGER on_booking_deleted
  BEFORE DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_cancelled();