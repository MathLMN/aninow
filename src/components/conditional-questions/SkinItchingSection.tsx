
import SelectionButton from "@/components/SelectionButton";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { PhotoData } from "@/components/conditional-questions/MultiPhotoUpload";
import BodyZoneSelector from "./BodyZoneSelector";

interface SkinItchingSectionProps {
  answers: {[key: string]: string | File | PhotoData};
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

            {/* Show text input when "Une zone localisée" is selected */}
            {question.key === 'skin_itching_areas' && answers[keyPrefix + 'skin_itching_areas'] === 'Une zone localisée' && (
              <div className="ml-0 sm:ml-10 mt-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Précisez la zone du corps <span className="text-destructive">*</span>
                </label>
                <Textarea
                  value={answers[keyPrefix + 'skin_itching_areas_detail'] as string || ''}
                  onChange={(e) => onAnswerChange('skin_itching_areas_detail', e.target.value)}
                  placeholder="Exemple : patte arrière droite, dos, tête..."
                  className="w-full"
                  rows={2}
                />
              </div>
            )}

            {/* Show body zone selector when "Plusieurs zones" is selected */}
            {question.key === 'skin_itching_areas' && answers[keyPrefix + 'skin_itching_areas'] === 'Plusieurs zones' && (
              <BodyZoneSelector
                selectedZones={(() => {
                  const value = answers[keyPrefix + 'skin_itching_multiple_zones'];
                  if (Array.isArray(value)) return value;
                  if (typeof value === 'string') {
                    try {
                      return JSON.parse(value);
                    } catch {
                      return [];
                    }
                  }
                  return [];
                })()}
                onZonesChange={(zones) => onAnswerChange('skin_itching_multiple_zones', JSON.stringify(zones))}
                keyPrefix={keyPrefix}
              />
            )}
          </div>
          
          {index < questions.length - 1 && (
            <Separator className="mt-6 sm:mt-10" />
          )}
        </div>
      ))}
    </div>
  );
};

export default SkinItchingSection;
