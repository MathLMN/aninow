
import { useSymptomDetection } from "@/hooks/useSymptomDetection";

interface ValidationProps {
  bookingData: any;
  answers: {[key: string]: any};
}

export const useConditionalQuestionsValidation = ({ bookingData, answers }: ValidationProps) => {
  const {
    needsQuestions,
    hasBloodInStool,
    hasUrinaryProblems,
    hasSkinItching,
    hasWound,
    hasEarProblems,
    hasEyeDischarge
  } = useSymptomDetection(bookingData?.selectedSymptoms || [], bookingData?.customSymptom || '');

  let requiredQuestions: string[] = [];
  
  // Ajouter les questions générales si nécessaire
  if (needsQuestions) {
    requiredQuestions.push('general_form', 'eating', 'drinking');
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

  // Ajouter la question sur l'état de l'œil si nécessaire
  if (hasEyeDischarge) {
    requiredQuestions.push('eye_condition');
  }

  const hasAnyConditions = needsQuestions || hasBloodInStool || hasUrinaryProblems || hasSkinItching || hasWound || hasEarProblems || hasEyeDischarge;
  const allQuestionsAnswered = hasAnyConditions ? requiredQuestions.every(key => answers[key]) : true;

  return {
    canProceed: allQuestionsAnswered,
    hasAnyConditions,
    needsQuestions,
    hasBloodInStool,
    hasUrinaryProblems,
    hasSkinItching,
    hasWound,
    hasEarProblems,
    hasEyeDischarge
  };
};
