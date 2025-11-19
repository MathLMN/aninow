
import { useState, useEffect } from "react";
import { useSymptomDetection } from "@/hooks/useSymptomDetection";
import GeneralQuestionsSection from "@/components/conditional-questions/GeneralQuestionsSection";
import LossOfAppetiteSection from "@/components/conditional-questions/LossOfAppetiteSection";
import ExcessiveThirstSection from "@/components/conditional-questions/ExcessiveThirstSection";
import BloodInStoolSection from "@/components/conditional-questions/BloodInStoolSection";
import UrinaryProblemsSection from "@/components/conditional-questions/UrinaryProblemsSection";
import SkinItchingSection from "@/components/conditional-questions/SkinItchingSection";
import WoundSection from "@/components/conditional-questions/WoundSection";
import EarProblemsSection from "@/components/conditional-questions/EarProblemsSection";
import EyeDischargeSection from "@/components/conditional-questions/EyeDischargeSection";
import LamenessSection from "@/components/conditional-questions/LamenessSection";
import BreathingDifficultiesSection from "@/components/conditional-questions/BreathingDifficultiesSection";
import LumpSection from "@/components/conditional-questions/LumpSection";
import ListlessSection from "@/components/conditional-questions/ListlessSection";
import AggressiveSection from "@/components/conditional-questions/AggressiveSection";

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

  // Déterminer si on doit afficher les questions générales (sans perte d'appétit ni soif excessive ni abattement ni agressivité)
  const shouldShowGeneralQuestions = needsQuestions || hasEyeDischarge || hasLameness || hasBreathingDifficulties;

  return (
    <div className="space-y-8 sm:space-y-12">
      {shouldShowGeneralQuestions && (
        <GeneralQuestionsSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          excludeDrinking={hasLameness}
          keyPrefix={animalPrefix}
        />
      )}

      {hasLossOfAppetite && (
        <LossOfAppetiteSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          keyPrefix={animalPrefix}
        />
      )}

      {hasExcessiveThirst && (
        <ExcessiveThirstSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          keyPrefix={animalPrefix}
        />
      )}

      {hasListlessness && (
        <ListlessSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          keyPrefix={animalPrefix}
        />
      )}

      {hasBloodInStool && (
        <BloodInStoolSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          keyPrefix={animalPrefix}
        />
      )}

      {hasUrinaryProblems && (
        <UrinaryProblemsSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          keyPrefix={animalPrefix}
        />
      )}

      {hasSkinItching && (
        <SkinItchingSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          keyPrefix={animalPrefix}
        />
      )}

      {hasWound && (
        <WoundSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onFileChange={handleFileChange}
          keyPrefix={animalPrefix}
        />
      )}

      {hasEarProblems && (
        <EarProblemsSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          keyPrefix={animalPrefix}
        />
      )}

      {hasEyeDischarge && (
        <EyeDischargeSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          keyPrefix={animalPrefix}
        />
      )}

      {hasLameness && (
        <LamenessSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          keyPrefix={animalPrefix}
        />
      )}

      {hasBreathingDifficulties && (
        <BreathingDifficultiesSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          keyPrefix={animalPrefix}
        />
      )}

      {hasLump && (
        <LumpSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onFileChange={handleFileChange}
          keyPrefix={animalPrefix}
        />
      )}

      {hasAggression && (
        <AggressiveSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          keyPrefix={animalPrefix}
        />
      )}
    </div>
  );
};

export default ConditionalQuestionsForm;
