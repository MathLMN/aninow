-- Create enum for question types
CREATE TYPE public.form_question_type AS ENUM (
  'symptom',
  'conditional_question',
  'general_info',
  'animal_info',
  'contact_info'
);

-- Create table for form questions
CREATE TABLE public.form_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_type form_question_type NOT NULL,
  question_key TEXT NOT NULL UNIQUE,
  question_text TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  parent_question_key TEXT,
  trigger_conditions JSONB DEFAULT '{}'::jsonb,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.form_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin users can manage form questions"
ON public.form_questions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.user_id = auth.uid()
    AND admin_users.is_active = true
  )
);

CREATE POLICY "Public can read active form questions"
ON public.form_questions
FOR SELECT
TO authenticated, anon
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_form_questions_updated_at
BEFORE UPDATE ON public.form_questions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX idx_form_questions_type ON public.form_questions(question_type);
CREATE INDEX idx_form_questions_order ON public.form_questions(order_index);
CREATE INDEX idx_form_questions_active ON public.form_questions(is_active);

-- Insert default symptoms as initial data
INSERT INTO public.form_questions (question_key, question_type, question_text, options, order_index) VALUES
('symptoms_selection', 'symptom', 'Quels sont les symptômes observés ?', 
 '[
   {"id": "vomiting", "label": "Vomissements", "color": "red"},
   {"id": "diarrhea", "label": "Diarrhée", "color": "orange"},
   {"id": "loss_of_appetite", "label": "Perte d''appétit", "color": "yellow"},
   {"id": "listless", "label": "Abattement", "color": "blue"},
   {"id": "lameness", "label": "Boiterie", "color": "purple"},
   {"id": "wound", "label": "Plaie", "color": "red"},
   {"id": "eye_discharge", "label": "Écoulement oculaire", "color": "cyan"},
   {"id": "ear_problems", "label": "Problème d''oreille", "color": "pink"},
   {"id": "skin_itching", "label": "Démangeaisons cutanées", "color": "green"},
   {"id": "breathing_difficulties", "label": "Difficultés respiratoires", "color": "red"},
   {"id": "excessive_thirst", "label": "Soif excessive", "color": "blue"},
   {"id": "urinary_problems", "label": "Problèmes urinaires", "color": "orange"},
   {"id": "lump", "label": "Grosseur", "color": "purple"},
   {"id": "blood_in_stool", "label": "Sang dans les selles", "color": "red"},
   {"id": "aggressive", "label": "Agressivité", "color": "red"}
 ]'::jsonb, 1);