
import SelectionButton from "@/components/SelectionButton";

interface AggressiveSectionProps {
  answers: {[key: string]: string | File};
  onAnswerChange: (questionKey: string, value: string) => void;
}

const AggressiveSection = ({ answers, onAnswerChange }: AggressiveSectionProps) => {
  const questions = [
    {
      key: 'general_form',
      title: 'Quelle est sa forme générale ?',
      options: ['En forme', 'Pas en forme', 'Amorphe (avachi)']
    },
    {
      key: 'pain_complaints',
      title: 'Est-ce qu\'il se plaint de douleurs ?',
      options: ['Ne se plaint pas', 'Gémissements légers', 'Cris fréquents']
    },
    {
      key: 'bite_history',
      title: 'Est-ce que l\'animal a mordu ?',
      options: ['Aucune morsure', 'Morsure sur humain(s)', 'Morsure sur animal(aux)']
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12">
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
      ))}
    </div>
  );
};

export default AggressiveSection;
