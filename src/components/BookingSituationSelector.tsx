
import React from 'react';
import { Label } from "@/components/ui/label";
import { Dog, PawPrint, Heart } from "lucide-react";

interface BookingSituationSelectorProps {
  selectedSituation: string;
  onSituationChange: (situation: string) => void;
}

const BookingSituationSelector: React.FC<BookingSituationSelectorProps> = ({
  selectedSituation,
  onSituationChange
}) => {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-vet-navy mb-3">
        Votre situation :
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Option 1 animal */}
        <div 
          className={`relative flex flex-col items-center p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
            selectedSituation === '1-animal' 
              ? 'border-primary bg-primary/5 shadow-md' 
              : 'border-gray-200 bg-white hover:border-primary/50'
          }`}
          onClick={() => onSituationChange('1-animal')}
        >
          <Dog className={`w-8 h-8 mb-2 ${selectedSituation === '1-animal' ? 'text-primary' : 'text-muted-foreground'}`} />
          <Label className="text-vet-navy font-semibold cursor-pointer text-center mb-1">
            Je prends rendez-vous pour 1 animal
          </Label>
          <p className="text-xs text-muted-foreground text-center">
            Pour un seul animal avec un besoin spécifique
          </p>
        </div>
        
        {/* Option 2 animaux */}
        <div 
          className={`relative flex flex-col items-center p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
            selectedSituation === '2-animaux' 
              ? 'border-primary bg-primary/5 shadow-md' 
              : 'border-gray-200 bg-white hover:border-primary/50'
          }`}
          onClick={() => onSituationChange('2-animaux')}
        >
          <div className="relative w-8 h-8 mb-2">
            <PawPrint className={`absolute w-5 h-5 top-0 left-0 ${selectedSituation === '2-animaux' ? 'text-primary' : 'text-muted-foreground'}`} />
            <PawPrint className={`absolute w-5 h-5 bottom-0 right-0 ${selectedSituation === '2-animaux' ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <Label className="text-vet-navy font-semibold cursor-pointer text-center mb-1">
            Je prends rendez-vous pour 2 animaux
          </Label>
          <p className="text-xs text-muted-foreground text-center">
            Pour 2 animaux distincts avec des besoins individuels
          </p>
        </div>
        
        {/* Option portée */}
        <div 
          className={`relative flex flex-col items-center p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
            selectedSituation === 'une-portee' 
              ? 'border-primary bg-primary/5 shadow-md' 
              : 'border-gray-200 bg-white hover:border-primary/50'
          }`}
          onClick={() => onSituationChange('une-portee')}
        >
          <Heart className={`w-8 h-8 mb-2 ${selectedSituation === 'une-portee' ? 'text-primary' : 'text-muted-foreground'} fill-current`} />
          <Label className="text-vet-navy font-semibold cursor-pointer text-center mb-1">
            Je prends rendez-vous pour une portée chiots/chatons
          </Label>
          <p className="text-xs text-muted-foreground text-center">
            Pour plusieurs chiots ou chatons de la même portée
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSituationSelector;
