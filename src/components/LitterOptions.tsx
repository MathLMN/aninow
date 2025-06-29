
import React from 'react';
import { Label } from "@/components/ui/label";
import SelectionButton from './SelectionButton';

interface LitterOptionsProps {
  vaccinationType?: string;
  onVaccinationTypeChange: (value: string, selected: boolean) => void;
}

const LitterOptions: React.FC<LitterOptionsProps> = ({
  vaccinationType,
  onVaccinationTypeChange
}) => {
  return (
    <div className="space-y-4 pl-4 border-l-2 border-vet-sage/30">
      <Label className="text-lg font-semibold text-vet-navy">
        Vous souhaitez *
      </Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SelectionButton 
          id="vacc-id" 
          value="vaccinations-identifications" 
          isSelected={vaccinationType === 'vaccinations-identifications'} 
          onSelect={onVaccinationTypeChange}
        >
          Vaccinations et identifications
        </SelectionButton>
        <SelectionButton 
          id="vacc-only" 
          value="vaccinations-seulement" 
          isSelected={vaccinationType === 'vaccinations-seulement'} 
          onSelect={onVaccinationTypeChange}
        >
          Vaccinations uniquement
        </SelectionButton>
      </div>
    </div>
  );
};

export default LitterOptions;
