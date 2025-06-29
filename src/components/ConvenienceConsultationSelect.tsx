
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
    { value: 'bilan-annuel-vaccination', label: 'Bilan annuel / vaccination', color: 'bg-red-100 text-red-700 border-red-200', emoji: '💉' },
    { value: 'controle', label: 'Contrôle', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', emoji: '🔍' },
    { value: 'coupe-griffes', label: 'Coupe de griffes', color: 'bg-orange-100 text-orange-700 border-orange-200', emoji: '✂️' },
    { value: 'bilan-senior', label: 'Bilan sénior', color: 'bg-green-100 text-green-700 border-green-200', emoji: '👴' },
    { value: 'premiere-consultation', label: '1ère consultation chiot/ chaton', color: 'bg-blue-100 text-blue-700 border-blue-200', emoji: '🐱' },
    { value: 'castration-sterilisation', label: 'Castration/ Stérilisation (pré-opératoire)', color: 'bg-purple-100 text-purple-700 border-purple-200', emoji: '🏥' },
    { value: 'detartrage-extractions', label: 'Détartrage/ Extractions dentaires (pré-opératoire)', color: 'bg-pink-100 text-pink-700 border-pink-200', emoji: '🦷' },
    { value: 'autre', label: 'Autre (Précisez)', color: 'bg-gray-100 text-gray-700 border-gray-200', emoji: '📝' }
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
    <div className="space-y-3 sm:space-y-4 border-2 border-vet-blue/20 rounded-xl p-3 sm:p-4 bg-white/50 backdrop-blur-sm">
      <Label className="text-base sm:text-lg font-semibold text-vet-navy block leading-tight">
        Ajoutez un ou plusieurs motifs *
      </Label>

      {/* Menu déroulant mobile-first */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-12 sm:h-11 justify-between text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            <span className="text-left truncate flex items-center">
              {selectedOptions.length === 0 
                ? "Sélectionnez un ou plusieurs motifs" 
                : `${selectedOptions.length} motif${selectedOptions.length > 1 ? 's' : ''} sélectionné${selectedOptions.length > 1 ? 's' : ''}`
              }
            </span>
            <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white border-2 border-gray-200 shadow-xl z-50 rounded-lg" align="start">
          <div className="max-h-72 overflow-y-auto">
            {convenienceOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-4 hover:bg-vet-beige/30 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors active:bg-vet-beige/50"
                onClick={() => handleOptionToggle(option.value)}
              >
                <Checkbox
                  checked={selectedOptions.includes(option.value)}
                  onChange={() => {}}
                  className="pointer-events-none"
                />
                <span className="text-lg mr-2">{option.emoji}</span>
                <label className="text-base cursor-pointer flex-1 leading-tight">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected options as tags - Mobile optimized */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((selectedValue) => {
            const option = convenienceOptions.find(opt => opt.value === selectedValue);
            if (!option) return null;
            
            return (
              <div
                key={selectedValue}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 text-sm font-medium ${option.color} shadow-sm`}
              >
                <span className="text-base">{option.emoji}</span>
                <span className="leading-tight">{option.label}</span>
                <button
                  onClick={() => handleRemoveOption(selectedValue)}
                  className="hover:bg-black/10 rounded-full p-1 flex-shrink-0 transition-colors active:scale-90"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected count - Mobile optimized */}
      {selectedOptions.length > 0 && (
        <div className="text-sm sm:text-base text-vet-sage font-medium text-center bg-vet-sage/10 p-2 rounded-lg">
          ✅ {selectedOptions.length} option{selectedOptions.length > 1 ? 's' : ''} sélectionnée{selectedOptions.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default ConvenienceConsultationSelect;
