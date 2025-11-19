
import SelectionButton from "@/components/SelectionButton";
import { Separator } from "@/components/ui/separator";
import type { PhotoData } from "@/components/conditional-questions/MultiPhotoUpload";

interface AggressiveSectionProps {
  answers: {[key: string]: string | File | PhotoData};
  onAnswerChange: (questionKey: string, value: string) => void;
  keyPrefix?: string;
}

const AggressiveSection = ({ answers, onAnswerChange, keyPrefix = '' }: AggressiveSectionProps) => {
  const questions = [
    {
      key: 'bite_history',
      title: 'Est-ce que l\'animal a mordu ?',
      options: ['Aucune morsure', 'Morsure sur humain(s)', 'Morsure sur animal(aux)']
    }
  ];

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

export default AggressiveSection;
