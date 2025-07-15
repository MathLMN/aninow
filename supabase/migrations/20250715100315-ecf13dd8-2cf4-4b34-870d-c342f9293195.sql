
-- Add veterinarian_id column to bookings table to support veterinarian-specific appointments
ALTER TABLE public.bookings 
ADD COLUMN veterinarian_id uuid REFERENCES public.clinic_veterinarians(id);

-- Add index for better performance when querying by veterinarian
CREATE INDEX idx_bookings_veterinarian_id ON public.bookings(veterinarian_id);

-- Add index for better performance when querying by appointment date and time
CREATE INDEX idx_bookings_appointment_date_time ON public.bookings(appointment_date, appointment_time);
