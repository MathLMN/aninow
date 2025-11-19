
import SelectionButton from "@/components/SelectionButton";
import { Separator } from "@/components/ui/separator";
import type { PhotoData } from "@/components/conditional-questions/MultiPhotoUpload";

interface GeneralQuestionsSectionProps {
  answers: {[key: string]: string | File | PhotoData};
  onAnswerChange: (questionKey: string, value: string) => void;
  excludeDrinking?: boolean;
  keyPrefix?: string;
}

const GeneralQuestionsSection = ({ answers, onAnswerChange, excludeDrinking = false, keyPrefix = '' }: GeneralQuestionsSectionProps) => {
  const allQuestions = [
    {
      key: 'general_form',
      title: 'Quelle est sa forme générale ?',
      options: ['En forme', 'Pas en forme', 'Amorphe (avachi)']
    },
    {
      key: 'eating',
      title: "Est-ce qu'il mange ?",
      options: ['Mange normalement', 'Mange peu', 'Ne mange pas']
    },
    {
      key: 'drinking',
      title: "Est-ce qu'il boit de l'eau ?",
      options: ['Soif normale', 'Soif excessive', 'Pas soif']
    }
  ];

  // Filtrer les questions selon le contexte
  const questions = excludeDrinking 
    ? allQuestions.filter(q => q.key !== 'drinking')
    : allQuestions;

  return (
    <div className="space-y-6 sm:space-y-10">
      {questions.map((question, index) => (
        <div key={question.key}>
          <div className="space-y-3 sm:space-y-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-base font-bold">
                {index + 1}
              </div>
              <h3 className="text-sm sm:text-lg text-foreground font-semibold text-left flex-1 pt-0.5">
                {question.title}
                <span className="text-destructive ml-1">*</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 ml-0 sm:ml-10">
              {question.options.map((option) => (
                <SelectionButton
                  key={option}
                  id={`${keyPrefix}${question.key}-${option}`}
                  value={option}
                  isSelected={answers[keyPrefix + question.key] === option}
                  onSelect={(value) => onAnswerChange(question.key, value)}
                  className="p-2 text-sm font-medium"
                >
                  <span className="text-center leading-tight">{option}</span>
                </SelectionButton>
              ))}
            </div>
          </div>
          
          {index < questions.length - 1 && (
            <Separator className="mt-6 sm:mt-10" />
          )}
        </div>
      ))}
    </div>
  );
};

export default GeneralQuestionsSection;
