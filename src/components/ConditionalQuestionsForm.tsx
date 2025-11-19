
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
import OtherSymptomSection from "@/components/conditional-questions/OtherSymptomSection";
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
  contextText?: string;
}

const AccordionTriggerContent = ({ label, questionCount, isComplete, color, contextText }: AccordionTriggerContentProps) => (
  <div className="flex flex-col items-start w-full gap-3">
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
        <div className={`h-2 w-2 rounded-full ${color} flex-shrink-0`} />
        <span className={`text-sm sm:text-base md:text-lg font-semibold text-left ${isComplete ? 'text-muted-foreground' : 'text-foreground'}`}>
          {label}
        </span>
        <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground font-normal whitespace-nowrap">
          ({questionCount} question{questionCount > 1 ? 's' : ''})
        </span>
      </div>
      {isComplete && (
        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2 flex-shrink-0" />
      )}
    </div>
    {contextText && (
      <div className="w-full p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
        <p className="text-xs text-blue-800 text-left flex items-start gap-2">
          <span className="text-sm">💡</span>
          <span>{contextText}</span>
        </p>
      </div>
    )}
  </div>
);

interface ActiveSymptomSection {
  value: string;
  label: string;
  metadata: SectionMetadata;
  isComplete: boolean;
  component: JSX.Element;
  contextText?: string;
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
    hasAggression,
    hasOtherSymptom
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

  // Textes contextuels pour expliquer l'utilité des questions
  const symptomContextTexts: Record<string, string> = {
    blood_in_stool: "Pour évaluer la gravité du problème digestif.",
    urinary_problems: "Pour identifier rapidement un problème urgent.",
    wound: "Pour déterminer si des soins immédiats sont nécessaires.",
    lump: "Pour évaluer la nature et l'urgence de la grosseur.",
    ear_problems: "Pour diagnostiquer une infection ou inflammation.",
    eye_discharge: "Pour évaluer la gravité de l'atteinte oculaire.",
    breathing_difficulties: "Pour évaluer une détresse respiratoire potentielle.",
    skin_itching: "Pour identifier la cause (allergie, parasites, infection).",
    lameness: "Pour évaluer la gravité de la boiterie et son origine.",
    aggression: "Pour assurer la sécurité lors de la consultation.",
    other_symptom: "Ces questions générales permettent au vétérinaire d'évaluer l'urgence et de mieux préparer votre consultation."
  };

  const sharedQuestionsContext = "Pour évaluer l'état général et le confort de votre animal.";

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
        ),
        contextText: symptomContextTexts.blood_in_stool
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
        ),
        contextText: symptomContextTexts.urinary_problems
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
        ),
        contextText: symptomContextTexts.skin_itching
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
        ),
        contextText: symptomContextTexts.wound
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
        ),
        contextText: symptomContextTexts.ear_problems
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
        ),
        contextText: symptomContextTexts.eye_discharge
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
        ),
        contextText: symptomContextTexts.lameness
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
        ),
        contextText: symptomContextTexts.breathing_difficulties
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
        ),
        contextText: symptomContextTexts.lump
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
        ),
        contextText: symptomContextTexts.aggression
      });
    }
    
    if (hasOtherSymptom) {
      const metadata = getSymptomSectionMetadata('other_symptom');
      sections.push({
        value: 'otherSymptom',
        label: 'Informations générales sur le symptôme',
        metadata,
        isComplete: isSectionComplete(answers, metadata.requiredQuestionKeys, animalPrefix),
        component: (
          <OtherSymptomSection
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onFileChange={handleFileChange}
            keyPrefix={animalPrefix}
          />
        ),
        contextText: symptomContextTexts.other_symptom
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
    hasAggression,
    hasOtherSymptom
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
                contextText={sharedQuestionsContext}
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
                  contextText={section.contextText}
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
