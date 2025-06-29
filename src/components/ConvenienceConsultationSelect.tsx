
import React, { useState } from 'react';
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
    { value: 'bilan-annuel-vaccination', label: 'Bilan annuel / vaccination', color: 'bg-red-100 text-red-600 border-red-200' },
    { value: 'coupe-griffes', label: 'Coupe de griffes', color: 'bg-orange-100 text-orange-600 border-orange-200' },
    { value: 'controle', label: 'Contrôle', color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    { value: 'bilan-senior', label: 'Bilan sénior', color: 'bg-green-100 text-green-600 border-green-200' },
    { value: 'premiere-consultation', label: '1ère consultation chiot/ chaton', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { value: 'castration-sterilisation', label: 'Castration/ Stérilisation (pré-opératoire)', color: 'bg-purple-100 text-purple-600 border-purple-200' },
    { value: 'detartrage-extractions', label: 'Détartrage/ Extractions dentaires (pré-opératoire)', color: 'bg-pink-100 text-pink-600 border-pink-200' },
    { value: 'autre', label: 'Autre (Précisez)', color: 'bg-gray-100 text-gray-600 border-gray-200' }
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

  // Filter out selected options from the available options
  const availableOptions = convenienceOptions.filter(option => !selectedOptions.includes(option.value));

  return (
    <div className="space-y-3 sm:space-y-4 border-2 border-vet-blue/20 rounded-xl p-3 sm:p-4 bg-white/50 backdrop-blur-sm">
      <Label className="text-base sm:text-lg font-semibold text-vet-navy block leading-tight">
        Ajoutez un ou plusieurs motifs *
      </Label>

      {/* Selected options as tags at the top */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((selectedValue) => {
            const option = convenienceOptions.find(opt => opt.value === selectedValue);
            if (!option) return null;
            
            return (
              <div
                key={selectedValue}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${option.color}`}
              >
                <span className="leading-tight">{option.label}</span>
                <button
                  onClick={() => handleRemoveOption(selectedValue)}
                  className="hover:bg-black/10 rounded-full p-0.5 flex-shrink-0 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Vertical list of available options as tags */}
      <div className="space-y-2">
        {availableOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionToggle(option.value)}
            className={`w-full text-left px-3 py-2 rounded-full border text-sm font-medium transition-all hover:shadow-sm ${option.color}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Selected count */}
      {selectedOptions.length > 0 && (
        <div className="text-sm sm:text-base text-vet-sage font-medium text-center bg-vet-sage/10 p-2 rounded-lg">
          ✅ {selectedOptions.length} option{selectedOptions.length > 1 ? 's' : ''} sélectionnée{selectedOptions.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default ConvenienceConsultationSelect;
