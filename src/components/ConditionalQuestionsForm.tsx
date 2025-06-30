import { useState } from "react";
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
}

const ConditionalQuestionsForm = ({ selectedSymptoms, customSymptom, onAnswersChange }: ConditionalQuestionsFormProps) => {
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

  if (!needsQuestions && !hasLossOfAppetite && !hasExcessiveThirst && !hasBloodInStool && !hasUrinaryProblems && !hasSkinItching && !hasWound && !hasEarProblems && !hasEyeDischarge && !hasLameness && !hasBreathingDifficulties && !hasLump && !hasListlessness && !hasAggression) {
    return null;
  }

  const handleAnswerChange = (questionKey: string, value: string) => {
    const newAnswers = { ...answers, [questionKey]: value };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  const handleFileChange = (questionKey: string, file: File | null) => {
    const newAnswers = { ...answers, [questionKey]: file };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  // Déterminer si on doit afficher les questions générales (sans perte d'appétit ni soif excessive ni abattement ni agressivité)
  const shouldShowGeneralQuestions = needsQuestions || hasEarProblems || hasEyeDischarge || hasLameness || hasBreathingDifficulties;

  return (
    <div className="space-y-8 sm:space-y-12">
      {shouldShowGeneralQuestions && (
        <GeneralQuestionsSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          excludeDrinking={hasLameness}
        />
      )}

      {hasLossOfAppetite && (
        <LossOfAppetiteSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
      )}

      {hasExcessiveThirst && (
        <ExcessiveThirstSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
      )}

      {hasListlessness && (
        <ListlessSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
      )}

      {hasBloodInStool && (
        <BloodInStoolSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
      )}

      {hasUrinaryProblems && (
        <UrinaryProblemsSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
      )}

      {hasSkinItching && (
        <SkinItchingSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
      )}

      {hasWound && (
        <WoundSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onFileChange={handleFileChange}
        />
      )}

      {hasEarProblems && (
        <EarProblemsSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
      )}

      {hasEyeDischarge && (
        <EyeDischargeSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
      )}

      {hasLameness && (
        <LamenessSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
      )}

      {hasBreathingDifficulties && (
        <BreathingDifficultiesSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
      )}

      {hasLump && (
        <LumpSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onFileChange={handleFileChange}
        />
      )}

      {hasAggression && (
        <AggressiveSection 
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
      )}
    </div>
  );
};

export default ConditionalQuestionsForm;
