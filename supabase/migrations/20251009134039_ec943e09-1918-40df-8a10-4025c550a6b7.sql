-- Step 2: Migrate existing data to new enum values
UPDATE public.form_questions
SET question_type = 'booking_start'
WHERE question_type = 'symptom';

UPDATE public.form_questions
SET question_type = 'conditional_questions'
WHERE question_type = 'conditional_question';

UPDATE public.form_questions
SET question_type = 'booking_start'
WHERE question_type = 'general_info';