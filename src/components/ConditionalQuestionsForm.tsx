
import { useState, useEffect, useMemo } from "react";
import { Check } from "lucide-react";
import { useSymptomDetection } from "@/hooks/useSymptomDetection";
import SharedQuestionsSection from "@/components/conditional-questions/SharedQuestionsSection";
import BloodInStoolSection from "@/components/conditional-questions/BloodInStoolSection";
import UrinaryProblemsSection from "@/components/conditional-questions/UrinaryProblemsSection";
import SkinItchingSection from "@/components/conditional-questions/SkinItchingSection";
import WoundSection from "@/components/conditional-questions/WoundSection";
import EarProblemsSection from "@/components/conditional-questions/EarProblemsSection";
import EyeDischargeSection from "@/components/conditional-questions/EyeDischargeSection";
import LamenessSection from "@/components/conditional-questions/LamenessSection";
import BreathingDifficultiesSection from "@/components/conditional-questions/BreathingDifficultiesSection";
import LumpSection from "@/components/conditional-questions/LumpSection";
import AggressiveSection from "@/components/conditional-questions/AggressiveSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getSymptomSectionMetadata,
  getSharedQuestionsCount,
  getSharedQuestionKeys,
  isSectionComplete,
  type SectionMetadata
} from "@/utils/conditionalQuestionsUtils";

interface ConditionalQuestionsFormProps {
  selectedSymptoms: string[];
  customSymptom: string;
  onAnswersChange: (answers: any) => void;
  animalPrefix?: string;
  initialAnswers?: {[key: string]: string | File};
}

// Composant pour le trigger de l'accordéon avec validation visuelle
interface AccordionTriggerContentProps {
  label: string;
  questionCount: number;
  isComplete: boolean;
  color: string;
}

const AccordionTriggerContent = ({ label, questionCount, isComplete, color }: AccordionTriggerContentProps) => (
  <div className="flex items-center justify-between w-full">
    <div className="flex items-center gap-3">
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <span className={`text-base sm:text-lg font-semibold ${isComplete ? 'text-muted-foreground' : 'text-foreground'}`}>
        {label}
      </span>
      <span className="text-xs sm:text-sm text-muted-foreground font-normal">
        ({questionCount} question{questionCount > 1 ? 's' : ''})
      </span>
    </div>
    {isComplete && (
      <Check className="h-5 w-5 text-green-600 mr-2" />
    )}
  </div>
);

interface ActiveSymptomSection {
  value: string;
  label: string;
  metadata: SectionMetadata;
  isComplete: boolean;
  component: JSX.Element;
}

