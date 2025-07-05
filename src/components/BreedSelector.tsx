
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
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

  return (
    <div className="space-y-2">
      <Label className="text-sm sm:text-base font-medium text-vet-navy">
        Quelle est la race ?
        <span className="text-vet-navy ml-1">*</span>
      </Label>
      
      {!isNoBreed && (
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
      )}

      <SelectedBreedDisplay
        selectedBreed={selectedBreed}
        isVisible={!isNoBreed && selectedBreed && selectedBreed !== 'Autre' && !isOtherBreed}
      />
      
      <CustomBreedInput
        customBreed={customBreed}
        onCustomBreedChange={handleCustomBreedChange}
        isVisible={(selectedBreed === 'Autre' || isOtherBreed) && !isNoBreed}
      />
      
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
