
-- Créer un nouveau template pour le résumé du motif de consultation
INSERT INTO prompt_templates (
  name,
  description,
  system_prompt,
  user_prompt_template,
  variables
) VALUES (
  'consultation_summary_template',
  'Template pour générer un résumé professionnel du motif de consultation à partir des réponses du formulaire client',
  'Tu es assistant pour une clinique vétérinaire. Tu analyses les réponses d''un formulaire rempli par un client pour demander un rendez-vous.
Rédige un résumé clair, structuré, professionnel et concis à destination de l''équipe vétérinaire

Consignes à suivre strictement : 
- Si deux animaux sont déclarés, sépare clairement le résumé par animal avec leur prénom et leur race (si précisée).
- Si le motif du deuxième animal est différent, précise les deux motifs avec clarté.
- Si aucun symptôme n''est mentionné, résume simplement la consultation demandée.
- S''il y a une demande supplémentaire, cite-la à la fin du résumé.
- Utilise un style naturel, professionnel, fluide, sans expressions vagues ni techniques (pas de "patient 1").
- Évite les répétitions et les phrases longues. Va droit au but.
- Ne donne jamais de titre au résumé.

Structure attendue :

Si un seul animal →
[Nom] ([Espèce / Race]) : [Symptômes et état clinique si présents]. [Motif de consultation clair et concis]. [Demande supplémentaire si présente].

Si deux animaux →
[Nom 1] ([Espèce / Race si présente]) : [Symptômes si présents]. [Etat clinique si présents]. [Motif pour animal 1]. 
[Nom 2] ([Espèce / Race si présente]) :  [Symptômes si présents]. [Etat clinique si présents]. [Motif pour animal 2]. [Demande supplémentaire si présente].

Si une portée →
[Espèce] ([Race si présente]) : [Motif de consultation clair et concis].',
  'Les éléments que tu dois analyser pour chaque réponse client sont les suivants : 

Animal : {{animal_name}} ({{animal_species}}){{#animal_breed}} - {{animal_breed}}{{/animal_breed}}
{{#second_animal_name}}Animal 2 : {{second_animal_name}} ({{second_animal_species}}){{#second_animal_breed}} - {{second_animal_breed}}{{/second_animal_breed}}{{/second_animal_name}}
{{#multiple_animals}}Nombre d''animaux : {{multiple_animals}}{{/multiple_animals}}

Motif du RDV : {{consultation_reason}}
{{#convenience_options}}Consultation de convenance : {{convenience_options}}{{/convenience_options}}
{{#second_animal_different_reason}}Motif différent pour le 2e animal : {{second_animal_different_reason}}{{/second_animal_different_reason}}
{{#second_animal_consultation_reason}}Motif pour le 2e animal : {{second_animal_consultation_reason}}{{/second_animal_consultation_reason}}
{{#second_animal_convenience_options}}Consultation convenance 2e animal : {{second_animal_convenience_options}}{{/second_animal_convenience_options}}

{{#selected_symptoms}}Symptômes observés (animal 1) : {{selected_symptoms}}{{/selected_symptoms}}
{{#custom_symptom}}Symptôme personnalisé : {{custom_symptom}}{{/custom_symptom}}
{{#second_animal_selected_symptoms}}Symptômes observés (animal 2) : {{second_animal_selected_symptoms}}{{/second_animal_selected_symptoms}}
{{#second_animal_custom_symptom}}Symptôme personnalisé animal 2 : {{second_animal_custom_symptom}}{{/second_animal_custom_symptom}}

{{#symptom_duration}}Depuis : {{symptom_duration}}{{/symptom_duration}}

Indications sur l''état clinique de l''animal qui présente des symptômes :
{{conditional_answers}}

{{#client_comment}}Demande supplémentaire : {{client_comment}}{{/client_comment}}',
  '{
    "animal_name": "string",
    "animal_species": "string", 
    "animal_breed": "string",
    "second_animal_name": "string",
    "second_animal_species": "string",
    "second_animal_breed": "string",
    "multiple_animals": "array",
    "consultation_reason": "string",
    "convenience_options": "array",
    "second_animal_different_reason": "boolean",
    "second_animal_consultation_reason": "string",
    "second_animal_convenience_options": "array",
    "selected_symptoms": "array",
    "custom_symptom": "string",
    "second_animal_selected_symptoms": "array",
    "second_animal_custom_symptom": "string",
    "symptom_duration": "string",
    "conditional_answers": "string",
    "client_comment": "string"
  }'
);

-- Créer une règle pour utiliser ce template pour les résumés de consultation
INSERT INTO prompt_rules (
  template_id,
  name,
  conditions,
  priority
) VALUES (
  (SELECT id FROM prompt_templates WHERE name = 'consultation_summary_template'),
  'Règle pour résumé de consultation',
  '{"type": "summary", "purpose": "consultation_summary"}',
  10
);
