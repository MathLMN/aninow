
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Baby } from "lucide-react";

interface MultipleAnimalsOptionsProps {
  multipleAnimals: string[];
  onMultipleAnimalsChange: (option: string, checked: boolean) => void;
}

const MultipleAnimalsOptions: React.FC<MultipleAnimalsOptionsProps> = ({
  multipleAnimals,
  onMultipleAnimalsChange
}) => {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-vet-navy mb-3">
        Votre situation :
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div 
          className={`relative flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
            multipleAnimals.includes('2-animaux') 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-200 bg-white hover:border-primary/50'
          }`}
          onClick={() => onMultipleAnimalsChange('2-animaux', !multipleAnimals.includes('2-animaux'))}
        >
          <Checkbox 
            id="deux-animaux" 
            checked={multipleAnimals.includes('2-animaux')} 
            onCheckedChange={checked => onMultipleAnimalsChange('2-animaux', checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-primary" />
              <Label htmlFor="deux-animaux" className="text-vet-navy font-semibold cursor-pointer">
                Je prends rendez-vous pour 2 animaux
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Pour 2 animaux distincts avec des besoins individuels
            </p>
          </div>
        </div>
        
        <div 
          className={`relative flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
            multipleAnimals.includes('une-portee') 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-200 bg-white hover:border-primary/50'
          }`}
          onClick={() => onMultipleAnimalsChange('une-portee', !multipleAnimals.includes('une-portee'))}
        >
          <Checkbox 
            id="une-portee" 
            checked={multipleAnimals.includes('une-portee')} 
            onCheckedChange={checked => onMultipleAnimalsChange('une-portee', checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Baby className="w-5 h-5 text-primary" />
              <Label htmlFor="une-portee" className="text-vet-navy font-semibold cursor-pointer">
                Je prends rendez-vous pour une portée chiots/chatons
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              Pour plusieurs chiots ou chatons de la même portée
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleAnimalsOptions;
