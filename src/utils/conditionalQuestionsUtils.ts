import type { PhotoData } from "@/components/conditional-questions/MultiPhotoUpload";

// Définir la structure des métadonnées de section
export interface SectionMetadata {
  key: string;
  questionCount: number;
  requiredQuestionKeys: string[];
  optionalKeys?: string[];
}

// Fonction pour obtenir les métadonnées d'une section de symptôme
export const getSymptomSectionMetadata = (symptomType: string): SectionMetadata => {
  const metadata: Record<string, SectionMetadata> = {
    blood_in_stool: {
      key: 'blood_in_stool',
      questionCount: 1,
      requiredQuestionKeys: ['stool_consistency']
    },
    urinary_problems: {
      key: 'urinary_problems',
      questionCount: 4,
      requiredQuestionKeys: ['urine_quantity', 'urination_frequency', 'blood_in_urine', 'genital_licking']
    },
    wound: {
      key: 'wound',
      questionCount: 4,
      requiredQuestionKeys: ['wound_location', 'wound_oozing', 'wound_depth', 'wound_bleeding'],
      optionalKeys: ['wound_photo']
    },
    lump: {
      key: 'lump',
      questionCount: 2,
      requiredQuestionKeys: ['lump_body_area', 'lump_size_evolution'],
      optionalKeys: ['lump_photo']
    },
    ear_problems: {
      key: 'ear_problems',
      questionCount: 2,
      requiredQuestionKeys: ['ear_redness', 'head_shaking']
    },
    eye_discharge: {
      key: 'eye_discharge',
      questionCount: 1,
      requiredQuestionKeys: ['eye_condition']
    },
    breathing_difficulties: {
      key: 'breathing_difficulties',
      questionCount: 1,
      requiredQuestionKeys: ['panting']
    },
    skin_itching: {
      key: 'skin_itching',
      questionCount: 3,
      requiredQuestionKeys: ['skin_itching_areas', 'antiparasitic_treatment', 'hair_loss']
    },
    lameness: {
      key: 'lameness',
      questionCount: 2,
      requiredQuestionKeys: ['paw_position', 'recent_event'],
      optionalKeys: ['event_details']
    },
    aggression: {
      key: 'aggression',
      questionCount: 1,
      requiredQuestionKeys: ['bite_history']
    },
    other_symptom: {
      key: 'other_symptom',
      questionCount: 4,
      requiredQuestionKeys: ['general_form', 'eating', 'drinking', 'pain_complaints'],
      optionalKeys: ['other_photo']
    }
  };
  
  return metadata[symptomType] || { key: symptomType, questionCount: 0, requiredQuestionKeys: [] };
};

// Fonction pour compter les questions générales visibles
export const getSharedQuestionsCount = (
  needsGeneralForm: boolean,
  needsEating: boolean,
  needsDrinking: boolean,
  needsPainComplaints: boolean
): number => {
  let count = 0;
  if (needsGeneralForm) count++;
  if (needsEating) count++;
  if (needsDrinking) count++;
  if (needsPainComplaints) count++;
  return count;
};

// Fonction pour obtenir les clés des questions générales requises
export const getSharedQuestionKeys = (
  needsGeneralForm: boolean,
  needsEating: boolean,
  needsDrinking: boolean,
  needsPainComplaints: boolean
): string[] => {
  const keys: string[] = [];
  if (needsGeneralForm) keys.push('general_form');
  if (needsEating) keys.push('eating');
  if (needsDrinking) keys.push('drinking');
  if (needsPainComplaints) keys.push('pain_complaints');
  return keys;
};

// Vérifier si une section est complétée
export const isSectionComplete = (
  answers: {[key: string]: string | File | PhotoData},
  requiredKeys: string[],
  keyPrefix: string = ''
): boolean => {
  return requiredKeys.every(key => {
    const answerKey = keyPrefix + key;
    const answer = answers[answerKey];
    return answer !== undefined && answer !== null && answer !== '';
  });
};
