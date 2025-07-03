
import React from 'react';
import { Label } from "@/components/ui/label";
import ConsultationReasonSelect from "@/components/ConsultationReasonSelect";
import ConvenienceConsultationSelect from "@/components/ConvenienceConsultationSelect";
import SymptomSelector from "@/components/SymptomSelector";

interface AnimalConsultationFormProps {
  title: string;
  consultationReason: string;
  onConsultationReasonChange: (value: string) => void;
  convenienceOptions: string[];
  onConvenienceOptionsChange: (options: string[]) => void;
  customText: string;
  onCustomTextChange: (text: string) => void;
  selectedSymptoms?: string[];
  onSymptomsChange?: (symptoms: string[]) => void;
  customSymptom?: string;
  onCustomSymptomChange?: (symptom: string) => void;
  isForced?: boolean;
  containerClassName?: string;
  animalName?: string;
  animalNumber?: number;
}

const AnimalConsultationForm: React.FC<AnimalConsultationFormProps> = ({
  title,
  consultationReason,
  onConsultationReasonChange,
  convenienceOptions,
  onConvenienceOptionsChange,
  customText,
  onCustomTextChange,
  selectedSymptoms = [],
  onSymptomsChange = () => {},
  customSymptom = '',
  onCustomSymptomChange = () => {},
  isForced = false,
  containerClassName = "",
  animalName,
  animalNumber
}) => {
  // Construire le titre avec le numéro et le prénom de l'animal si fournis
  const displayTitle = animalNumber && animalName 
    ? `Animal ${animalNumber} - ${animalName}` 
    : animalName 
    ? `Motif pour ${animalName}` 
    : title;

  return (
    <div className={`space-y-2 sm:space-y-4 ${containerClassName}`}>
      <h3 className="text-sm sm:text-lg font-semibold text-vet-blue">{displayTitle}</h3>
      
      {!isForced && (
        <ConsultationReasonSelect
          value={consultationReason}
          onValueChange={onConsultationReasonChange}
        />
      )}
      
      {(isForced || consultationReason === 'consultation-convenance') && (
        <>
          {isForced && (
            <div className="mb-3">
              <Label className="text-sm sm:text-base font-medium text-vet-navy block">
                💉 Consultation de convenance (motif automatique)
              </Label>
            </div>
          )}
          <ConvenienceConsultationSelect
            selectedOptions={convenienceOptions}
            onOptionsChange={onConvenienceOptionsChange}
            customText={customText}
            onCustomTextChange={onCustomTextChange}
          />
        </>
      )}

      {/* Affichage automatique des symptômes si "symptômes ou anomalie" est sélectionné */}
      {consultationReason === 'symptomes-anomalie' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-base sm:text-lg font-semibold text-vet-navy mb-3">
              Quels symptômes vous amènent à consulter ? <span className="text-vet-navy ml-1">*</span>
            </h4>
            <SymptomSelector
              selectedSymptoms={selectedSymptoms}
              onSymptomsChange={onSymptomsChange}
              customSymptom={customSymptom}
              onCustomSymptomChange={onCustomSymptomChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalConsultationForm;
