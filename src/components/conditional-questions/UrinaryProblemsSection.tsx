
import SelectionButton from "@/components/SelectionButton";

interface UrinaryProblemsSectionProps {
  answers: {[key: string]: string | File};
  onAnswerChange: (questionKey: string, value: string) => void;
  keyPrefix?: string;
}

const UrinaryProblemsSection = ({ answers, onAnswerChange, keyPrefix = '' }: UrinaryProblemsSectionProps) => {
  const questions = [
    {
      key: 'urination_frequency',
      title: 'Quelle est la fréquence des mictions ?',
      options: ['Normale', 'Très rapprochées', 'Rares']
    },
    {
      key: 'urine_quantity',
      title: "Quelle est la quantité d'urine ?",
      options: ['Normale', 'Quelques gouttes', 'Aucune']
    },
    {
      key: 'blood_in_urine',
      title: "Présence de sang dans les urines ?",
      options: ['Non', 'Légère teinte rosée', 'Sang visible']
    },
    {
      key: 'genital_licking',
      title: 'Se lèche-t-il les parties intimes ?',
      options: ['Pas du tout', 'Un peu', 'Beaucoup']
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {questions.map((question, index) => (
        <div key={question.key} className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-accent/30 rounded-lg border-l-4 border-primary">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-sm font-bold">
              {index + 1}
            </div>
            <h3 className="text-base sm:text-lg text-foreground font-semibold text-left flex-1">
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
      ))}
    </div>
  );
};

export default UrinaryProblemsSection;
