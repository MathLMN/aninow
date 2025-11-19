
import SelectionButton from "@/components/SelectionButton";
import { Separator } from "@/components/ui/separator";

interface LumpSectionProps {
  answers: {[key: string]: string | File};
  onAnswerChange: (questionKey: string, value: string) => void;
  onFileChange: (questionKey: string, file: File | null) => void;
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
    <div className="space-y-8 sm:space-y-10">
      {questions.map((question, index) => (
        <div key={question.key}>
          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm sm:text-base font-bold">
                {index + 1}
              </div>
              <h3 className="text-base sm:text-lg text-foreground font-semibold text-left flex-1 pt-0.5">
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
          
          <Separator className="mt-8 sm:mt-10" />
        </div>
      ))}

      {/* Photo upload section */}
      <div className="space-y-5 sm:space-y-6">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm sm:text-base font-bold">
              {questions.length + 1}
            </div>
            <h3 className="text-base sm:text-lg text-foreground font-semibold text-left flex-1 pt-0.5">
              📸 Photo de la grosseur
              <span className="text-sm text-muted-foreground ml-2 font-normal">(optionnel mais recommandé)</span>
            </h3>
          </div>
          <div className="w-full p-2 bg-blue-50 border-l-4 border-blue-400 rounded ml-0 sm:ml-10">
            <p className="text-xs text-blue-800 text-left flex items-start gap-2">
              <span className="text-sm">💡</span>
              <span>Une photo aide le vétérinaire à évaluer la taille, la forme et l'aspect de la grosseur pour mieux préparer la consultation.</span>
            </p>
          </div>
        </div>
        
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors ml-0 sm:ml-10">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange('lump_photo', e.target.files?.[0] || null)}
            className="hidden"
            id={`${keyPrefix}lump-photo-upload`}
          />
          <label
            htmlFor={`${keyPrefix}lump-photo-upload`}
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-foreground">
              Cliquez pour choisir une photo ou faites-la glisser ici
            </span>
            <span className="text-xs text-muted-foreground">
              Format accepté : JPG, PNG, WEBP
            </span>
          </label>
          {answers[keyPrefix + 'lump_photo'] && answers[keyPrefix + 'lump_photo'] instanceof File && (
            <p className="text-sm text-green-600 mt-3 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Photo ajoutée : {(answers[keyPrefix + 'lump_photo'] as File).name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LumpSection;
