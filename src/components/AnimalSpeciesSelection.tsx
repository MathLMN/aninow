
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SelectionButton from './SelectionButton';

interface AnimalSpeciesSelectionProps {
  species: string;
  customSpecies: string;
  onSpeciesChange: (value: string, selected: boolean) => void;
  onCustomSpeciesChange: (value: string) => void;
  title: string;
  prefix?: string;
}

const AnimalSpeciesSelection: React.FC<AnimalSpeciesSelectionProps> = ({
  species,
  customSpecies,
  onSpeciesChange,
  onCustomSpeciesChange,
  title,
  prefix = ''
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-vet-navy">
        {title}
      </Label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SelectionButton 
          id={`${prefix}chat`} 
          value="chat" 
          isSelected={species === 'chat'} 
          onSelect={onSpeciesChange}
        >
          Chat
        </SelectionButton>
        <SelectionButton 
          id={`${prefix}chien`} 
          value="chien" 
          isSelected={species === 'chien'} 
          onSelect={onSpeciesChange}
        >
          Chien
        </SelectionButton>
        <SelectionButton 
          id={`${prefix}autre`} 
          value="autre" 
          isSelected={species === 'autre'} 
          onSelect={onSpeciesChange}
        >
          Autre (précisez)
        </SelectionButton>
      </div>

      {species === 'autre' && (
        <div className="mt-4">
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
        </div>
      )}
    </div>
  );
};

export default AnimalSpeciesSelection;
