
-- Create the veterinary_practice_requests table
CREATE TABLE public.veterinary_practice_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  establishment_name TEXT NOT NULL,
  contact_person_name TEXT NOT NULL,
  contact_person_role TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_postal_code TEXT NOT NULL,
  address_country TEXT NOT NULL DEFAULT 'France',
  number_of_veterinarians INTEGER NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.veterinary_practice_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is for public veterinary practice requests)
CREATE POLICY "Allow all operations on veterinary_practice_requests" 
  ON public.veterinary_practice_requests 
  FOR ALL 
  USING (true);

-- Create trigger to automatically update the updated_at timestamp
CREATE TRIGGER set_timestamp_veterinary_practice_requests
  BEFORE UPDATE ON public.veterinary_practice_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();
