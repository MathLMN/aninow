-- Step 1: Add all new enum values
ALTER TYPE public.form_question_type ADD VALUE IF NOT EXISTS 'booking_start';
ALTER TYPE public.form_question_type ADD VALUE IF NOT EXISTS 'consultation_reason';
ALTER TYPE public.form_question_type ADD VALUE IF NOT EXISTS 'conditional_questions';
ALTER TYPE public.form_question_type ADD VALUE IF NOT EXISTS 'symptom_duration';
ALTER TYPE public.form_question_type ADD VALUE IF NOT EXISTS 'additional_points';
ALTER TYPE public.form_question_type ADD VALUE IF NOT EXISTS 'client_comment';
ALTER TYPE public.form_question_type ADD VALUE IF NOT EXISTS 'appointment_slots';