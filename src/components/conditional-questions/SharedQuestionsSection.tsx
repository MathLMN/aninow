import SelectionButton from "@/components/SelectionButton";
import { Separator } from "@/components/ui/separator";

interface SharedQuestionsSectionProps {
  answers: {[key: string]: string | File};
  onAnswerChange: (questionKey: string, value: string) => void;
  keyPrefix?: string;
  needsGeneralForm?: boolean;
  needsEating?: boolean;
  needsDrinking?: boolean;
  needsPainComplaints?: boolean;
}

const SharedQuestionsSection = ({ 
  answers, 
  onAnswerChange, 
  keyPrefix = '',
  needsGeneralForm = false,
  needsEating = false,
  needsDrinking = false,
  needsPainComplaints = false
}: SharedQuestionsSectionProps) => {
  const allQuestions = [
    {
      key: 'general_form',
      title: 'Quelle est sa forme générale ?',
      options: ['En forme', 'Pas en forme', 'Amorphe (avachi)'],
      show: needsGeneralForm
    },
    {
      key: 'eating',
      title: "Est-ce qu'il mange ?",
      options: ['Mange normalement', 'Mange peu', 'Ne mange pas'],
      show: needsEating
    },
    {
      key: 'drinking',
      title: "Est-ce qu'il boit de l'eau ?",
      options: ['Soif normale', 'Soif excessive', 'Pas soif'],
      show: needsDrinking
    },
    {
      key: 'pain_complaints',
      title: "Est-ce qu'il se plaint de douleurs ?",
      options: ['Ne se plaint pas', 'Gémissements légers', 'Cris fréquents'],
      show: needsPainComplaints
    }
  ];

  const visibleQuestions = allQuestions.filter(q => q.show);

  if (visibleQuestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {visibleQuestions.map((question, index) => (
        <div key={question.key}>
          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm sm:text-base font-bold">
                {index + 1}
              </div>
              <h3 className="text-base sm:text-lg text-foreground font-semibold text-left flex-1 pt-0.5">
                {question.title}
                <span className="text-destructive ml-1">*</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ml-0 sm:ml-10">
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
          
          {index < visibleQuestions.length - 1 && (
            <Separator className="mt-8 sm:mt-10" />
          )}
        </div>
      ))}
    </div>
  );
};

export default SharedQuestionsSection;
