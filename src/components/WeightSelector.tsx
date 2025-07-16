
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WeightSelectorProps {
  selectedWeight: string;
  onWeightChange: (weight: string) => void;
}

const WeightSelector: React.FC<WeightSelectorProps> = ({
  selectedWeight,
  onWeightChange
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm sm:text-base font-medium text-vet-navy">
        Quel est son poids (en kg) ?
        <span className="text-vet-navy ml-1">*</span>
      </Label>
      <Input
        type="number"
        step="0.1"
        min="0"
        value={selectedWeight}
        onChange={(e) => onWeightChange(e.target.value)}
        placeholder="Ex: 5.2"
        className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors"
      />
    </div>
  );
};

export default WeightSelector;
