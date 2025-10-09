-- Insert initial booking form questions from /booking page

-- Question 1: Animal Species Selection
INSERT INTO form_questions (
  question_key,
  question_type,
  question_text,
  description,
  options,
  order_index,
  is_active
) VALUES (
  'animal_species',
  'animal_info',
  'Quelle est l''espèce de votre animal ?',
  'Sélection de l''espèce principale de l''animal',
  '[
    {"id": "chat", "label": "Chat", "color": "blue"},
    {"id": "chien", "label": "Chien", "color": "blue"},
    {"id": "autre", "label": "Autre (précisez)", "color": "blue"}
  ]'::jsonb,
  1,
  true
);

-- Question 2: Animal Name
INSERT INTO form_questions (
  question_key,
  question_type,
  question_text,
  description,
  options,
  order_index,
  is_active,
  parent_question_key,
  trigger_conditions
) VALUES (
  'animal_name',
  'animal_info',
  'Quel est le nom de votre animal ?',
  'Nom de l''animal - affiché après sélection de l''espèce',
  '[]'::jsonb,
  2,
  true,
  'animal_species',
  '{"show_if": ["chat", "chien", "autre"]}'::jsonb
);

-- Question 3: Custom Species (if "Autre" selected)
INSERT INTO form_questions (
  question_key,
  question_type,
  question_text,
  description,
  options,
  order_index,
  is_active,
  parent_question_key,
  trigger_conditions
) VALUES (
  'custom_species',
  'animal_info',
  'Précisez l''espèce de votre animal',
  'Champ texte libre pour préciser une espèce non listée',
  '[]'::jsonb,
  3,
  true,
  'animal_species',
  '{"show_if": ["autre"]}'::jsonb
);

-- Question 4: Multiple Animals Options
INSERT INTO form_questions (
  question_key,
  question_type,
  question_text,
  description,
  options,
  order_index,
  is_active
) VALUES (
  'multiple_animals',
  'general_info',
  'Souhaitez-vous prendre rendez-vous pour plusieurs animaux ?',
  'Options pour ajouter un 2ème animal ou une portée',
  '[
    {"id": "2-animaux", "label": "Ajouter un 2ème animal", "color": "blue"},
    {"id": "une-portee", "label": "Venir avec une portée", "color": "blue"}
  ]'::jsonb,
  4,
  true
);

-- Question 5: Vaccination Type for Litter
INSERT INTO form_questions (
  question_key,
  question_type,
  question_text,
  description,
  options,
  order_index,
  is_active,
  parent_question_key,
  trigger_conditions
) VALUES (
  'litter_vaccination_type',
  'general_info',
  'Vous souhaitez',
  'Type de service pour une portée',
  '[
    {"id": "vaccinations-identifications", "label": "Vaccinations et identifications", "color": "blue"},
    {"id": "vaccinations-seulement", "label": "Vaccinations uniquement", "color": "blue"}
  ]'::jsonb,
  5,
  true,
  'multiple_animals',
  '{"show_if": ["une-portee"]}'::jsonb
);