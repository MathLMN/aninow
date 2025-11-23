-- Fix remaining functions with mutable search_path
-- Add SET search_path to the remaining SECURITY DEFINER and trigger functions

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_catalog
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Fix handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_catalog
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Fix set_booking_source function
CREATE OR REPLACE FUNCTION public.set_booking_source()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_catalog
AS $function$
BEGIN
  IF NEW.is_blocked IS TRUE THEN
    NEW.booking_source := 'blocked';
  ELSIF auth.uid() IS NULL THEN
    NEW.booking_source := 'online';
  ELSE
    NEW.booking_source := COALESCE(NEW.booking_source, 'manual');
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix trigger_set_timestamp function
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_catalog
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;