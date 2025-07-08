
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SelectionButton from './SelectionButton';
import AnimalNameInput from './AnimalNameInput';
import { useIsMobile } from '@/hooks/use-mobile';

interface AnimalSpeciesSelectionProps {
  species: string;
  customSpecies: string;
  onSpeciesChange: (value: string, selected: boolean) => void;
  onCustomSpeciesChange: (value: string) => void;
  title: string;
  prefix?: string;
  // Nouvelles props pour le nom de l'animal
  animalName?: string;
  onAnimalNameChange?: (value: string) => void;
  showNameInput?: boolean;
  nameInputId?: string;
  nameInputPlaceholder?: string;
}

const AnimalSpeciesSelection: React.FC<AnimalSpeciesSelectionProps> = ({
  species,
  customSpecies,
  onSpeciesChange,
  onCustomSpeciesChange,
  title,
  prefix = '',
  animalName = '',
  onAnimalNameChange,
  showNameInput = false,
  nameInputId = '',
  nameInputPlaceholder = ''
}) => {
  const isMobile = useIsMobile();
  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-vet-navy">
        {title}
      </Label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <SelectionButton 
            id={`${prefix}chat`} 
            value="chat" 
            isSelected={species === 'chat'} 
            onSelect={onSpeciesChange}
            className="w-full h-full"
          >
            Chat
          </SelectionButton>
          {/* Input nom mobile - sous Chat */}
          {isMobile && showNameInput && species === 'chat' && onAnimalNameChange && (
            <div className="animate-fade-in mt-3">
              <AnimalNameInput
                name={animalName}
                onNameChange={onAnimalNameChange}
                placeholder={nameInputPlaceholder}
                id={nameInputId}
              />
            </div>
          )}
        </div>
        
        <div>
          <SelectionButton 
            id={`${prefix}chien`} 
            value="chien" 
            isSelected={species === 'chien'} 
            onSelect={onSpeciesChange}
            className="w-full h-full"
          >
            Chien
          </SelectionButton>
          {/* Input nom mobile - sous Chien */}
          {isMobile && showNameInput && species === 'chien' && onAnimalNameChange && (
            <div className="animate-fade-in mt-3">
              <AnimalNameInput
                name={animalName}
                onNameChange={onAnimalNameChange}
                placeholder={nameInputPlaceholder}
                id={nameInputId}
              />
            </div>
          )}
        </div>
        
        <div>
          <SelectionButton 
            id={`${prefix}autre`} 
            value="autre" 
            isSelected={species === 'autre'} 
            onSelect={onSpeciesChange}
            className="w-full h-full"
          >
            Autre (précisez)
          </SelectionButton>
        </div>
      </div>

      {species === 'autre' && (
        <div className="mt-4 space-y-3">
          <Label htmlFor={`${prefix}custom-species`} className="text-vet-navy">
            Précisez l'espèce {prefix ? 'du 2e animal' : 'de votre animal'} *
          </Label>
          <Input 
            id={`${prefix}custom-species`} 
            value={customSpecies} 
            onChange={e => onCustomSpeciesChange(e.target.value)} 
            placeholder={`Écrivez l'espèce ${prefix ? 'du 2e animal' : 'de votre animal'}`} 
            className="mt-2" 
          />
          {/* Input nom mobile/desktop - pour "Autre" */}
          {showNameInput && species === 'autre' && onAnimalNameChange && (
            <div className="animate-fade-in">
              <AnimalNameInput
                name={animalName}
                onNameChange={onAnimalNameChange}
                placeholder={nameInputPlaceholder}
                id={nameInputId}
              />
            </div>
          )}
        </div>
      )}

      {/* Input nom desktop - pour Chat et Chien */}
      {!isMobile && showNameInput && (species === 'chat' || species === 'chien') && onAnimalNameChange && (
        <div className="animate-fade-in">
          <AnimalNameInput
            name={animalName}
            onNameChange={onAnimalNameChange}
            placeholder={nameInputPlaceholder}
            id={nameInputId}
          />
        </div>
      )}
    </div>
  );
};

export default AnimalSpeciesSelection;
