
-- Créer la table pour stocker les templates de prompts
CREATE TABLE public.prompt_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  system_prompt TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Créer la table pour les règles de sélection des prompts
CREATE TABLE public.prompt_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES prompt_templates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  conditions JSONB NOT NULL,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Créer la table pour les logs de performance des prompts
CREATE TABLE public.prompt_performance_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES prompt_templates(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  prompt_used TEXT NOT NULL,
  response_quality_score DECIMAL CHECK (response_quality_score >= 0 AND response_quality_score <= 1),
  processing_time_ms INTEGER NOT NULL,
  tokens_used INTEGER,
  cost_cents INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_prompt_templates_active ON prompt_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_prompt_rules_template_id ON prompt_rules(template_id);
CREATE INDEX IF NOT EXISTS idx_prompt_rules_priority ON prompt_rules(priority DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_performance_logs_template_id ON prompt_performance_logs(template_id);
CREATE INDEX IF NOT EXISTS idx_prompt_performance_logs_created_at ON prompt_performance_logs(created_at);

-- Activer RLS
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_performance_logs ENABLE ROW LEVEL SECURITY;

-- Créer les politiques de sécurité (permettre tout pour l'instant)
CREATE POLICY "Allow all operations on prompt_templates" ON prompt_templates FOR ALL USING (true);
CREATE POLICY "Allow all operations on prompt_rules" ON prompt_rules FOR ALL USING (true);
CREATE POLICY "Allow all operations on prompt_performance_logs" ON prompt_performance_logs FOR ALL USING (true);

-- Fonction de mise à jour automatique du timestamp pour prompt_templates
CREATE TRIGGER set_timestamp_prompt_templates
  BEFORE UPDATE ON prompt_templates
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

-- Insérer un template par défaut
INSERT INTO prompt_templates (name, description, system_prompt, user_prompt_template, variables) VALUES (
  'default_veterinary_analysis',
  'Template par défaut pour l''analyse vétérinaire',
  'Tu es un assistant vétérinaire expert qui analyse les demandes de consultation. Tu dois évaluer l''urgence d''une consultation vétérinaire sur une échelle de 1 à 10. Réponds UNIQUEMENT en JSON avec cette structure exacte: {"urgency_score": number (1-10), "recommended_actions": ["action1", "action2"], "analysis_summary": "résumé de l''analyse", "confidence_score": number (0-1), "ai_insights": "insights détaillés sur le cas", "priority_level": "low|medium|high|critical"}',
  'Analyse cette demande de consultation vétérinaire:\n\nANIMAL(S):\n- Espèce: {{animal_species}}{{#second_animal_species}} et {{second_animal_species}}{{/second_animal_species}}\n- Nom: {{animal_name}}{{#second_animal_name}} et {{second_animal_name}}{{/second_animal_name}}\n- Âge: {{animal_age}}\n- Race: {{animal_breed}}\n- Poids: {{animal_weight}}\n\nMOTIF DE CONSULTATION:\n{{consultation_reason}}\n\nSYMPTÔMES OBSERVÉS:\n{{symptoms}}\n{{#custom_symptom}}Symptôme personnalisé: {{custom_symptom}}{{/custom_symptom}}\n\nDURÉE DES SYMPTÔMES:\n{{symptom_duration}}\n\nRÉPONSES AUX QUESTIONS:\n{{conditional_answers}}\n\nCOMMENTAIRE CLIENT:\n{{client_comment}}\n\nÉvalue l''urgence et fournis des recommandations appropriées.',
  '{"animal_species": "string", "second_animal_species": "string", "animal_name": "string", "second_animal_name": "string", "animal_age": "string", "animal_breed": "string", "animal_weight": "string", "consultation_reason": "string", "symptoms": "string", "custom_symptom": "string", "symptom_duration": "string", "conditional_answers": "string", "client_comment": "string"}'
);

-- Insérer une règle par défaut
INSERT INTO prompt_rules (template_id, name, conditions, priority) VALUES (
  (SELECT id FROM prompt_templates WHERE name = 'default_veterinary_analysis'),
  'Règle par défaut',
  '{"type": "default", "applies_to": "all"}',
  1
);
