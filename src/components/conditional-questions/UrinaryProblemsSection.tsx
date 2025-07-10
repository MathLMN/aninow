
import SelectionButton from "@/components/SelectionButton";

interface UrinaryProblemsSectionProps {
  answers: {[key: string]: string | File};
  onAnswerChange: (questionKey: string, value: string) => void;
  keyPrefix?: string;
}

const UrinaryProblemsSection = ({ answers, onAnswerChange, keyPrefix = '' }: UrinaryProblemsSectionProps) => {
  const questions = [
    {
      key: 'urine_quantity',
      title: "Quelle est la quantité d'urine ?",
      options: ['Normale', 'Quelques gouttes', 'Aucune']
    },
    {
      key: 'urination_frequency',
      title: 'Quelle est la fréquence des mictions ?',
      options: ['Normale', 'Très rapprochées', 'Rares']
    },
    {
      key: 'blood_in_urine',
      title: "Est-ce qu'il y a une présence de sang dans les urines ?",
      options: ['Non', 'Légère teinte rosée', 'Sang visible']
    },
    {
      key: 'genital_licking',
      title: 'Se lèche-t-il les parties intimes ?',
      options: ['Pas du tout', 'Un peu', 'Beaucoup']
    }
  ];

  return (
    <>
      {questions.map((question) => (
        <div key={question.key} className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg text-vet-navy text-left mb-4 sm:mb-6">
            {question.title}
            <span className="text-vet-navy ml-1">*</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
    </>
  );
};

export default UrinaryProblemsSection;
