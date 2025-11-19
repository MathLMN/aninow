import { useSymptomDetection } from "@/hooks/useSymptomDetection";

/**
 * Filtre les réponses conditionnelles pour ne garder que celles correspondant aux symptômes actuellement sélectionnés
 */
export const filterConditionalAnswers = (
  conditionalAnswers: { [key: string]: any } | null | undefined,
  selectedSymptoms: string[],
  customSymptom: string,
  prefix: string = 'animal1_'
): { [key: string]: any } => {
  if (!conditionalAnswers || Object.keys(conditionalAnswers).length === 0) {
    return {};
  }

  // Détecter les questions nécessaires pour les symptômes actuels
  const detection = {
    needsQuestions: false,
    hasLossOfAppetite: false,
    hasExcessiveThirst: false,
    hasListlessness: false,
    hasBloodInStool: false,
    hasUrinaryProblems: false,
    hasSkinItching: false,
    hasWound: false,
    hasEarProblems: false,
    hasEyeDischarge: false,
    hasLameness: false,
    hasBreathingDifficulties: false,
    hasLump: false,
    hasAggression: false
  };

  // Détecter d'abord les symptômes à partir des réponses présentes (plus fiable)
  const hasWoundAnswers = Object.keys(conditionalAnswers).some(key => 
    key.startsWith(prefix) && key.includes('wound_') && !key.includes('photo')
  );
  const hasLumpAnswers = Object.keys(conditionalAnswers).some(key => 
    key.startsWith(prefix) && key.includes('lump_') && !key.includes('photo')
  );
  const hasOtherSymptomAnswers = Object.keys(conditionalAnswers).some(key => 
    key.startsWith(prefix) && key.includes('other_symptom_') && !key.includes('photo')
  );

  // Symptômes nécessitant les questions générales
  const symptomsRequiringQuestions = ['vomissements', 'diarrhée', 'diarrhee', 'toux', 'cris-gemissements', 'sang-selles'];
  detection.needsQuestions = selectedSymptoms.some(symptom => 
    symptomsRequiringQuestions.includes(symptom.toLowerCase())
  ) || symptomsRequiringQuestions.some(symptom => 
    customSymptom.toLowerCase().includes(symptom.replace('-', '/'))
  );

  // Vérifier chaque type de symptôme (combiner mots-clés + réponses présentes)
  detection.hasLossOfAppetite = selectedSymptoms.some(s => s.toLowerCase().includes('perte-appetit')) || 
    customSymptom.toLowerCase().includes('perte d\'appétit');
  
  detection.hasExcessiveThirst = selectedSymptoms.some(s => s.toLowerCase().includes('soif-excessive')) || 
    customSymptom.toLowerCase().includes('soif excessive');
  
  detection.hasListlessness = selectedSymptoms.some(s => s.toLowerCase().includes('semble-abattu')) || 
    customSymptom.toLowerCase().includes('semble abattu');
  
  detection.hasBloodInStool = selectedSymptoms.some(s => s.toLowerCase().includes('sang-selles')) || 
    customSymptom.toLowerCase().includes('sang dans les selles');
  
  detection.hasUrinaryProblems = selectedSymptoms.some(s => s.toLowerCase().includes('problemes-urinaires')) || 
    customSymptom.toLowerCase().includes('problèmes urinaires');
  
  detection.hasSkinItching = selectedSymptoms.some(s => s.toLowerCase().includes('demangeaisons-cutanees')) || 
    customSymptom.toLowerCase().includes('démangeaisons cutanées');
  
  // Pour les plaies, grosseurs et autres : combiner mots-clés + réponses présentes
  detection.hasWound = hasWoundAnswers || 
    selectedSymptoms.some(s => s.toLowerCase().includes('plaie')) || 
    customSymptom.toLowerCase().includes('plaie');
  
  detection.hasEarProblems = selectedSymptoms.some(s => 
    s.toLowerCase().includes('demangeaisons-oreille') || s.toLowerCase().includes('otite')
  ) || customSymptom.toLowerCase().includes('démangeaisons de l\'oreille') || 
       customSymptom.toLowerCase().includes('otite');
  
  detection.hasEyeDischarge = selectedSymptoms.some(s => s.toLowerCase().includes('ecoulements-yeux')) || 
    customSymptom.toLowerCase().includes('écoulement des yeux');
  
  detection.hasLameness = selectedSymptoms.some(s => s.toLowerCase().includes('boiterie')) || 
    customSymptom.toLowerCase().includes('boiterie');
  
  detection.hasBreathingDifficulties = selectedSymptoms.some(s => s.toLowerCase().includes('difficultes-respiratoires')) || 
    customSymptom.toLowerCase().includes('difficultés respiratoires');
  
  detection.hasLump = hasLumpAnswers || 
    selectedSymptoms.some(s => s.toLowerCase().includes('grosseur')) || 
    customSymptom.toLowerCase().includes('grosseur');
  
  detection.hasAggression = selectedSymptoms.some(s => s.toLowerCase().includes('agressif')) || 
    customSymptom.toLowerCase().includes('agressif');
  
  // Vérifier si "autre" est sélectionné ou si des réponses "other_symptom" sont présentes
  const hasOther = hasOtherSymptomAnswers || 
    (selectedSymptoms.includes('autre') && 
    !detection.needsQuestions && !detection.hasLossOfAppetite && !detection.hasExcessiveThirst && 
    !detection.hasBloodInStool && !detection.hasUrinaryProblems && !detection.hasSkinItching && 
    !detection.hasWound && !detection.hasEarProblems && !detection.hasEyeDischarge && 
    !detection.hasLameness && !detection.hasBreathingDifficulties && !detection.hasLump && 
    !detection.hasListlessness && !detection.hasAggression);

  console.log('📸 filterConditionalAnswers detection:', {
    prefix,
    hasWoundAnswers,
    hasLumpAnswers,
    hasOtherSymptomAnswers,
    detection,
    hasOther
  });

  // Construire la liste des clés de questions autorisées
  const allowedKeys: Set<string> = new Set();

  // Questions générales
  if (detection.needsQuestions) {
    allowedKeys.add(`${prefix}general_form`);
    allowedKeys.add(`${prefix}eating`);
    allowedKeys.add(`${prefix}drinking`);
  }

  if (detection.hasLossOfAppetite) {
    allowedKeys.add(`${prefix}general_form`);
    allowedKeys.add(`${prefix}drinking`);
  }

  if (detection.hasExcessiveThirst) {
    allowedKeys.add(`${prefix}general_form`);
    allowedKeys.add(`${prefix}eating`);
  }

  if (detection.hasListlessness) {
    allowedKeys.add(`${prefix}eating`);
    allowedKeys.add(`${prefix}drinking`);
  }

  if (detection.hasBloodInStool) {
    allowedKeys.add(`${prefix}stool_consistency`);
  }

  if (detection.hasUrinaryProblems) {
    allowedKeys.add(`${prefix}urine_quantity`);
    allowedKeys.add(`${prefix}urination_frequency`);
    allowedKeys.add(`${prefix}blood_in_urine`);
    allowedKeys.add(`${prefix}genital_licking`);
  }

  if (detection.hasSkinItching) {
    allowedKeys.add(`${prefix}skin_itching_areas`);
    allowedKeys.add(`${prefix}antiparasitic_treatment`);
    allowedKeys.add(`${prefix}hair_loss`);
  }

  if (detection.hasWound) {
    allowedKeys.add(`${prefix}wound_location`);
    allowedKeys.add(`${prefix}wound_oozing`);
    allowedKeys.add(`${prefix}wound_depth`);
    allowedKeys.add(`${prefix}wound_bleeding`);
    allowedKeys.add(`${prefix}wound_photo_1`);
    allowedKeys.add(`${prefix}wound_photo_2`);
    allowedKeys.add(`${prefix}wound_photo_3`);
  }

  if (detection.hasEarProblems) {
    allowedKeys.add(`${prefix}general_form`);
    allowedKeys.add(`${prefix}ear_redness`);
    allowedKeys.add(`${prefix}head_shaking`);
    allowedKeys.add(`${prefix}pain_complaints`);
  }

  if (detection.hasEyeDischarge) {
    allowedKeys.add(`${prefix}general_form`);
    allowedKeys.add(`${prefix}eating`);
    allowedKeys.add(`${prefix}drinking`);
    allowedKeys.add(`${prefix}eye_condition`);
  }

  if (detection.hasLameness) {
    allowedKeys.add(`${prefix}general_form`);
    allowedKeys.add(`${prefix}eating`);
    allowedKeys.add(`${prefix}pain_complaints`);
    allowedKeys.add(`${prefix}paw_position`);
  }

  if (detection.hasBreathingDifficulties) {
    allowedKeys.add(`${prefix}general_form`);
    allowedKeys.add(`${prefix}eating`);
    allowedKeys.add(`${prefix}drinking`);
    allowedKeys.add(`${prefix}panting`);
  }

  if (detection.hasLump) {
    allowedKeys.add(`${prefix}general_form`);
    allowedKeys.add(`${prefix}lump_body_area`);
    allowedKeys.add(`${prefix}lump_size_evolution`);
    allowedKeys.add(`${prefix}lump_photo_1`);
    allowedKeys.add(`${prefix}lump_photo_2`);
    allowedKeys.add(`${prefix}lump_photo_3`);
  }

  if (detection.hasAggression) {
    allowedKeys.add(`${prefix}general_form`);
    allowedKeys.add(`${prefix}pain_complaints`);
    allowedKeys.add(`${prefix}bite_history`);
  }

  // Questions pour le cas "Autre symptôme"
  if (hasOther) {
    allowedKeys.add(`${prefix}general_form`);
    allowedKeys.add(`${prefix}eating`);
    allowedKeys.add(`${prefix}drinking`);
    allowedKeys.add(`${prefix}pain_complaints`);
    allowedKeys.add(`${prefix}other_symptom_photo_1`);
    allowedKeys.add(`${prefix}other_symptom_photo_2`);
    allowedKeys.add(`${prefix}other_symptom_photo_3`);
  }

  // Filtrer les réponses pour ne garder que celles autorisées
  const filteredAnswers: { [key: string]: any } = {};
  
  for (const [key, value] of Object.entries(conditionalAnswers)) {
    if (allowedKeys.has(key)) {
      filteredAnswers[key] = value;
    }
  }

  console.log('Filtered conditional answers:', {
    original: conditionalAnswers,
    filtered: filteredAnswers,
    allowedKeys: Array.from(allowedKeys)
  });

  return filteredAnswers;
};

