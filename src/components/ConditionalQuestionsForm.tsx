
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

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Afficher d'abord les questions partagées */}
      <SharedQuestionsSection 
        answers={answers}
        onAnswerChange={handleAnswerChange}
        keyPrefix={animalPrefix}
        needsGeneralForm={needsGeneralForm}
        needsEating={needsEating}
        needsDrinking={needsDrinking}
        needsPainComplaints={needsPainComplaints}
      />

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
