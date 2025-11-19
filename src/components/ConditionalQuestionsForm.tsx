
import { useState, useEffect } from "react";
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

interface ConditionalQuestionsFormProps {
  selectedSymptoms: string[];
  customSymptom: string;
  onAnswersChange: (answers: any) => void;
  animalPrefix?: string;
  initialAnswers?: {[key: string]: string | File};
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
  
  const needsEating = needsQuestions || hasExcessiveThirst || hasListlessness || 
    hasEyeDischarge || hasLameness || hasBreathingDifficulties;
  
  const needsDrinking = needsQuestions || hasLossOfAppetite || hasListlessness || 
    hasEyeDischarge || hasBreathingDifficulties;
  
  const needsPainComplaints = hasLameness || hasEarProblems || hasAggression;

  const symptomLabels: { [key: string]: string } = {
    bloodInStool: "Sang dans les selles",
    urinaryProblems: "Problèmes urinaires",
    skinItching: "Démangeaisons / Grattage",
    wound: "Plaie",
    earProblems: "Otite / Problèmes d'oreilles",
    eyeDischarge: "Écoulements oculaires",
    lameness: "Boiterie",
    breathingDifficulties: "Difficultés respiratoires",
    lump: "Grosseur / Boule",
    aggression: "Comportement agressif"
  };

  // Déterminer si on doit afficher les questions générales
  const shouldShowSharedQuestions = needsGeneralForm || needsEating || needsDrinking || needsPainComplaints;

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={shouldShowSharedQuestions ? ["shared"] : []} className="w-full space-y-4">
        {/* Questions communes - seulement si nécessaires */}
        {shouldShowSharedQuestions && (
          <AccordionItem value="shared" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-base sm:text-lg font-semibold text-foreground">
                  Questions générales
                </span>
              </div>
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

        {/* Questions spécifiques par symptôme */}
        {hasBloodInStool && (
          <AccordionItem value="bloodInStool" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-base sm:text-lg font-semibold text-foreground">
                  {symptomLabels.bloodInStool}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6 pt-2">
              <BloodInStoolSection
                answers={answers}
                onAnswerChange={handleAnswerChange}
                keyPrefix={animalPrefix}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {hasUrinaryProblems && (
          <AccordionItem value="urinaryProblems" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-base sm:text-lg font-semibold text-foreground">
                  {symptomLabels.urinaryProblems}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6 pt-2">
              <UrinaryProblemsSection
                answers={answers}
                onAnswerChange={handleAnswerChange}
                keyPrefix={animalPrefix}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {hasSkinItching && (
          <AccordionItem value="skinItching" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-base sm:text-lg font-semibold text-foreground">
                  {symptomLabels.skinItching}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6 pt-2">
              <SkinItchingSection
                answers={answers}
                onAnswerChange={handleAnswerChange}
                keyPrefix={animalPrefix}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {hasWound && (
          <AccordionItem value="wound" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-base sm:text-lg font-semibold text-foreground">
                  {symptomLabels.wound}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6 pt-2">
              <WoundSection
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onFileChange={handleFileChange}
                keyPrefix={animalPrefix}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {hasEarProblems && (
          <AccordionItem value="earProblems" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-violet-500" />
                <span className="text-base sm:text-lg font-semibold text-foreground">
                  {symptomLabels.earProblems}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6 pt-2">
              <EarProblemsSection
                answers={answers}
                onAnswerChange={handleAnswerChange}
                keyPrefix={animalPrefix}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {hasEyeDischarge && (
          <AccordionItem value="eyeDischarge" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-base sm:text-lg font-semibold text-foreground">
                  {symptomLabels.eyeDischarge}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6 pt-2">
              <EyeDischargeSection
                answers={answers}
                onAnswerChange={handleAnswerChange}
                keyPrefix={animalPrefix}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {hasLameness && (
          <AccordionItem value="lameness" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="text-base sm:text-lg font-semibold text-foreground">
                  {symptomLabels.lameness}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6 pt-2">
              <LamenessSection
                answers={answers}
                onAnswerChange={handleAnswerChange}
                keyPrefix={animalPrefix}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {hasBreathingDifficulties && (
          <AccordionItem value="breathingDifficulties" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-base sm:text-lg font-semibold text-foreground">
                  {symptomLabels.breathingDifficulties}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6 pt-2">
              <BreathingDifficultiesSection
                answers={answers}
                onAnswerChange={handleAnswerChange}
                keyPrefix={animalPrefix}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {hasLump && (
          <AccordionItem value="lump" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="text-base sm:text-lg font-semibold text-foreground">
                  {symptomLabels.lump}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6 pt-2">
              <LumpSection
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onFileChange={handleFileChange}
                keyPrefix={animalPrefix}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {hasAggression && (
          <AccordionItem value="aggression" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-600" />
                <span className="text-base sm:text-lg font-semibold text-foreground">
                  {symptomLabels.aggression}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 sm:px-6 pb-6 pt-2">
              <AggressiveSection
                answers={answers}
                onAnswerChange={handleAnswerChange}
                keyPrefix={animalPrefix}
              />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default ConditionalQuestionsForm;
