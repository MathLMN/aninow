
import { useSymptomDetection } from "@/hooks/useSymptomDetection";

interface ValidationProps {
  bookingData: any;
  answers: {[key: string]: any};
}

export const useConditionalQuestionsValidation = ({ bookingData, answers }: ValidationProps) => {
  // Validation pour l'animal 1
  const animal1Detection = useSymptomDetection(bookingData?.selectedSymptoms || [], bookingData?.customSymptom || '');
  
  // Validation pour l'animal 2
  const animal2Detection = useSymptomDetection(bookingData?.secondAnimalSelectedSymptoms || [], bookingData?.secondAnimalCustomSymptom || '');

  const hasFirstAnimalSymptoms = (bookingData?.selectedSymptoms?.length > 0 || bookingData?.customSymptom?.trim() !== '') && 
    bookingData?.consultationReason === 'symptomes-anomalie';
  
  const hasSecondAnimalSymptoms = (bookingData?.secondAnimalSelectedSymptoms?.length > 0 || bookingData?.secondAnimalCustomSymptom?.trim() !== '') && 
    bookingData?.secondAnimalConsultationReason === 'symptomes-anomalie';

  // Fonction pour générer les questions requises pour un animal
  const getRequiredQuestions = (detection: any, prefix: string) => {
    let requiredQuestions: string[] = [];
    
    // Ajouter les questions générales si nécessaire
    if (detection.needsQuestions) {
      requiredQuestions.push(`${prefix}general_form`, `${prefix}eating`, `${prefix}drinking`);
    }

    // Ajouter les questions pour la perte d'appétit
    if (detection.hasLossOfAppetite) {
      requiredQuestions.push(`${prefix}general_form`, `${prefix}drinking`);
    }

    // Ajouter les questions pour la soif excessive
    if (detection.hasExcessiveThirst) {
      requiredQuestions.push(`${prefix}general_form`, `${prefix}eating`);
    }

    // Ajouter les questions pour "semble abattu"
    if (detection.hasListlessness) {
      requiredQuestions.push(`${prefix}eating`, `${prefix}drinking`);
    }
    
    // Ajouter la question sur la consistance des selles si nécessaire
    if (detection.hasBloodInStool) {
      requiredQuestions.push(`${prefix}stool_consistency`);
    }

    // Ajouter les questions spécifiques aux problèmes urinaires si nécessaire
    if (detection.hasUrinaryProblems) {
      requiredQuestions.push(`${prefix}urine_quantity`, `${prefix}urination_frequency`, `${prefix}blood_in_urine`, `${prefix}genital_licking`);
    }

    // Ajouter les questions spécifiques aux démangeaisons cutanées si nécessaire
    if (detection.hasSkinItching) {
      requiredQuestions.push(`${prefix}skin_itching_areas`, `${prefix}antiparasitic_treatment`, `${prefix}hair_loss`);
    }

    // Ajouter les questions spécifiques aux plaies si nécessaire
    if (detection.hasWound) {
      requiredQuestions.push(`${prefix}wound_location`, `${prefix}wound_oozing`, `${prefix}wound_depth`, `${prefix}wound_bleeding`);
    }

    // Ajouter les questions spécifiques aux problèmes d'oreille si nécessaire
    if (detection.hasEarProblems) {
      requiredQuestions.push(`${prefix}general_form`, `${prefix}ear_redness`, `${prefix}head_shaking`, `${prefix}pain_complaints`);
    }

    // Ajouter les questions pour l'écoulement des yeux si nécessaire
    if (detection.hasEyeDischarge) {
      requiredQuestions.push(`${prefix}general_form`, `${prefix}eating`, `${prefix}drinking`, `${prefix}eye_condition`);
    }

    // Ajouter les questions spécifiques à la boiterie si nécessaire
    if (detection.hasLameness) {
      requiredQuestions.push(`${prefix}general_form`, `${prefix}eating`, `${prefix}pain_complaints`, `${prefix}paw_position`);
    }

    // Ajouter les questions pour les difficultés respiratoires si nécessaire
    if (detection.hasBreathingDifficulties) {
      requiredQuestions.push(`${prefix}general_form`, `${prefix}eating`, `${prefix}drinking`, `${prefix}panting`);
    }

    // Ajouter les questions spécifiques aux grosseurs si nécessaire
    if (detection.hasLump) {
      requiredQuestions.push(`${prefix}general_form`, `${prefix}lump_body_area`, `${prefix}lump_size_evolution`);
    }

    // Ajouter les questions spécifiques à l'agressivité si nécessaire
    if (detection.hasAggression) {
      requiredQuestions.push(`${prefix}general_form`, `${prefix}pain_complaints`, `${prefix}bite_history`);
    }

    return requiredQuestions;
  };

  // Générer les questions requises pour chaque animal
  const animal1RequiredQuestions = hasFirstAnimalSymptoms ? getRequiredQuestions(animal1Detection, 'animal1_') : [];
  const animal2RequiredQuestions = hasSecondAnimalSymptoms ? getRequiredQuestions(animal2Detection, 'animal2_') : [];
  
  const allRequiredQuestions = [...animal1RequiredQuestions, ...animal2RequiredQuestions];

  const hasAnyConditions = hasFirstAnimalSymptoms || hasSecondAnimalSymptoms;
  const allQuestionsAnswered = hasAnyConditions ? allRequiredQuestions.every(key => answers[key]) : true;

  return {
    canProceed: allQuestionsAnswered,
    hasAnyConditions,
    needsQuestions: animal1Detection.needsQuestions || animal2Detection.needsQuestions,
    hasLossOfAppetite: animal1Detection.hasLossOfAppetite || animal2Detection.hasLossOfAppetite,
    hasExcessiveThirst: animal1Detection.hasExcessiveThirst || animal2Detection.hasExcessiveThirst,
    hasBloodInStool: animal1Detection.hasBloodInStool || animal2Detection.hasBloodInStool,
    hasUrinaryProblems: animal1Detection.hasUrinaryProblems || animal2Detection.hasUrinaryProblems,
    hasSkinItching: animal1Detection.hasSkinItching || animal2Detection.hasSkinItching,
    hasWound: animal1Detection.hasWound || animal2Detection.hasWound,
    hasEarProblems: animal1Detection.hasEarProblems || animal2Detection.hasEarProblems,
    hasEyeDischarge: animal1Detection.hasEyeDischarge || animal2Detection.hasEyeDischarge,
    hasLameness: animal1Detection.hasLameness || animal2Detection.hasLameness,
    hasBreathingDifficulties: animal1Detection.hasBreathingDifficulties || animal2Detection.hasBreathingDifficulties,
    hasLump: animal1Detection.hasLump || animal2Detection.hasLump,
    hasListlessness: animal1Detection.hasListlessness || animal2Detection.hasListlessness,
    hasAggression: animal1Detection.hasAggression || animal2Detection.hasAggression
  };
};
