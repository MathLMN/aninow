
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface MultipleAnimalsOptionsProps {
  multipleAnimals: string[];
  onMultipleAnimalsChange: (option: string, checked: boolean) => void;
}

const MultipleAnimalsOptions: React.FC<MultipleAnimalsOptionsProps> = ({
  multipleAnimals,
  onMultipleAnimalsChange
}) => {
  return (
    <div className="space-y-4">
      {multipleAnimals.length === 0 && (
        <div>
          <p className="text-vet-blue italic mb-2 text-sm">
            Cochez l'une des options ci-dessous uniquement{' '}
            <span className="text-vet-blue italic">si vous venez avec plusieurs animaux.</span>
          </p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:gap-0 gap-1">
        <div className="flex items-center space-x-3 md:mr-8">
          <Checkbox 
            id="deux-animaux" 
            checked={multipleAnimals.includes('2-animaux')} 
            onCheckedChange={checked => onMultipleAnimalsChange('2-animaux', checked as boolean)} 
          />
          <Label htmlFor="deux-animaux" className="text-vet-navy cursor-pointer">
            2ème animal
          </Label>
        </div>
        
        <div className="flex items-center space-x-3">
          <Checkbox 
            id="une-portee" 
            checked={multipleAnimals.includes('une-portee')} 
            onCheckedChange={checked => onMultipleAnimalsChange('une-portee', checked as boolean)} 
          />
          <Label htmlFor="une-portee" className="text-vet-navy cursor-pointer">
            Une portée
          </Label>
        </div>
      </div>
    </div>
  );
};

export default MultipleAnimalsOptions;
