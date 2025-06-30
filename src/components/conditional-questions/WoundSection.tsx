
import SelectionButton from "@/components/SelectionButton";

interface WoundSectionProps {
  answers: {[key: string]: string | File};
  onAnswerChange: (questionKey: string, value: string) => void;
  onFileChange: (questionKey: string, file: File | null) => void;
}

const WoundSection = ({ answers, onAnswerChange, onFileChange }: WoundSectionProps) => {
  const questions = [
    {
      key: 'wound_location',
      title: 'Sur quelle(s) zone(s) du corps ?',
      options: ['Généralisée', 'Plusieurs zones', 'Une zone localisée']
    },
    {
      key: 'wound_oozing',
      title: 'La plaie est suintante (pus ou liquide) ?',
      options: ['Ne suinte pas', 'Légèrement', 'Abondamment']
    },
    {
      key: 'wound_depth',
      title: 'La plaie semble superficielle ou profonde ?',
      options: ['Superficielle', 'Légèrement profonde', 'Très profonde']
    },
    {
      key: 'wound_bleeding',
      title: 'La plaie saigne ?',
      options: ['Ne saigne pas', 'Légèrement', 'Abondamment']
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

      {/* Photo upload section */}
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-base sm:text-lg text-vet-navy text-left mb-4 sm:mb-6">
          Ajoutez une photo de la plaie ci-dessous (optionnel)
        </h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-vet-sage/50 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange('wound_photo', e.target.files?.[0] || null)}
            className="hidden"
            id="wound-photo-upload"
          />
          <label
            htmlFor="wound-photo-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-gray-600">
              Cliquez pour choisir un fichier ou faites-le glisser ici
            </span>
          </label>
          {answers['wound_photo'] && answers['wound_photo'] instanceof File && (
            <p className="text-sm text-vet-sage mt-2">
              Fichier sélectionné: {answers['wound_photo'].name}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default WoundSection;