const ConditionalQuestionsForm = ({ 
  selectedSymptoms, 
  customSymptom, 
  onAnswersChange, 
  animalPrefix = '',
  initialAnswers = {}
}: ConditionalQuestionsFormProps) => {
  const [answers, setAnswers] = useState<{[key: string]: string | File}>({});

  const {
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
    hasBreathingDifficulties,
    hasLump,
    hasListlessness,
    hasAggression
  } = useSymptomDetection(selectedSymptoms, customSymptom);

  // Initialiser les réponses avec les données sauvegardées
  useEffect(() => {
    if (initialAnswers && Object.keys(initialAnswers).length > 0) {
      console.log('ConditionalQuestionsForm: Loading initial answers:', initialAnswers);
      
      // Filtrer les réponses qui correspondent au préfixe de cet animal
      const relevantAnswers: {[key: string]: string | File} = {};
      Object.entries(initialAnswers).forEach(([key, value]) => {
        if (key.startsWith(animalPrefix)) {
          relevantAnswers[key] = value;
        }
      });
      
      console.log('ConditionalQuestionsForm: Relevant answers for prefix', animalPrefix, ':', relevantAnswers);
      setAnswers(relevantAnswers);
    }
  }, [initialAnswers, animalPrefix]);

  if (!needsQuestions && !hasLossOfAppetite && !hasExcessiveThirst && !hasBloodInStool && !hasUrinaryProblems && !hasSkinItching && !hasWound && !hasEarProblems && !hasEyeDischarge && !hasLameness && !hasBreathingDifficulties && !hasLump && !hasListlessness && !hasAggression) {
    return null;
  }

  const handleAnswerChange = (questionKey: string, value: string) => {
    const prefixedKey = animalPrefix + questionKey;
    const newAnswers = { ...answers, [prefixedKey]: value };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
    console.log('ConditionalQuestionsForm: Answer changed:', prefixedKey, '=', value);
  };

  const handleFileChange = (questionKey: string, file: File | null) => {
    const prefixedKey = animalPrefix + questionKey;
    const newAnswers = { ...answers, [prefixedKey]: file };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
    console.log('ConditionalQuestionsForm: File changed:', prefixedKey, '=', file?.name);
  };

  // Déterminer quelles questions partagées sont nécessaires
  const needsGeneralForm = needsQuestions || hasLossOfAppetite || hasExcessiveThirst || 
    hasEyeDischarge || hasLameness || hasBreathingDifficulties || hasLump || hasAggression || hasEarProblems;
  
  const needsEating = needsQuestions || hasLossOfAppetite || hasListlessness || hasExcessiveThirst;
  
  const needsDrinking = needsQuestions || hasLossOfAppetite || hasListlessness || 
    hasEyeDischarge || hasBreathingDifficulties;
  
  const needsPainComplaints = hasLameness || hasEarProblems || hasAggression;

  // Déterminer si on doit afficher les questions générales
  const shouldShowSharedQuestions = needsGeneralForm || needsEating || needsDrinking || needsPainComplaints;

  // Calculer le nombre de questions partagées
  const sharedQuestionsCount = useMemo(
    () => getSharedQuestionsCount(needsGeneralForm, needsEating, needsDrinking, needsPainComplaints),
    [needsGeneralForm, needsEating, needsDrinking, needsPainComplaints]
  );

  const sharedQuestionKeys = useMemo(
    () => getSharedQuestionKeys(needsGeneralForm, needsEating, needsDrinking, needsPainComplaints),
    [needsGeneralForm, needsEating, needsDrinking, needsPainComplaints]
  );

  // Vérifier si les questions partagées sont complètes
  const isSharedComplete = useMemo(
    () => isSectionComplete(answers, sharedQuestionKeys, animalPrefix),
    [answers, sharedQuestionKeys, animalPrefix]
  );

  // Mapper les symptômes actifs avec leurs métadonnées
  const activeSymptomSections: ActiveSymptomSection[] = useMemo(() => {
    const sections: ActiveSymptomSection[] = [];
    
    if (hasBloodInStool) {
      const metadata = getSymptomSectionMetadata('blood_in_stool');
      sections.push({
        value: 'bloodInStool',
        label: 'Sang dans les selles',
        metadata,
        isComplete: isSectionComplete(answers, metadata.requiredQuestionKeys, animalPrefix),
        component: (
          <BloodInStoolSection
            answers={answers}
            onAnswerChange={handleAnswerChange}
            keyPrefix={animalPrefix}
          />
        )
      });
    }
    
    if (hasUrinaryProblems) {
      const metadata = getSymptomSectionMetadata('urinary_problems');
      sections.push({
        value: 'urinaryProblems',
        label: 'Problèmes urinaires',
        metadata,
        isComplete: isSectionComplete(answers, metadata.requiredQuestionKeys, animalPrefix),
        component: (
          <UrinaryProblemsSection
            answers={answers}
            onAnswerChange={handleAnswerChange}
            keyPrefix={animalPrefix}
          />
        )
      });
    }
    
    if (hasSkinItching) {
      const metadata = getSymptomSectionMetadata('skin_itching');
      sections.push({
        value: 'skinItching',
        label: 'Démangeaisons / Grattage',
        metadata,
        isComplete: isSectionComplete(answers, metadata.requiredQuestionKeys, animalPrefix),
        component: (
          <SkinItchingSection
            answers={answers}
            onAnswerChange={handleAnswerChange}
            keyPrefix={animalPrefix}
          />
        )
      });
    }
    
    if (hasWound) {
      const metadata = getSymptomSectionMetadata('wound');
      sections.push({
        value: 'wound',
        label: 'Plaie',
        metadata,
        isComplete: isSectionComplete(answers, metadata.requiredQuestionKeys, animalPrefix),
        component: (
          <WoundSection
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onFileChange={handleFileChange}
            keyPrefix={animalPrefix}
          />
        )
      });
    }
    
    if (hasEarProblems) {
      const metadata = getSymptomSectionMetadata('ear_problems');
      sections.push({
        value: 'earProblems',
        label: 'Otite / Problèmes d\'oreilles',
        metadata,
        isComplete: isSectionComplete(answers, metadata.requiredQuestionKeys, animalPrefix),
        component: (
          <EarProblemsSection
            answers={answers}
            onAnswerChange={handleAnswerChange}
            keyPrefix={animalPrefix}
          />
        )
      });
    }
    
    if (hasEyeDischarge) {
      const metadata = getSymptomSectionMetadata('eye_discharge');
      sections.push({
        value: 'eyeDischarge',
        label: 'Écoulements oculaires',
        metadata,
        isComplete: isSectionComplete(answers, metadata.requiredQuestionKeys, animalPrefix),
        component: (
          <EyeDischargeSection
            answers={answers}
            onAnswerChange={handleAnswerChange}
            keyPrefix={animalPrefix}
          />
        )
      });
    }
    
    if (hasLameness) {
      const metadata = getSymptomSectionMetadata('lameness');
      sections.push({
        value: 'lameness',
        label: 'Boiterie',
        metadata,
        isComplete: isSectionComplete(answers, metadata.requiredQuestionKeys, animalPrefix),
        component: (
          <LamenessSection
            answers={answers}
            onAnswerChange={handleAnswerChange}
            keyPrefix={animalPrefix}
          />
        )
      });
    }
    
    if (hasBreathingDifficulties) {
      const metadata = getSymptomSectionMetadata('breathing_difficulties');
      sections.push({
        value: 'breathingDifficulties',
        label: 'Difficultés respiratoires',
        metadata,
        isComplete: isSectionComplete(answers, metadata.requiredQuestionKeys, animalPrefix),
        component: (
          <BreathingDifficultiesSection
            answers={answers}
            onAnswerChange={handleAnswerChange}
            keyPrefix={animalPrefix}
          />
        )
      });
    }
    
    if (hasLump) {
      const metadata = getSymptomSectionMetadata('lump');
      sections.push({
        value: 'lump',
        label: 'Grosseur / Boule',
        metadata,
        isComplete: isSectionComplete(answers, metadata.requiredQuestionKeys, animalPrefix),
        component: (
          <LumpSection
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onFileChange={handleFileChange}
            keyPrefix={animalPrefix}
          />
        )
      });
    }
    
    if (hasAggression) {
      const metadata = getSymptomSectionMetadata('aggression');
      sections.push({
        value: 'aggression',
        label: 'Comportement agressif',
        metadata,
        isComplete: isSectionComplete(answers, metadata.requiredQuestionKeys, animalPrefix),
        component: (
          <AggressiveSection
            answers={answers}
            onAnswerChange={handleAnswerChange}
            keyPrefix={animalPrefix}
          />
        )
      });
    }
    
    return sections;
  }, [
    answers, 
    animalPrefix, 
    hasBloodInStool, 
    hasUrinaryProblems, 
    hasSkinItching, 
    hasWound, 
    hasEarProblems,
    hasEyeDischarge,
    hasLameness,
    hasBreathingDifficulties,
    hasLump,
    hasAggression
  ]);

  // Calculer quelles sections doivent être ouvertes par défaut (Optimisation 1)
  const defaultOpenSections = useMemo(() => {
    const totalSymptoms = activeSymptomSections.length + (shouldShowSharedQuestions ? 1 : 0);
    
    // Si ≤3 symptômes : tout ouvrir
    if (totalSymptoms <= 3) {
      const allValues: string[] = [];
      if (shouldShowSharedQuestions) allValues.push('shared');
      activeSymptomSections.forEach(s => allValues.push(s.value));
      return allValues;
    }
    
    // Si >3 symptômes : ouvrir la première section non complétée
    const openValues: string[] = [];
    
    // Vérifier d'abord les questions partagées
    if (shouldShowSharedQuestions && !isSharedComplete) {
      openValues.push('shared');
      return openValues;
    }
    
    // Sinon, chercher la première section de symptôme non complétée
    const firstIncomplete = activeSymptomSections.find(s => !s.isComplete);
    if (firstIncomplete) {
      openValues.push(firstIncomplete.value);
    } else if (activeSymptomSections.length > 0) {
      // Si tout est complet, ouvrir la première section
      openValues.push(activeSymptomSections[0].value);
    }
    
    return openValues;
  }, [activeSymptomSections, shouldShowSharedQuestions, isSharedComplete]);

  // Couleurs pour les différentes sections
  const colorClasses = [
    'bg-destructive',
    'bg-amber-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500'
  ];

  return (
    <div className="space-y-6">
      <Accordion 
        type="multiple" 
        defaultValue={defaultOpenSections}
        className="w-full space-y-4"
      >
        {/* Questions communes avec validation visuelle */}
        {shouldShowSharedQuestions && (
          <AccordionItem value="shared" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
              <AccordionTriggerContent
                label="Questions générales"
                questionCount={sharedQuestionsCount}
                isComplete={isSharedComplete}
                color="bg-primary"
              />
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6 pt-2">
              <SharedQuestionsSection
                answers={answers}
                onAnswerChange={handleAnswerChange}
                keyPrefix={animalPrefix}
                needsGeneralForm={needsGeneralForm}
                needsEating={needsEating}
                needsDrinking={needsDrinking}
                needsPainComplaints={needsPainComplaints}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Sections de symptômes avec métadonnées */}
        {activeSymptomSections.map((section, index) => {
          const color = colorClasses[index % colorClasses.length];
          
          return (
            <AccordionItem 
              key={section.value} 
              value={section.value} 
              className="border rounded-lg bg-card shadow-sm"
            >
              <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
                <AccordionTriggerContent
                  label={section.label}
                  questionCount={section.metadata.questionCount}
                  isComplete={section.isComplete}
                  color={color}
                />
              </AccordionTrigger>
              <AccordionContent className="px-4 sm:px-6 pb-6 pt-2">
                {section.component}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default ConditionalQuestionsForm;