/**
 * Filtre toutes les réponses conditionnelles pour les deux animaux
 */
export const filterAllConditionalAnswers = (
  conditionalAnswers: { [key: string]: any } | null | undefined,
  bookingData: any
): { [key: string]: any } => {
  if (!conditionalAnswers || Object.keys(conditionalAnswers).length === 0) {
    return {};
  }

  let filteredAnswers: { [key: string]: any } = {};

  // Filtrer les réponses pour l'animal 1
  const animal1Filtered = filterConditionalAnswers(
    conditionalAnswers,
    bookingData.selectedSymptoms || [],
    bookingData.customSymptom || '',
    'animal1_'
  );

  // Fusionner les réponses de l'animal 1
  filteredAnswers = { ...filteredAnswers, ...animal1Filtered };

  // Si 2 animaux avec motifs différents, filtrer aussi pour l'animal 2
  const hasTwoAnimals = bookingData.multipleAnimals?.includes('2-animaux');
  const hasDifferentReason = bookingData.secondAnimalDifferentReason === true;

  if (hasTwoAnimals && hasDifferentReason) {
    const animal2Filtered = filterConditionalAnswers(
      conditionalAnswers,
      bookingData.secondAnimalSelectedSymptoms || [],
      bookingData.secondAnimalCustomSymptom || '',
      'animal2_'
    );

    // Fusionner les réponses de l'animal 2
    filteredAnswers = { ...filteredAnswers, ...animal2Filtered };
  }

  return filteredAnswers;
};
