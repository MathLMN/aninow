
-- Associer le compte Admin (c715d2e7-0d17-4734-bda7-345b0722aa1c) à la clinique par défaut
INSERT INTO public.user_clinic_access (
  user_id,
  clinic_id,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  'c715d2e7-0d17-4734-bda7-345b0722aa1c',
  '00000000-0000-0000-0000-000000000001',
  'admin',
  true,
  now(),
  now()
) ON CONFLICT (user_id, clinic_id) DO UPDATE SET
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- S'assurer que les paramètres de clinique existent pour la clinique par défaut
INSERT INTO public.clinic_settings (
  clinic_id,
  clinic_name,
  asv_enabled,
  daily_schedules,
  default_slot_duration_minutes,
  clinic_address_country,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Clinique par défaut (Admin)',
  true,
  '{"friday": {"isOpen": true, "morning": {"end": "12:00", "start": "08:00"}, "afternoon": {"end": "18:00", "start": "14:00"}}, "monday": {"isOpen": true, "morning": {"end": "12:00", "start": "08:00"}, "afternoon": {"end": "18:00", "start": "14:00"}}, "sunday": {"isOpen": false, "morning": {"end": "", "start": ""}, "afternoon": {"end": "", "start": ""}}, "tuesday": {"isOpen": true, "morning": {"end": "12:00", "start": "08:00"}, "afternoon": {"end": "18:00", "start": "14:00"}}, "saturday": {"isOpen": false, "morning": {"end": "", "start": ""}, "afternoon": {"end": "", "start": ""}}, "thursday": {"isOpen": true, "morning": {"end": "12:00", "start": "08:00"}, "afternoon": {"end": "18:00", "start": "14:00"}}, "wednesday": {"isOpen": true, "morning": {"end": "12:00", "start": "08:00"}, "afternoon": {"end": "18:00", "start": "14:00"}}}'::jsonb,
  30,
  'France',
  now(),
  now()
) ON CONFLICT (clinic_id) DO UPDATE SET
  updated_at = now();
