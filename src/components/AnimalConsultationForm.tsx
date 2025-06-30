
import React from 'react';
import { Label } from "@/components/ui/label";
import ConsultationReasonSelect from "@/components/ConsultationReasonSelect";
import ConvenienceConsultationSelect from "@/components/ConvenienceConsultationSelect";

interface AnimalConsultationFormProps {
  title: string;
  consultationReason: string;
  onConsultationReasonChange: (value: string) => void;
  convenienceOptions: string[];
  onConvenienceOptionsChange: (options: string[]) => void;
  customText: string;
  onCustomTextChange: (text: string) => void;
  isForced?: boolean;
  containerClassName?: string;
}

const AnimalConsultationForm: React.FC<AnimalConsultationFormProps> = ({
  title,
  consultationReason,
  onConsultationReasonChange,
  convenienceOptions,
  onConvenienceOptionsChange,
  customText,
  onCustomTextChange,
  isForced = false,
  containerClassName = ""
}) => {
  return (
    <div className={`space-y-2 sm:space-y-4 ${containerClassName}`}>
      <h3 className="text-sm sm:text-lg font-semibold text-vet-blue">{title}</h3>
      
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
    </div>
  );
};

export default AnimalConsultationForm;
