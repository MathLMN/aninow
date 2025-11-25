-- Ajouter des messages explicatifs par défaut pour certaines options de consultation de convenance
UPDATE clinic_settings
SET convenience_options_config = jsonb_set(
  convenience_options_config,
  '{5}',
  jsonb_build_object(
    'value', 'castration-sterilisation',
    'label', 'Castration/Stérilisation (pré-opératoire)',
    'color', 'bg-purple-100 text-purple-600 border-purple-200',
    'isActive', true,
    'helpMessage', 'Il s''agit du rendez-vous de préparation. La chirurgie sera programmée lors de ce rendez-vous avec le vétérinaire.'
  )
)
WHERE convenience_options_config IS NOT NULL;

UPDATE clinic_settings
SET convenience_options_config = jsonb_set(
  convenience_options_config,
  '{6}',
  jsonb_build_object(
    'value', 'detartrage-extractions',
    'label', 'Détartrage/Extractions dentaires (pré-opératoire)',
    'color', 'bg-pink-100 text-pink-600 border-pink-200',
    'isActive', true,
    'helpMessage', 'Il s''agit du rendez-vous de préparation. Le détartrage ou les extractions seront programmés lors de ce rendez-vous avec le vétérinaire.'
  )
)
WHERE convenience_options_config IS NOT NULL;