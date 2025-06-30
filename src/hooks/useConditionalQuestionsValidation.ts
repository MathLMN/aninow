import { useSymptomDetection } from "@/hooks/useSymptomDetection";

interface ValidationProps {
  bookingData: any;
  answers: {[key: string]: any};
}

export const useConditionalQuestionsValidation = ({ bookingData, answers }: ValidationProps) => {
  const {
    needsQuestions,
    hasLossOfAppetite,
    hasBloodInStool,
    hasUrinaryProblems,
    hasSkinItching,
    hasWound,
    hasEarProblems,
    hasEyeDischarge,
    hasLameness,
    hasBreathingDifficulties
  } = useSymptomDetection(bookingData?.selectedSymptoms || [], bookingData?.customSymptom || '');

  let requiredQuestions: string[] = [];
  
  // Ajouter les questions générales si nécessaire
  if (needsQuestions) {
    requiredQuestions.push('general_form', 'eating', 'drinking');
  }

  // Ajouter les questions pour la perte d'appétit (sans la question eating)
  if (hasLossOfAppetite) {
    requiredQuestions.push('general_form', 'drinking');
  }
  
  // Ajouter la question sur la consistance des selles si nécessaire
  if (hasBloodInStool) {
    requiredQuestions.push('stool_consistency');
  }

  // Ajouter les questions spécifiques aux problèmes urinaires si nécessaire
  if (hasUrinaryProblems) {
    requiredQuestions.push('urine_quantity', 'urination_frequency', 'blood_in_urine', 'genital_licking');
  }

  // Ajouter les questions spécifiques aux démangeaisons cutanées si nécessaire
  if (hasSkinItching) {
    requiredQuestions.push('skin_itching_areas', 'antiparasitic_treatment', 'hair_loss');
  }

  // Ajouter les questions spécifiques aux plaies si nécessaire
  if (hasWound) {
    requiredQuestions.push('wound_location', 'wound_oozing', 'wound_depth', 'wound_bleeding');
  }

  // Ajouter les questions spécifiques aux problèmes d'oreille si nécessaire
  if (hasEarProblems) {
    requiredQuestions.push('general_form', 'ear_redness', 'head_shaking', 'pain_complaints');
  }

  // Ajouter les questions pour l'écoulement des yeux si nécessaire
  if (hasEyeDischarge) {
    requiredQuestions.push('general_form', 'eating', 'drinking', 'eye_condition');
  }

  // Ajouter les questions spécifiques à la boiterie si nécessaire (sans la question "drinking")
  if (hasLameness) {
    requiredQuestions.push('general_form', 'eating', 'pain_complaints', 'paw_position');
  }

  // Ajouter les questions pour les difficultés respiratoires si nécessaire
  if (hasBreathingDifficulties) {
    requiredQuestions.push('general_form', 'eating', 'drinking', 'panting');
  }

  const hasAnyConditions = needsQuestions || hasLossOfAppetite || hasBloodInStool || hasUrinaryProblems || hasSkinItching || hasWound || hasEarProblems || hasEyeDischarge || hasLameness || hasBreathingDifficulties;
  const allQuestionsAnswered = hasAnyConditions ? requiredQuestions.every(key => answers[key]) : true;

  return {
    canProceed: allQuestionsAnswered,
    hasAnyConditions,
    needsQuestions,
    hasLossOfAppetite,
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
