
import SelectionButton from "@/components/SelectionButton";
import { Separator } from "@/components/ui/separator";
import type { PhotoData } from "@/components/conditional-questions/MultiPhotoUpload";

interface BreathingDifficultiesSectionProps {
  answers: {[key: string]: string | File | PhotoData};
  onAnswerChange: (questionKey: string, value: string) => void;
  keyPrefix?: string;
}

const BreathingDifficultiesSection = ({ answers, onAnswerChange, keyPrefix = '' }: BreathingDifficultiesSectionProps) => {
  const question = {
    key: 'panting',
    title: "Est-ce qu'il halète (gueule ouverte) ?",
    options: ["N'halète pas", 'Halète un peu', 'Halète fortement']
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-base font-bold">
          1
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
  );
};

export default BreathingDifficultiesSection;
