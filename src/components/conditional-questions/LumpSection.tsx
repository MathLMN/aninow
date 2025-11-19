
import SelectionButton from "@/components/SelectionButton";

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

      {/* Photo upload section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg text-vet-navy text-left">
            📸 Photo de la grosseur
            <span className="text-sm text-gray-500 ml-2 font-normal">(optionnel mais recommandé)</span>
          </h3>
          <p className="text-sm text-gray-600 text-left">
            Une photo aide le vétérinaire à évaluer la taille, la forme et l'aspect de la grosseur pour mieux préparer la consultation.
          </p>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-vet-sage/50 transition-colors">
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
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-gray-600">
              Cliquez pour choisir une photo ou faites-la glisser ici
            </span>
            <span className="text-xs text-gray-500">
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
    </>
  );
};

export default LumpSection;
