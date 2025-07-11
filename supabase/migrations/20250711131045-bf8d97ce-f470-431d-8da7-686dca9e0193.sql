
-- Modifier la table clinic_settings pour supporter des horaires détaillés par jour
ALTER TABLE public.clinic_settings 
DROP COLUMN opening_time,
DROP COLUMN closing_time,
DROP COLUMN opening_days;

-- Ajouter une nouvelle colonne pour stocker les horaires détaillés par jour
ALTER TABLE public.clinic_settings 
ADD COLUMN daily_schedules JSONB DEFAULT '{
  "monday": {"isOpen": true, "morning": {"start": "08:00", "end": "12:00"}, "afternoon": {"start": "14:00", "end": "18:00"}},
  "tuesday": {"isOpen": true, "morning": {"start": "08:00", "end": "12:00"}, "afternoon": {"start": "14:00", "end": "18:00"}},
  "wednesday": {"isOpen": true, "morning": {"start": "08:00", "end": "12:00"}, "afternoon": {"start": "14:00", "end": "18:00"}},
  "thursday": {"isOpen": true, "morning": {"start": "08:00", "end": "12:00"}, "afternoon": {"start": "14:00", "end": "18:00"}},
  "friday": {"isOpen": true, "morning": {"start": "08:00", "end": "12:00"}, "afternoon": {"start": "14:00", "end": "18:00"}},
  "saturday": {"isOpen": false, "morning": {"start": "", "end": ""}, "afternoon": {"start": "", "end": ""}},
  "sunday": {"isOpen": false, "morning": {"start": "", "end": ""}, "afternoon": {"start": "", "end": ""}}
}'::jsonb;

-- Mettre à jour les enregistrements existants avec des horaires par défaut
UPDATE public.clinic_settings 
SET daily_schedules = '{
  "monday": {"isOpen": true, "morning": {"start": "08:00", "end": "12:00"}, "afternoon": {"start": "14:00", "end": "18:00"}},
  "tuesday": {"isOpen": true, "morning": {"start": "08:00", "end": "12:00"}, "afternoon": {"start": "14:00", "end": "18:00"}},
  "wednesday": {"isOpen": true, "morning": {"start": "08:00", "end": "12:00"}, "afternoon": {"start": "14:00", "end": "18:00"}},
  "thursday": {"isOpen": true, "morning": {"start": "08:00", "end": "12:00"}, "afternoon": {"start": "14:00", "end": "18:00"}},
  "friday": {"isOpen": true, "morning": {"start": "08:00", "end": "12:00"}, "afternoon": {"start": "14:00", "end": "18:00"}},
  "saturday": {"isOpen": false, "morning": {"start": "", "end": ""}, "afternoon": {"start": "", "end": ""}},
  "sunday": {"isOpen": false, "morning": {"start": "", "end": ""}, "afternoon": {"start": "", "end": ""}}
}'::jsonb
WHERE daily_schedules IS NULL;
