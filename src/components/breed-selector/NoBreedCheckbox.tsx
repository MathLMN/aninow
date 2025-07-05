
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface NoBreedCheckboxProps {
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  animalNumber?: number;
}

const NoBreedCheckbox: React.FC<NoBreedCheckboxProps> = ({
  isChecked,
  onCheckedChange,
  label,
  animalNumber
}) => {
  return (
    <div className="flex items-center space-x-2 mt-3">
      <Checkbox 
        id={`no-breed-${animalNumber || 'single'}`}
        checked={isChecked}
        onCheckedChange={onCheckedChange}
      />
      <Label 
        htmlFor={`no-breed-${animalNumber || 'single'}`}
        className="text-sm text-vet-navy cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
};

export default NoBreedCheckbox;
