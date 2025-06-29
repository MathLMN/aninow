
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ConvenienceConsultationSelectProps {
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
}

const ConvenienceConsultationSelect: React.FC<ConvenienceConsultationSelectProps> = ({
  selectedOptions,
  onOptionsChange
}) => {
  const convenienceOptions = [
    { value: 'bilan-annuel-vaccination', label: 'Bilan annuel / vaccination' },
    { value: 'coupe-griffes', label: 'Coupe de griffes' },
    { value: 'controle', label: 'Contrôle' },
    { value: 'bilan-senior', label: 'Bilan sénior' },
    { value: 'premiere-consultation', label: '1ère consultation chiot/ chaton' },
    { value: 'castration-sterilisation', label: 'Castration/ Stérilisation (pré-opératoire)' },
    { value: 'detartrage-extractions', label: 'Détartrage/ Extractions dentaires (pré-opératoire)' },
    { value: 'autre', label: 'Autre (Précisez)' }
  ];

  const handleOptionToggle = (value: string) => {
    const newOptions = selectedOptions.includes(value)
      ? selectedOptions.filter(opt => opt !== value)
      : [...selectedOptions, value];
    onOptionsChange(newOptions);
  };

  return (
    <div className="space-y-4 border border-gray-300 rounded-md p-4 bg-white">
      <Label className="text-base sm:text-lg font-semibold text-vet-navy block">
        Ajoutez un ou plusieurs motifs *
      </Label>

      {/* Options list */}
      <div className="max-h-48 overflow-y-auto space-y-2">
        {convenienceOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <Checkbox
              id={option.value}
              checked={selectedOptions.includes(option.value)}
              onCheckedChange={() => handleOptionToggle(option.value)}
            />
            <Label
              htmlFor={option.value}
              className="flex-1 cursor-pointer text-sm sm:text-base"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>

      {/* Selected count */}
      {selectedOptions.length > 0 && (
        <div className="text-sm text-vet-navy">
          {selectedOptions.length} option{selectedOptions.length > 1 ? 's' : ''} sélectionnée{selectedOptions.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default ConvenienceConsultationSelect;
