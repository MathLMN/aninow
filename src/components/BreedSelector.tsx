
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getBreedsByAnimalSpecies, getNoBreedLabel } from '../data/breedData';
import { useBreedSearch } from '../hooks/useBreedSearch';
import BreedSearchInput from './breed-selector/BreedSearchInput';
import BreedDropdown from './breed-selector/BreedDropdown';
import SelectedBreedDisplay from './breed-selector/SelectedBreedDisplay';
import CustomBreedInput from './breed-selector/CustomBreedInput';
import NoBreedCheckbox from './breed-selector/NoBreedCheckbox';

interface BreedSelectorProps {
  animalSpecies: string;
  selectedBreed: string;
  onBreedChange: (breed: string) => void;
  animalNumber?: number;
}

const BreedSelector: React.FC<BreedSelectorProps> = ({
  animalSpecies,
  selectedBreed,
  onBreedChange,
  animalNumber
}) => {
  const [customBreed, setCustomBreed] = useState('');

  const baseBreeds = getBreedsByAnimalSpecies(animalSpecies);
  const noBreedLabel = getNoBreedLabel(animalSpecies);

  const {
    searchTerm,
    isInputFocused,
    breedsWithOther,
    handleSearchChange,
    handleInputFocus,
    handleInputBlur,
    clearSearch
  } = useBreedSearch(baseBreeds);

  // Vérifier si l'espèce est "autre" - dans ce cas, afficher un champ libre
  const isOtherSpecies = animalSpecies === 'autre';

  // Gérer la checkbox "sans race"
  const isNoBreed = selectedBreed === 'no-breed';
  const isOtherBreed = selectedBreed === 'Autre' || (selectedBreed && !baseBreeds.includes(selectedBreed) && selectedBreed !== 'no-breed');
  
  const handleNoBreedChange = (checked: boolean) => {
    if (checked) {
      onBreedChange('no-breed');
      setCustomBreed('');
      clearSearch();
    } else {
      onBreedChange('');
    }
  };

  const handleBreedSelectChange = (breed: string) => {
    if (breed === 'Autre') {
      onBreedChange('Autre');
      setCustomBreed('');
    } else {
      onBreedChange(breed);
      setCustomBreed('');
    }
    clearSearch();
  };

  const handleCustomBreedChange = (value: string) => {
    setCustomBreed(value);
    onBreedChange(value);
  };

  const handleBreedClick = (breed: string) => {
    handleBreedSelectChange(breed);
    handleInputBlur();
  };

  // Gérer la saisie libre pour les espèces "autres"
  const handleFreeTextBreedChange = (value: string) => {
    onBreedChange(value);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm sm:text-base font-medium text-vet-navy">
        Quelle est la race ?
        <span className="text-vet-navy ml-1">*</span>
      </Label>
      
      {isOtherSpecies ? (
        // Affichage pour les espèces "autres" : champ de saisie libre
        !isNoBreed && (
          <Input
            type="text"
            placeholder="Précisez la race de votre animal"
            value={selectedBreed === 'no-breed' ? '' : selectedBreed}
            onChange={(e) => handleFreeTextBreedChange(e.target.value)}
            className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors"
          />
        )
      ) : (
        // Affichage normal pour les espèces connues (chat, chien)
        !isNoBreed && (
          <div className="relative">
            <BreedSearchInput
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            
            <BreedDropdown
              breeds={breedsWithOther}
              isVisible={isInputFocused}
              onBreedClick={handleBreedClick}
            />
          </div>
        )
      )}

      {!isOtherSpecies && (
        <>
          <SelectedBreedDisplay
            selectedBreed={selectedBreed}
            isVisible={!isNoBreed && selectedBreed && selectedBreed !== 'Autre' && !isOtherBreed}
          />
          
          <CustomBreedInput
            customBreed={customBreed}
            onCustomBreedChange={handleCustomBreedChange}
            isVisible={(selectedBreed === 'Autre' || isOtherBreed) && !isNoBreed}
          />
        </>
      )}
      
      <NoBreedCheckbox
        isChecked={isNoBreed}
        onCheckedChange={handleNoBreedChange}
        label={noBreedLabel}
        animalNumber={animalNumber}
      />
    </div>
  );
};

export default BreedSelector;
