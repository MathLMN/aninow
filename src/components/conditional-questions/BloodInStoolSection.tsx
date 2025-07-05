
import SelectionButton from "@/components/SelectionButton";

interface BloodInStoolSectionProps {
  answers: {[key: string]: string | File};
  onAnswerChange: (questionKey: string, value: string) => void;
  keyPrefix?: string;
}

const BloodInStoolSection = ({ answers, onAnswerChange, keyPrefix = '' }: BloodInStoolSectionProps) => {
  const questions = [
    {
      key: 'stool_consistency',
      title: 'Quelle est la consistance des selles ?',
      options: ['Selles normales', 'Selles molles', 'Selles liquides']
    },
    {
      key: 'blood_quantity',
      title: 'Quelle quantité de sang observez-vous ?',
      options: ['Quelques traces', 'Quantité modérée', 'Beaucoup de sang']
    },
    {
      key: 'stool_frequency',
      title: 'À quelle fréquence observe-t-on des selles ?',
      options: ['Normale', 'Plus fréquent', 'Moins fréquent']
    }
  ];

  return (
    <>
      {questions.map((question) => (
        <div key={question.key} className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg text-vet-navy text-left mb-4 sm:mb-6">
            {question.title}
            <span className="text-red-500 ml-1">*</span>
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

export default BloodInStoolSection;
