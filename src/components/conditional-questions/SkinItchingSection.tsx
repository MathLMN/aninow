
import SelectionButton from "@/components/SelectionButton";

interface SkinItchingSectionProps {
  answers: {[key: string]: string | File};
  onAnswerChange: (questionKey: string, value: string) => void;
  keyPrefix?: string;
}

const SkinItchingSection = ({ answers, onAnswerChange, keyPrefix = '' }: SkinItchingSectionProps) => {
  const questions = [
    {
      key: 'skin_itching_areas',
      title: 'Sur quelle(s) zone(s) du corps ?',
      options: ['Une zone localisée', 'Plusieurs zones', 'Généralisée']
    },
    {
      key: 'hair_loss',
      title: "Perte de poils localisée ?",
      options: ['Aucune', 'Légère', 'Importante']
    },
    {
      key: 'antiparasitic_treatment',
      title: 'Dernier traitement antiparasitaire ?',
      options: ['Moins d\'1 mois', '1 à 3 mois', 'Plus de 3 mois', 'Jamais']
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

export default SkinItchingSection;
