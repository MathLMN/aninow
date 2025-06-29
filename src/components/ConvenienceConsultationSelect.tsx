
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ConvenienceConsultationSelectProps {
  selectedOptions: string[];
  onOptionsChange: (options: string[]) => void;
}

const ConvenienceConsultationSelect: React.FC<ConvenienceConsultationSelectProps> = ({
  selectedOptions,
  onOptionsChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredOptions = convenienceOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Rechercher une option"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 sm:h-12"
        />
      </div>

      {/* Options list */}
      <div className="max-h-48 overflow-y-auto space-y-2">
        {filteredOptions.map((option) => (
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
