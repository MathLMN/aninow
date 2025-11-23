-- Fix Function Search Path Mutable security issue
-- Add SET search_path to all SECURITY DEFINER functions to prevent SQL injection attacks

-- Fix get_clinic_by_slug function
CREATE OR REPLACE FUNCTION public.get_clinic_by_slug(clinic_slug text)
 RETURNS TABLE(id uuid, name text, slug text, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, pg_catalog
AS $function$
  SELECT id, name, slug, created_at, updated_at 
  FROM public.clinics 
  WHERE clinics.slug = clinic_slug;
$function$;

-- Fix get_user_clinic_id function
CREATE OR REPLACE FUNCTION public.get_user_clinic_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, pg_catalog
AS $function$
  SELECT clinic_id FROM public.user_clinic_access 
  WHERE user_id = auth.uid() AND is_active = true 
  LIMIT 1;
$function$;

-- Fix get_clinic_veterinarians_for_booking function
CREATE OR REPLACE FUNCTION public.get_clinic_veterinarians_for_booking(clinic_slug text)
 RETURNS TABLE(id uuid, name text, is_active boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, pg_catalog
AS $function$
  SELECT 
    cv.id,
    cv.name,
    cv.is_active
  FROM clinic_veterinarians cv
  INNER JOIN clinics c ON c.id = cv.clinic_id
  WHERE c.slug = clinic_slug 
    AND cv.is_active = true
  ORDER BY cv.name;
$function$;

-- Fix notify_booking_confirmed trigger function
CREATE OR REPLACE FUNCTION public.notify_booking_confirmed()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_catalog
AS $function$
DECLARE
  function_url text := 'https://ddbxghuhjssguklrdrkp.supabase.co/functions/v1/send-confirmation-email';
BEGIN
  IF NEW.status = 'confirmed' 
     AND (OLD.status IS NULL OR OLD.status != 'confirmed')
     AND NEW.client_email IS NOT NULL 
     AND NEW.appointment_date IS NOT NULL 
     AND NEW.appointment_time IS NOT NULL THEN
    
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
    RAISE WARNING 'Error sending confirmation email for booking %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- Fix notify_booking_cancelled trigger function
CREATE OR REPLACE FUNCTION public.notify_booking_cancelled()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_catalog
AS $function$
DECLARE
  function_url text := 'https://ddbxghuhjssguklrdrkp.supabase.co/functions/v1/send-cancellation-email';
BEGIN
  IF OLD.client_email IS NOT NULL 
     AND OLD.appointment_date IS NOT NULL 
     AND OLD.appointment_time IS NOT NULL THEN
    
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
    RAISE WARNING 'Error sending cancellation email for booking %: %', OLD.id, SQLERRM;
    RETURN OLD;
END;
$function$;

-- Fix delete_booking_photos function
CREATE OR REPLACE FUNCTION public.delete_booking_photos()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_catalog
AS $function$
DECLARE
  folder_path text;
BEGIN
  folder_path := OLD.clinic_id::text || '/' || OLD.id::text;
  
  DELETE FROM storage.objects
  WHERE bucket_id = 'consultation-photos'
    AND name LIKE folder_path || '/%';
  
  RETURN OLD;
END;
$function$;