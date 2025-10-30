-- Désactiver les anciens templates
UPDATE prompt_templates 
SET is_active = false 
WHERE name IN ('consultation_summary_template', 'default_veterinary_analysis');

-- Activer le nouveau template V2
UPDATE prompt_templates 
SET is_active = true 
WHERE name = 'consultation_summary_v2';

-- Activer la règle associée au template V2
UPDATE prompt_rules 
SET is_active = true 
WHERE name = 'Template V2 - Test complet';