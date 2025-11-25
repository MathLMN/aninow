
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface ConvenienceOption {
  value: string;
  label: string;
  color: string;
  isActive?: boolean;
  isOther?: boolean;
  helpMessage?: string;
}

interface ConvenienceConsultationSelectProps {
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
  customText?: string;
  onCustomTextChange?: (text: string) => void;
  clinicOptions?: ConvenienceOption[];
}

const DEFAULT_OPTIONS: ConvenienceOption[] = [
  { value: 'bilan-annuel-vaccination', label: 'Bilan annuel / vaccination', color: 'bg-red-100 text-red-600 border-red-200', isActive: true },
  { value: 'coupe-griffes', label: 'Coupe de griffes', color: 'bg-orange-100 text-orange-600 border-orange-200', isActive: true },
  { value: 'controle', label: 'Contrôle', color: 'bg-yellow-100 text-yellow-600 border-yellow-200', isActive: true },
  { value: 'bilan-senior', label: 'Bilan sénior', color: 'bg-green-100 text-green-600 border-green-200', isActive: true },
  { value: 'premiere-consultation', label: '1ère consultation chiot/chaton', color: 'bg-blue-100 text-blue-600 border-blue-200', isActive: true },
  { value: 'castration-sterilisation', label: 'Castration/Stérilisation (pré-opératoire)', color: 'bg-purple-100 text-purple-600 border-purple-200', isActive: true },
  { value: 'detartrage-extractions', label: 'Détartrage/Extractions dentaires (pré-opératoire)', color: 'bg-pink-100 text-pink-600 border-pink-200', isActive: true },
  { value: 'autre', label: 'Autre (Précisez)', color: 'bg-gray-100 text-gray-600 border-gray-200', isActive: true, isOther: true }
];

const ConvenienceConsultationSelect: React.FC<ConvenienceConsultationSelectProps> = ({
  selectedOptions,
  onOptionsChange,
  customText = '',
  onCustomTextChange,
  clinicOptions
}) => {
  // Utiliser les options de la clinique si fournies, sinon les options par défaut
  // Filtrer les options inactives et trier pour que "Autre" soit toujours en dernier
  const activeOptions = (clinicOptions || DEFAULT_OPTIONS)
    .filter(opt => opt.isActive !== false)
    .sort((a, b) => {
      if (a.isOther) return 1;
      if (b.isOther) return -1;
      return 0;
    });

  const convenienceOptions = activeOptions;

  const handleOptionToggle = (value: string) => {
    const newOptions = selectedOptions.includes(value)
      ? selectedOptions.filter(opt => opt !== value)
      : [...selectedOptions, value];
    onOptionsChange(newOptions);
    
    // Clear custom text if "autre" is deselected
    if (value === 'autre' && !newOptions.includes('autre') && onCustomTextChange) {
      onCustomTextChange('');
    }
  };

  const handleRemoveOption = (value: string) => {
    const newOptions = selectedOptions.filter(opt => opt !== value);
    onOptionsChange(newOptions);
    
    // Clear custom text if "autre" is removed
    if (value === 'autre' && onCustomTextChange) {
      onCustomTextChange('');
    }
  };

  const handleCustomTextChange = (value: string) => {
    if (onCustomTextChange) {
      onCustomTextChange(value);
    }
  };

  // Filter out selected options from the available options
  const availableOptions = convenienceOptions.filter(option => !selectedOptions.includes(option.value));

  return (
    <div className="space-y-2 sm:space-y-4 border-2 border-vet-blue/20 rounded-xl p-2 sm:p-4 bg-white/50 backdrop-blur-sm">
      <Label className="text-sm sm:text-lg font-semibold text-vet-navy block leading-tight">
        Ajoutez un ou plusieurs motifs *
      </Label>

      {/* Selected options as tags at the top */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {selectedOptions.map((selectedValue) => {
            const option = convenienceOptions.find(opt => opt.value === selectedValue);
            if (!option) return null;
            
            return (
              <div
                key={selectedValue}
                className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs sm:text-sm font-medium ${option.color}`}
              >
                <span className="leading-tight">{option.label}</span>
                <button
                  onClick={() => handleRemoveOption(selectedValue)}
                  className="hover:bg-black/10 rounded-full p-0.5 flex-shrink-0 transition-colors"
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Help messages for selected options */}
      {selectedOptions.map((selectedValue) => {
        const option = convenienceOptions.find(opt => opt.value === selectedValue);
        if (!option?.helpMessage) return null;
        
        return (
          <Alert key={`help-${selectedValue}`} className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              {option.helpMessage}
            </AlertDescription>
          </Alert>
        );
      })}

      {/* Custom text input for "autre" option */}
      {selectedOptions.includes('autre') && (
        <div className="animate-fade-in space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-vet-navy">
            Précisez le motif de consultation
          </Label>
          <Input
            type="text"
            placeholder="Tapez votre motif de consultation..."
            value={customText}
            onChange={(e) => handleCustomTextChange(e.target.value)}
            className="w-full h-10 sm:h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg focus:border-vet-sage focus:outline-none"
          />
        </div>
      )}

      {/* Vertical list of available options as tags */}
      <div className="space-y-1 sm:space-y-2">
        {availableOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionToggle(option.value)}
            className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-medium transition-all hover:shadow-sm ${option.color}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Selected count */}
      {selectedOptions.length > 0 && (
        <div className="text-xs sm:text-base text-vet-sage font-medium text-center bg-vet-sage/10 p-1.5 sm:p-2 rounded-lg">
          ✅ {selectedOptions.length} option{selectedOptions.length > 1 ? 's' : ''} sélectionnée{selectedOptions.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default ConvenienceConsultationSelect;
