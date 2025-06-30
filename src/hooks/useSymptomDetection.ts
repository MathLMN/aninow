
export const useSymptomDetection = (selectedSymptoms: string[], customSymptom: string) => {
  // Vérifier si des symptômes nécessitent les questions générales
  const symptomsRequiringQuestions = ['vomissements', 'diarrhée', 'toux', 'cris/gémissements'];
  const needsQuestions = selectedSymptoms.some(symptom => 
    symptomsRequiringQuestions.includes(symptom.toLowerCase())
  ) || symptomsRequiringQuestions.some(symptom => 
    customSymptom.toLowerCase().includes(symptom)
  );

  // Vérifier si "perte d'appétit" est sélectionné
  const hasLossOfAppetite = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('perte-appetit') || symptom.toLowerCase().includes('perte d\'appétit')
  ) || customSymptom.toLowerCase().includes('perte d\'appétit');

  // Vérifier si "soif excessive" est sélectionné
  const hasExcessiveThirst = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('soif-excessive') || symptom.toLowerCase().includes('soif excessive')
  ) || customSymptom.toLowerCase().includes('soif excessive');

  // Vérifier si "sang dans les selles" est sélectionné
  const hasBloodInStool = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('sang-selles') || symptom.toLowerCase().includes('sang dans les selles')
  ) || customSymptom.toLowerCase().includes('sang dans les selles');

  // Vérifier si "problèmes urinaires" est sélectionné
  const hasUrinaryProblems = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('problemes-urinaires') || symptom.toLowerCase().includes('problèmes urinaires')
  ) || customSymptom.toLowerCase().includes('problèmes urinaires');

  // Vérifier si "démangeaisons cutanées" est sélectionné
  const hasSkinItching = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('demangeaisons-cutanees') || symptom.toLowerCase().includes('démangeaisons cutanées')
  ) || customSymptom.toLowerCase().includes('démangeaisons cutanées');

  // Vérifier si "plaie" est sélectionné
  const hasWound = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('plaie')
  ) || customSymptom.toLowerCase().includes('plaie');

  // Vérifier si "démangeaisons de l'oreille" ou "otite" est sélectionné
  const hasEarProblems = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('demangeaisons-oreille') || 
    symptom.toLowerCase().includes('démangeaisons de l\'oreille') ||
    symptom.toLowerCase().includes('otite')
  ) || customSymptom.toLowerCase().includes('démangeaisons de l\'oreille') || 
       customSymptom.toLowerCase().includes('otite');

  // Vérifier si "écoulement des yeux" est sélectionné
  const hasEyeDischarge = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('ecoulements-yeux') || 
    symptom.toLowerCase().includes('écoulement des yeux') ||
    symptom.toLowerCase().includes('ecoulement des yeux')
  ) || customSymptom.toLowerCase().includes('écoulement des yeux') ||
       customSymptom.toLowerCase().includes('ecoulement des yeux');

  // Vérifier si "boiterie" est sélectionné
  const hasLameness = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('boiterie')
  ) || customSymptom.toLowerCase().includes('boiterie');

  // Vérifier si "difficultés respiratoires" est sélectionné
  const hasBreathingDifficulties = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('difficultes-respiratoires') || 
    symptom.toLowerCase().includes('difficultés respiratoires')
  ) || customSymptom.toLowerCase().includes('difficultés respiratoires');

  return {
    needsQuestions,
    hasLossOfAppetite,
    hasExcessiveThirst,
    hasBloodInStool,
    hasUrinaryProblems,
    hasSkinItching,
    hasWound,
    hasEarProblems,
    hasEyeDischarge,
    hasLameness,
    hasBreathingDifficulties
  };
};
