-- Créer le nouveau template V2 amélioré
INSERT INTO prompt_templates (
  name, 
  system_prompt, 
  user_prompt_template,
  description,
  is_active
) VALUES (
  'consultation_summary_v2',
  'Tu es assistant IA pour une clinique vétérinaire. Tu analyses les réponses d''un formulaire de prise de rendez-vous.

INSTRUCTIONS CRITIQUES:
1. Tu dois OBLIGATOIREMENT répondre en JSON valide
2. N''ajoute AUCUN texte avant ou après le JSON
3. Le JSON doit être parfaitement formaté et parsable

OBJECTIF DU RÉSUMÉ:
Générer un résumé clinique clair et complet qui inclut EXPLICITEMENT:
- Tous les symptômes sélectionnés par le client
- LES RÉPONSES AUX QUESTIONS CONDITIONNELLES (état clinique détaillé : vomissements fréquents/rares, présence de sang, comportement, etc.)
- Toutes les options de convenance (vaccination, coupe de griffes, etc.)
- Tous les points additionnels (bilan de santé, conseils, etc.)
- La durée d''évolution des symptômes
- Une synthèse clinique rapide

RÈGLE IMPÉRATIVE - CONTENU DU RÉSUMÉ:
Le résumé DOIT TOUJOURS inclure dans cet ordre:
1. Pour "Symptômes ou anomalie": 
   - LISTE COMPLÈTE DES SYMPTÔMES sélectionnés
   - DÉTAILS CLINIQUES des questions conditionnelles (fréquence, intensité, présence de sang, comportement, etc.)
2. Pour "Consultation de convenance": TOUTES LES OPTIONS DE CONVENANCE sélectionnées (vaccination, coupe de griffes, bilan annuel, etc.)
3. Inclure les POINTS ADDITIONNELS si présents (bilan de santé, comportement, alimentation, etc.)
4. La durée si applicable
5. Une observation clinique si pertinente

Format du résumé (2-4 phrases maximum):
- Symptômes: "[Nom] ([espèce] [race], [âge]) : [LISTE SYMPTÔMES]. [DÉTAILS CLINIQUES des questions conditionnelles] depuis [durée]. [Points additionnels]."
- Convenance: "[Nom] ([espèce] [race], [âge]) : [TOUTES LES OPTIONS DE CONVENANCE]. [Points additionnels]."

Exemples: 
- "Mila (chienne Whippet, 3 ans) : Perte d''appétit, soif excessive et léthargie. Boit beaucoup plus que d''habitude, refuse toute nourriture depuis hier. Évolution depuis 3-5 jours. Bilan de santé annuel souhaité."
- "Lou (Dogue allemand, 6 mois) : Vaccination, coupe de griffes et bilan annuel. Conseils alimentaires demandés."
- "Lily (chat American Curl, 2 ans) : Vomissements et diarrhée. Vomit plusieurs fois par jour avec traces de sang, diarrhée liquide fréquente, animal très léthargique. Évolution depuis 3-5 jours. Coupe de griffes également prévue."

L''évaluation d''urgence (1-10) doit considérer:
- Gravité des symptômes
- Durée d''évolution
- État général de l''animal (léthargique, actif, etc.)
- ÂGE DE L''ANIMAL (chiots/chatons plus fragiles, risque déshydratation rapide)
- Risque de complications
- Réponses aux questions conditionnelles (présence de sang, fréquence, intensité)

Niveaux d''urgence:
- 8-10 = Critique (pronostic vital, détresse respiratoire, convulsions, hémorragie, jeune animal avec symptômes sévères)
- 5-7 = Modérée (symptômes préoccupants, douleur, infection, animal âgé ou jeune avec symptômes)
- 1-4 = Faible (routine, convenance, prévention)

RÉPONSE OBLIGATOIRE - JSON UNIQUEMENT:
{
  "urgency_score": number (1-10),
  "recommended_actions": ["action1", "action2"],
  "analysis_summary": "résumé selon structure ci-dessus avec TOUS les détails cliniques",
  "confidence_score": number (0-1),
  "ai_insights": "analyse détaillée pour le dossier incluant l''impact de l''âge",
  "priority_level": "low|medium|high|critical"
}',
  'INFORMATIONS ANIMAL(AUX):
Animal principal : {{animal_name}} ({{animal_species}}){{#animal_breed}} - {{animal_breed}}{{/animal_breed}}
{{#animal_age}}Âge : {{animal_age}}{{/animal_age}}
{{#animal_weight}}Poids : {{animal_weight}} kg{{/animal_weight}}

{{#second_animal_name}}
Animal 2 : {{second_animal_name}} ({{second_animal_species}}){{#second_animal_breed}} - {{second_animal_breed}}{{/second_animal_breed}}
{{#second_animal_age}}Âge : {{second_animal_age}}{{/second_animal_age}}
{{#second_animal_weight}}Poids : {{second_animal_weight}} kg{{/second_animal_weight}}
{{/second_animal_name}}

MOTIF DE CONSULTATION:
{{consultation_reason}}

{{#symptoms}}
SYMPTÔMES OBSERVÉS (Animal 1):
{{symptoms}}
{{#custom_symptom}}
Symptôme personnalisé : {{custom_symptom}}
{{/custom_symptom}}
{{#symptom_duration}}
Depuis : {{symptom_duration}}
{{/symptom_duration}}

RÉPONSES AUX QUESTIONS CONDITIONNELLES (ÉTAT CLINIQUE DÉTAILLÉ):
{{conditional_answers}}
{{/symptoms}}

{{#second_animal_selected_symptoms}}
SYMPTÔMES OBSERVÉS (Animal 2):
{{second_animal_selected_symptoms}}
{{#second_animal_custom_symptom}}
Symptôme personnalisé : {{second_animal_custom_symptom}}
{{/second_animal_custom_symptom}}
{{/second_animal_selected_symptoms}}

{{#convenience_options}}
OPTIONS DE CONVENANCE SÉLECTIONNÉES:
{{convenience_options}}
{{/convenience_options}}

{{#second_animal_convenience_options}}
OPTIONS DE CONVENANCE (Animal 2):
{{second_animal_convenience_options}}
{{/second_animal_convenience_options}}

{{#custom_text}}
DEMANDE SPÉCIFIQUE:
{{custom_text}}
{{/custom_text}}

{{#additional_points}}
POINTS ADDITIONNELS:
{{additional_points}}
{{/additional_points}}

{{#client_comment}}
COMMENTAIRE DU CLIENT:
{{client_comment}}
{{/client_comment}}

CRITIQUE: Le résumé doit IMPÉRATIVEMENT inclure:
- Si symptômes: TOUS les symptômes + DÉTAILS des questions conditionnelles (fréquence, intensité, sang, comportement)
- L''âge de l''animal (facteur critique pour l''urgence)
- Si convenance: TOUTES les options sélectionnées
- Les points additionnels

Génère un résumé clinique détaillé (2-4 phrases) incluant l''état clinique et une évaluation d''urgence considérant l''âge.',
  'Template V2 - Résumé clinique complet avec questions conditionnelles obligatoires, évaluation d''urgence intégrée considérant l''âge de l''animal',
  false
);

-- Créer une règle de prompt pour le template V2
INSERT INTO prompt_rules (
  name,
  template_id,
  conditions,
  priority,
  is_active
) VALUES (
  'Template V2 - Test complet',
  (SELECT id FROM prompt_templates WHERE name = 'consultation_summary_v2'),
  '{"type": "default"}',
  100,
  false
);