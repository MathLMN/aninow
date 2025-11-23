
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
      <div className={`grid gap-3 transition-all duration-300 ${selectedSituation ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
        {/* Option 1 animal */}
        {(!selectedSituation || selectedSituation === '1-animal') && (
          <div 
            className={`relative flex flex-row md:flex-col items-center rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
              selectedSituation === '1-animal' 
                ? 'border-primary bg-primary/5 shadow-md p-3' 
                : 'border-gray-200 bg-white hover:border-primary/50 p-4'
            }`}
            onClick={() => handleCardClick('1-animal')}
          >
            <Dog className={`transition-all duration-300 ${
              selectedSituation === '1-animal' ? 'w-6 h-6 mr-3 md:mr-0 md:mb-2 text-primary' : 'w-8 h-8 mb-2 text-muted-foreground'
            }`} />
            <div className="flex-1 md:flex-none text-left md:text-center">
              <Label className="text-vet-navy font-semibold cursor-pointer mb-1 block">
                Je prends rendez-vous pour 1 animal
              </Label>
              {!selectedSituation && (
                <p className="text-xs text-muted-foreground animate-fade-in">
                  Pour un seul animal avec un besoin spécifique
                </p>
              )}
            </div>
            {selectedSituation === '1-animal' && (
              <button 
                className="ml-auto md:ml-0 md:absolute md:top-2 md:right-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick('1-animal');
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}
        
        {/* Option 2 animaux */}
        {(!selectedSituation || selectedSituation === '2-animaux') && (
          <div 
            className={`relative flex flex-row md:flex-col items-center rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
              selectedSituation === '2-animaux' 
                ? 'border-primary bg-primary/5 shadow-md p-3' 
                : 'border-gray-200 bg-white hover:border-primary/50 p-4'
            }`}
            onClick={() => handleCardClick('2-animaux')}
          >
            <div className={`relative transition-all duration-300 ${
              selectedSituation === '2-animaux' ? 'w-6 h-6 mr-3 md:mr-0 md:mb-2' : 'w-8 h-8 mb-2'
            }`}>
              <PawPrint className={`absolute top-0 left-0 transition-all duration-300 ${
                selectedSituation === '2-animaux' ? 'w-4 h-4 text-primary' : 'w-5 h-5 text-muted-foreground'
              }`} />
              <PawPrint className={`absolute bottom-0 right-0 transition-all duration-300 ${
                selectedSituation === '2-animaux' ? 'w-4 h-4 text-primary' : 'w-5 h-5 text-muted-foreground'
              }`} />
            </div>
            <div className="flex-1 md:flex-none text-left md:text-center">
              <Label className="text-vet-navy font-semibold cursor-pointer mb-1 block">
                Je prends rendez-vous pour 2 animaux
              </Label>
              {!selectedSituation && (
                <p className="text-xs text-muted-foreground animate-fade-in">
                  Pour 2 animaux distincts avec des besoins individuels
                </p>
              )}
            </div>
            {selectedSituation === '2-animaux' && (
              <button 
                className="ml-auto md:ml-0 md:absolute md:top-2 md:right-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick('2-animaux');
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}
        
        {/* Option portée */}
        {(!selectedSituation || selectedSituation === 'une-portee') && (
          <div 
            className={`relative flex flex-row md:flex-col items-center rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
              selectedSituation === 'une-portee' 
                ? 'border-primary bg-primary/5 shadow-md p-3' 
                : 'border-gray-200 bg-white hover:border-primary/50 p-4'
            }`}
            onClick={() => handleCardClick('une-portee')}
          >
            <Heart className={`transition-all duration-300 fill-current ${
              selectedSituation === 'une-portee' ? 'w-6 h-6 mr-3 md:mr-0 md:mb-2 text-primary' : 'w-8 h-8 mb-2 text-muted-foreground'
            }`} />
            <div className="flex-1 md:flex-none text-left md:text-center">
              <Label className="text-vet-navy font-semibold cursor-pointer mb-1 block">
                Je prends rendez-vous pour une portée chiots/chatons
              </Label>
              {!selectedSituation && (
                <p className="text-xs text-muted-foreground animate-fade-in">
                  Pour plusieurs chiots ou chatons de la même portée
                </p>
              )}
            </div>
            {selectedSituation === 'une-portee' && (
              <button 
                className="ml-auto md:ml-0 md:absolute md:top-2 md:right-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick('une-portee');
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSituationSelector;
