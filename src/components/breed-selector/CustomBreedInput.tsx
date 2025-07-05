
import React from 'react';
import { Input } from "@/components/ui/input";

interface CustomBreedInputProps {
  customBreed: string;
  onCustomBreedChange: (value: string) => void;
  isVisible: boolean;
}

const CustomBreedInput: React.FC<CustomBreedInputProps> = ({
  customBreed,
  onCustomBreedChange,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div className="mt-2">
      <Input
        type="text"
        placeholder="Précisez la race"
        value={customBreed}
        onChange={(e) => onCustomBreedChange(e.target.value)}
        className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors"
      />
    </div>
  );
};

export default CustomBreedInput;
