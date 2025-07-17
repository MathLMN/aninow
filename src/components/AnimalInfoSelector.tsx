
import React from 'react';
import BreedSelector from './BreedSelector';
import AgeSelector from './AgeSelector';
import { getAnimalSpecies } from '../utils/animalSpeciesUtils';

interface AnimalInfoSelectorProps {
  animalName: string;
  animalNumber?: number;
  selectedBreed: string;
  onBreedChange: (breed: string) => void;
  selectedAge: string;
  onAgeChange: (age: string) => void;
  selectedWeight: string;
  onWeightChange: (weight: string) => void;
  selectedSex: string;
  onSexChange: (sex: string) => void;
  isLitter?: boolean;
}

const AnimalInfoSelector: React.FC<AnimalInfoSelectorProps> = ({
  animalName,
  animalNumber,
  selectedBreed,
  onBreedChange,
  selectedAge,
  onAgeChange,
  isLitter = false
}) => {
  const title = animalNumber ? `Animal ${animalNumber} - ${animalName}` : animalName;
  const animalSpecies = getAnimalSpecies(animalNumber);

  return (
    <div className="space-y-4 sm:space-y-6">
      {animalNumber && (
        <div className="bg-vet-beige/20 rounded-lg p-3 sm:p-4 border border-vet-beige/40">
          <h3 className="sm:text-lg font-semibold text-vet-blue mb-4 text-sm">
            {title}
          </h3>
          
          <div className="space-y-4">
            {/* Sélection de la race */}
            <BreedSelector
              animalSpecies={animalSpecies}
              selectedBreed={selectedBreed}
              onBreedChange={onBreedChange}
              animalNumber={animalNumber}
            />

            {/* Sélection de l'âge - masquée pour une portée */}
            {!isLitter && (
              <AgeSelector
                selectedAge={selectedAge}
                onAgeChange={onAgeChange}
              />
            )}
          </div>
        </div>
      )}
      
      {!animalNumber && (
        <>
          <h3 className="text-base sm:text-lg font-semibold text-vet-blue mb-4">
            {isLitter ? 'Informations sur la portée' : `Informations sur ${animalName}`}
          </h3>

          <div className="space-y-4">
            {/* Sélection de la race */}
            <BreedSelector
              animalSpecies={animalSpecies}
              selectedBreed={selectedBreed}
              onBreedChange={onBreedChange}
            />

            {/* Sélection de l'âge - masquée pour une portée */}
            {!isLitter && (
              <AgeSelector
                selectedAge={selectedAge}
                onAgeChange={onAgeChange}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AnimalInfoSelector;
