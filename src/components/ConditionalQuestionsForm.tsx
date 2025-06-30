
import { useState } from "react";
import { useSymptomDetection } from "@/hooks/useSymptomDetection";
import GeneralQuestionsSection from "@/components/conditional-questions/GeneralQuestionsSection";
import BloodInStoolSection from "@/components/conditional-questions/BloodInStoolSection";
import UrinaryProblemsSection from "@/components/conditional-questions/UrinaryProblemsSection";
import SkinItchingSection from "@/components/conditional-questions/SkinItchingSection";
import WoundSection from "@/components/conditional-questions/WoundSection";
import EarProblemsSection from "@/components/conditional-questions/EarProblemsSection";
import EyeDischargeSection from "@/components/conditional-questions/EyeDischargeSection";

interface ConditionalQuestionsFormProps {
  selectedSymptoms: string[];
  customSymptom: string;
  onAnswersChange: (answers: any) => void;
}

const ConditionalQuestionsForm = ({ selectedSymptoms, customSymptom, onAnswersChange }: ConditionalQuestionsFormProps) => {
  const [answers, setAnswers] = useState<{[key: string]: string | File}>({});

  const {
    needsQuestions,
    hasBloodInStool,
    hasUrinaryProblems,
    hasSkinItching,
    hasWound,
    hasEarProblems,
    hasEyeDischarge
  } = useSymptomDetection(selectedSymptoms, customSymptom);

  if (!needsQuestions && !hasBloodInStool && !hasUrinaryProblems && !hasSkinItching && !hasWound && !hasEarProblems && !hasEyeDischarge) {
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

  // Déterminer si on doit afficher les questions générales
  const shouldShowGeneralQuestions = needsQuestions || hasEarProblems || hasEyeDischarge;

  return (
    <div className="space-y-8 sm:space-y-12">
      {shouldShowGeneralQuestions && (
        <GeneralQuestionsSection 
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
    </div>
  );
};

export default ConditionalQuestionsForm;
