
-- Ajouter les colonnes nécessaires à la table vet_sessions pour stocker les informations de la clinique
ALTER TABLE public.vet_sessions 
ADD COLUMN clinic_name TEXT,
ADD COLUMN clinic_phone TEXT,
ADD COLUMN clinic_address TEXT,
ADD COLUMN account_status TEXT DEFAULT 'active',
ADD COLUMN registration_date TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Mettre à jour les enregistrements existants avec des valeurs par défaut
UPDATE public.vet_sessions 
SET clinic_name = 'Clinique Vétérinaire',
    account_status = 'active',
    registration_date = now()
WHERE clinic_name IS NULL;
