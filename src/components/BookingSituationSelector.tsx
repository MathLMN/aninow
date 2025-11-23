
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
  const handleCardClick = (situation: string) => {
    // Permettre de désélectionner en cliquant à nouveau
    if (selectedSituation === situation) {
      onSituationChange('');
    } else {
      onSituationChange(situation);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-vet-navy mb-2">
        Votre situation :
      </p>
      <div className={`grid grid-cols-1 gap-3 transition-all duration-300 ${selectedSituation ? 'md:grid-cols-3 md:gap-2' : 'md:grid-cols-3 md:gap-3'}`}>
        {/* Option 1 animal */}
        <div 
          className={`relative flex flex-col items-center rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
            selectedSituation === '1-animal' 
              ? 'border-primary bg-primary/5 shadow-md p-3 scale-[0.98]' 
              : selectedSituation 
              ? 'border-gray-200 bg-white/50 hover:border-primary/50 p-3 opacity-60 hover:opacity-100'
              : 'border-gray-200 bg-white hover:border-primary/50 p-4'
          }`}
          onClick={() => handleCardClick('1-animal')}
        >
          <Dog className={`transition-all duration-300 mb-2 ${
            selectedSituation === '1-animal' ? 'w-7 h-7 text-primary' : 'w-8 h-8 text-muted-foreground'
          }`} />
          <Label className={`text-vet-navy font-semibold cursor-pointer text-center transition-all duration-300 ${
            selectedSituation && selectedSituation !== '1-animal' ? 'text-sm mb-0' : 'mb-1'
          }`}>
            Je prends rendez-vous pour 1 animal
          </Label>
          {(!selectedSituation || selectedSituation === '1-animal') && (
            <p className="text-xs text-muted-foreground text-center animate-fade-in">
              Pour un seul animal avec un besoin spécifique
            </p>
          )}
        </div>
        
        {/* Option 2 animaux */}
        <div 
          className={`relative flex flex-col items-center rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
            selectedSituation === '2-animaux' 
              ? 'border-primary bg-primary/5 shadow-md p-3 scale-[0.98]' 
              : selectedSituation 
              ? 'border-gray-200 bg-white/50 hover:border-primary/50 p-3 opacity-60 hover:opacity-100'
              : 'border-gray-200 bg-white hover:border-primary/50 p-4'
          }`}
          onClick={() => handleCardClick('2-animaux')}
        >
          <div className={`relative mb-2 transition-all duration-300 ${
            selectedSituation === '2-animaux' ? 'w-7 h-7' : 'w-8 h-8'
          }`}>
            <PawPrint className={`absolute top-0 left-0 transition-all duration-300 ${
              selectedSituation === '2-animaux' ? 'w-4 h-4 text-primary' : 'w-5 h-5 text-muted-foreground'
            }`} />
            <PawPrint className={`absolute bottom-0 right-0 transition-all duration-300 ${
              selectedSituation === '2-animaux' ? 'w-4 h-4 text-primary' : 'w-5 h-5 text-muted-foreground'
            }`} />
          </div>
          <Label className={`text-vet-navy font-semibold cursor-pointer text-center transition-all duration-300 ${
            selectedSituation && selectedSituation !== '2-animaux' ? 'text-sm mb-0' : 'mb-1'
          }`}>
            Je prends rendez-vous pour 2 animaux
          </Label>
          {(!selectedSituation || selectedSituation === '2-animaux') && (
            <p className="text-xs text-muted-foreground text-center animate-fade-in">
              Pour 2 animaux distincts avec des besoins individuels
            </p>
          )}
        </div>
        
        {/* Option portée */}
        <div 
          className={`relative flex flex-col items-center rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
            selectedSituation === 'une-portee' 
              ? 'border-primary bg-primary/5 shadow-md p-3 scale-[0.98]' 
              : selectedSituation 
              ? 'border-gray-200 bg-white/50 hover:border-primary/50 p-3 opacity-60 hover:opacity-100'
              : 'border-gray-200 bg-white hover:border-primary/50 p-4'
          }`}
          onClick={() => handleCardClick('une-portee')}
        >
          <Heart className={`transition-all duration-300 mb-2 fill-current ${
            selectedSituation === 'une-portee' ? 'w-7 h-7 text-primary' : 'w-8 h-8 text-muted-foreground'
          }`} />
          <Label className={`text-vet-navy font-semibold cursor-pointer text-center transition-all duration-300 ${
            selectedSituation && selectedSituation !== 'une-portee' ? 'text-sm mb-0' : 'mb-1'
          }`}>
            Je prends rendez-vous pour une portée chiots/chatons
          </Label>
          {(!selectedSituation || selectedSituation === 'une-portee') && (
            <p className="text-xs text-muted-foreground text-center animate-fade-in">
              Pour plusieurs chiots ou chatons de la même portée
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSituationSelector;
