
import SelectionButton from "@/components/SelectionButton";
import { Separator } from "@/components/ui/separator";
import MultiPhotoUpload, { PhotoData } from "./MultiPhotoUpload";

interface LumpSectionProps {
  answers: {[key: string]: string | File | PhotoData};
  onAnswerChange: (questionKey: string, value: string) => void;
  onFileChange: (questionKey: string, value: PhotoData | null) => void;
  keyPrefix?: string;
}

const LumpSection = ({ answers, onAnswerChange, onFileChange, keyPrefix = '' }: LumpSectionProps) => {
  const questions = [
    {
      key: 'lump_body_area',
      title: 'Sur quelle(s) zone(s) du corps ?',
      options: ['Généralisée', 'Plusieurs zones', 'Une zone localisée']
    },
    {
      key: 'lump_size_evolution',
      title: 'Comment évolue la taille de la grosseur ?',
      options: ['Stable', 'Grossi légèrement', 'Grossi rapidement']
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
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
          
          <Separator className="mt-6 sm:mt-8" />
        </div>
      ))}

      {/* Photo upload section */}
      <div className="space-y-3 sm:space-y-6">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-base font-bold">
              {questions.length + 1}
            </div>
            <h3 className="text-sm sm:text-lg text-foreground font-semibold text-left flex-1 pt-0.5">
              📸 Photos de la grosseur
              <span className="text-sm text-muted-foreground ml-2 font-normal">(optionnel mais recommandé)</span>
            </h3>
          </div>
          <div className="w-full p-2 bg-blue-50 border-l-4 border-blue-400 rounded ml-0 sm:ml-10">
            <p className="text-xs text-blue-800 text-left flex items-start gap-2">
              <span className="text-sm">💡</span>
              <span>Les photos aident le vétérinaire à évaluer la taille, la forme et l'aspect de la grosseur pour mieux préparer la consultation.</span>
            </p>
          </div>
        </div>
        
        <MultiPhotoUpload
          photoKey="lump_photo"
          keyPrefix={keyPrefix}
          answers={answers}
          onFileChange={onFileChange}
          maxPhotos={3}
        />
      </div>
    </div>
  );
};

export default LumpSection;
