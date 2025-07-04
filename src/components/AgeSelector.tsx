
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AgeSelectorProps {
  selectedAge: string;
  onAgeChange: (age: string) => void;
}

const AGES = ['Moins de 6 mois', '6 mois à 1 an', '1 à 2 ans', '2 à 5 ans', '5 à 8 ans', '8 à 12 ans', 'Plus de 12 ans'];

const AgeSelector: React.FC<AgeSelectorProps> = ({
  selectedAge,
  onAgeChange
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm sm:text-base font-medium text-vet-navy">
        Quel est son âge ?
        <span className="text-vet-navy ml-1">*</span>
      </Label>
      <Select value={selectedAge} onValueChange={onAgeChange}>
        <SelectTrigger className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors">
          <SelectValue placeholder="Écrivez ou sélectionnez parmi la liste" />
        </SelectTrigger>
        <SelectContent>
          {AGES.map(age => (
            <SelectItem key={age} value={age}>
              {age}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AgeSelector;
