
import React from 'react';
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface ConvenienceConsultationSelectProps {
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
}

const ConvenienceConsultationSelect: React.FC<ConvenienceConsultationSelectProps> = ({
  selectedOptions,
  onOptionsChange
}) => {
  const convenienceOptions = [
    { value: 'bilan-annuel-vaccination', label: 'Bilan annuel / vaccination', color: 'bg-red-100 text-red-700 border-red-200' },
    { value: 'controle', label: 'Contrôle', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'coupe-griffes', label: 'Coupe de griffes', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { value: 'bilan-senior', label: 'Bilan sénior', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'premiere-consultation', label: '1ère consultation chiot/ chaton', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'castration-sterilisation', label: 'Castration/ Stérilisation (pré-opératoire)', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { value: 'detartrage-extractions', label: 'Détartrage/ Extractions dentaires (pré-opératoire)', color: 'bg-pink-100 text-pink-700 border-pink-200' },
    { value: 'autre', label: 'Autre (Précisez)', color: 'bg-gray-100 text-gray-700 border-gray-200' }
  ];

  const handleOptionToggle = (value: string) => {
    const newOptions = selectedOptions.includes(value)
      ? selectedOptions.filter(opt => opt !== value)
      : [...selectedOptions, value];
    onOptionsChange(newOptions);
  };

  const handleRemoveOption = (value: string) => {
    const newOptions = selectedOptions.filter(opt => opt !== value);
    onOptionsChange(newOptions);
  };

  return (
    <div className="space-y-3 sm:space-y-4 border border-gray-300 rounded-md p-3 sm:p-4 bg-white">
      <Label className="text-sm sm:text-lg font-semibold text-vet-navy block">
        Ajoutez un ou plusieurs motifs *
      </Label>

      {/* Selected options as tags at the top - Mobile optimized */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {selectedOptions.map((selectedValue) => {
            const option = convenienceOptions.find(opt => opt.value === selectedValue);
            if (!option) return null;
            
            return (
              <div
                key={selectedValue}
                className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 rounded-full border text-xs sm:text-sm ${option.color}`}
              >
                <span className="leading-tight">{option.label}</span>
                <button
                  onClick={() => handleRemoveOption(selectedValue)}
                  className="hover:bg-black/10 rounded-full p-0.5 flex-shrink-0"
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Available options as colored badges - Mobile optimized */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {convenienceOptions.map((option) => {
          const isSelected = selectedOptions.includes(option.value);
          
          return (
            <button
              key={option.value}
              onClick={() => handleOptionToggle(option.value)}
              disabled={isSelected}
              className={`inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-full border text-xs sm:text-sm transition-all cursor-pointer leading-tight ${
                isSelected 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-md active:scale-95'
              } ${option.color}`}
            >
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected count - Mobile optimized */}
      {selectedOptions.length > 0 && (
        <div className="text-xs sm:text-sm text-vet-navy">
          {selectedOptions.length} option{selectedOptions.length > 1 ? 's' : ''} sélectionnée{selectedOptions.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default ConvenienceConsultationSelect;
