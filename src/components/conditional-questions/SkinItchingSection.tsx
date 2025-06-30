
import SelectionButton from "@/components/SelectionButton";

interface SkinItchingSectionProps {
  answers: {[key: string]: string | File};
  onAnswerChange: (questionKey: string, value: string) => void;
}

const SkinItchingSection = ({ answers, onAnswerChange }: SkinItchingSectionProps) => {
  const questions = [
    {
      key: 'skin_itching_areas',
      title: 'Sur quelle(s) zone(s) du corps ?',
      options: ['Généralisée', 'Plusieurs zones', 'Une zone localisée']
    },
    {
      key: 'antiparasitic_treatment',
      title: 'Quand a-t-il eu son dernier traitement antiparasitaire ?',
      options: ['moins d\'1 mois', '1 à 3 mois', 'plus de 3 mois', 'Jamais']
    },
    {
      key: 'hair_loss',
      title: 'Est-ce qu\'il y a une perte de poils localisée ?',
      options: ['Aucune', 'Légère', 'Importante']
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
    </>
  );
};

export default SkinItchingSection;
