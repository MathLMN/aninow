-- Ajouter une colonne JSONB pour stocker les options de consultation de convenance personnalisées
ALTER TABLE public.clinic_settings 
ADD COLUMN IF NOT EXISTS convenience_options_config jsonb DEFAULT '[
  {"value": "bilan-annuel-vaccination", "label": "Bilan annuel / vaccination", "color": "bg-red-100 text-red-600 border-red-200", "isActive": true},
  {"value": "coupe-griffes", "label": "Coupe de griffes", "color": "bg-orange-100 text-orange-600 border-orange-200", "isActive": true},
  {"value": "controle", "label": "Contrôle", "color": "bg-yellow-100 text-yellow-600 border-yellow-200", "isActive": true},
  {"value": "bilan-senior", "label": "Bilan sénior", "color": "bg-green-100 text-green-600 border-green-200", "isActive": true},
  {"value": "premiere-consultation", "label": "1ère consultation chiot/chaton", "color": "bg-blue-100 text-blue-600 border-blue-200", "isActive": true},
  {"value": "castration-sterilisation", "label": "Castration/Stérilisation (pré-opératoire)", "color": "bg-purple-100 text-purple-600 border-purple-200", "isActive": true},
  {"value": "detartrage-extractions", "label": "Détartrage/Extractions dentaires (pré-opératoire)", "color": "bg-pink-100 text-pink-600 border-pink-200", "isActive": true},
  {"value": "autre", "label": "Autre (Précisez)", "color": "bg-gray-100 text-gray-600 border-gray-200", "isActive": true, "isOther": true}
]'::jsonb;

COMMENT ON COLUMN public.clinic_settings.convenience_options_config IS 
'Configuration personnalisée des options de consultation de convenance pour le booking en ligne. Chaque option contient: value (identifiant unique), label (texte affiché), color (classes Tailwind), isActive (actif/inactif), isOther (indique option Autre avec champ texte libre)';