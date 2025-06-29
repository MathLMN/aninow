
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ChevronDown } from "lucide-react";

interface ConvenienceConsultationSelectProps {
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
}

const ConvenienceConsultationSelect: React.FC<ConvenienceConsultationSelectProps> = ({
  selectedOptions,
  onOptionsChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

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

      {/* Menu déroulant */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-11 sm:h-12 justify-between text-sm sm:text-base bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <span className="text-left truncate">
              {selectedOptions.length === 0 
                ? "Sélectionnez un ou plusieurs motifs" 
                : `${selectedOptions.length} motif${selectedOptions.length > 1 ? 's' : ''} sélectionné${selectedOptions.length > 1 ? 's' : ''}`
              }
            </span>
            <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white border border-gray-300 shadow-lg z-50" align="start">
          <div className="max-h-64 overflow-y-auto">
            {convenienceOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleOptionToggle(option.value)}
              >
                <Checkbox
                  checked={selectedOptions.includes(option.value)}
                  onChange={() => {}}
                  className="pointer-events-none"
                />
                <label className="text-sm cursor-pointer flex-1 leading-tight">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected options as tags - Mobile optimized */}
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
