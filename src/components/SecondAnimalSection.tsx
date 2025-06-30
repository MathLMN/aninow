
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AnimalConsultationForm from "@/components/AnimalConsultationForm";

interface SecondAnimalSectionProps {
  hasTwoAnimals: boolean;
  shouldForceConvenienceForAnimal2: boolean;
  secondAnimalDifferentReason: boolean;
  onSecondAnimalDifferentReasonChange: (checked: boolean) => void;
  consultationReason: string;
  onConsultationReasonChange: (value: string) => void;
  convenienceOptions: string[];
  onConvenienceOptionsChange: (options: string[]) => void;
  customText: string;
  onCustomTextChange: (text: string) => void;
  selectedSymptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
  customSymptom: string;
  onCustomSymptomChange: (symptom: string) => void;
  secondAnimalConsultationReason: string;
  onSecondAnimalConsultationReasonChange: (value: string) => void;
  secondAnimalConvenienceOptions: string[];
  onSecondAnimalConvenienceOptionsChange: (options: string[]) => void;
  secondAnimalCustomText: string;
  onSecondAnimalCustomTextChange: (text: string) => void;
  secondAnimalSelectedSymptoms?: string[];
  onSecondAnimalSymptomsChange?: (symptoms: string[]) => void;
  secondAnimalCustomSymptom?: string;
  onSecondAnimalCustomSymptomChange?: (symptom: string) => void;
}

const SecondAnimalSection: React.FC<SecondAnimalSectionProps> = ({
  hasTwoAnimals,
  shouldForceConvenienceForAnimal2,
  secondAnimalDifferentReason,
  onSecondAnimalDifferentReasonChange,
  consultationReason,
  onConsultationReasonChange,
  convenienceOptions,
  onConvenienceOptionsChange,
  customText,
  onCustomTextChange,
  selectedSymptoms,
  onSymptomsChange,
  customSymptom,
  onCustomSymptomChange,
  secondAnimalConsultationReason,
  onSecondAnimalConsultationReasonChange,
  secondAnimalConvenienceOptions,
  onSecondAnimalConvenienceOptionsChange,
  secondAnimalCustomText,
  onSecondAnimalCustomTextChange,
  secondAnimalSelectedSymptoms = [],
  onSecondAnimalSymptomsChange = () => {},
  secondAnimalCustomSymptom = '',
  onSecondAnimalCustomSymptomChange = () => {}
}) => {
  if (!hasTwoAnimals) return null;

  return (
    <>
      {/* Checkbox pour motif différent pour le 2e animal - Masqué si symptômes pour animal 1 */}
      {!shouldForceConvenienceForAnimal2 && (
        <div className="flex items-start space-x-2 p-2 sm:p-0">
          <Checkbox 
            id="different-reason-second-animal"
            checked={secondAnimalDifferentReason}
            onCheckedChange={(checked) => onSecondAnimalDifferentReasonChange(checked as boolean)}
            className="mt-0.5 sm:mt-1"
          />
          <Label htmlFor="different-reason-second-animal" className="text-vet-navy cursor-pointer text-sm leading-tight sm:text-base">
            Le motif est différent pour le 2e animal
          </Label>
        </div>
      )}

      {/* Message informatif quand consultation forcée pour animal 2 */}
      {shouldForceConvenienceForAnimal2 && (
        <div className="bg-vet-blue/10 p-3 rounded-md border border-vet-blue/20">
          <p className="text-xs sm:text-sm text-vet-navy text-center leading-relaxed">
            ℹ️ Pour le 2e animal, seule une consultation de convenance est possible
          </p>
        </div>
      )}

      {/* Sections séparées pour chaque animal si motif différent */}
      {(secondAnimalDifferentReason || shouldForceConvenienceForAnimal2) && (
        <div className="space-y-4 sm:space-y-8">
          {/* Animal 1 */}
          <AnimalConsultationForm
            title="Animal 1"
            consultationReason={consultationReason}
            onConsultationReasonChange={onConsultationReasonChange}
            convenienceOptions={convenienceOptions}
            onConvenienceOptionsChange={onConvenienceOptionsChange}
            customText={customText}
            onCustomTextChange={onCustomTextChange}
            selectedSymptoms={selectedSymptoms}
            onSymptomsChange={onSymptomsChange}
            customSymptom={customSymptom}
            onCustomSymptomChange={onCustomSymptomChange}
            containerClassName="p-3 bg-vet-beige/30 rounded-lg sm:p-4"
          />

          {/* Animal 2 */}
          <AnimalConsultationForm
            title="Animal 2"
            consultationReason={secondAnimalConsultationReason}
            onConsultationReasonChange={onSecondAnimalConsultationReasonChange}
            convenienceOptions={secondAnimalConvenienceOptions}
            onConvenienceOptionsChange={onSecondAnimalConvenienceOptionsChange}
            customText={secondAnimalCustomText}
            onCustomTextChange={onSecondAnimalCustomTextChange}
            selectedSymptoms={secondAnimalSelectedSymptoms}
            onSymptomsChange={onSecondAnimalSymptomsChange}
            customSymptom={secondAnimalCustomSymptom}
            onCustomSymptomChange={onSecondAnimalCustomSymptomChange}
            isForced={shouldForceConvenienceForAnimal2}
            containerClassName="p-3 bg-vet-blue/10 rounded-lg sm:p-4"
          />
        </div>
      )}
    </>
  );
};

export default SecondAnimalSection;
