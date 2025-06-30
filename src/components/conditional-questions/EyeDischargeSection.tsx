
import SelectionButton from "@/components/SelectionButton";

interface EyeDischargeSectionProps {
  answers: {[key: string]: string | File};
  onAnswerChange: (questionKey: string, value: string) => void;
}

const EyeDischargeSection = ({ answers, onAnswerChange }: EyeDischargeSectionProps) => {
  const question = {
    key: 'eye_condition',
    title: "Quel est l'état de l'œil ?",
    options: ['Normal', 'Rouge', 'Gonflé', 'Rouge et gonflé']
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-base sm:text-lg text-vet-navy text-left mb-4 sm:mb-6">
        {question.title}
        <span className="text-red-500 ml-1">*</span>
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {question.options.map((option) => (
          <SelectionButton
            key={option}
            id={`${question.key}-${option}`}
            value={option}
            isSelected={answers[question.key] === option}
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

export default EyeDischargeSection;
