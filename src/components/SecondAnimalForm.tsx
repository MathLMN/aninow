
import React from 'react';
import AnimalSpeciesSelection from './AnimalSpeciesSelection';
import AnimalNameInput from './AnimalNameInput';

interface FormData {
  secondAnimalSpecies?: string;
  secondAnimalName?: string;
  secondCustomSpecies?: string;
}

interface SecondAnimalFormProps {
  formData: FormData;
  onSecondAnimalSpeciesChange: (value: string, selected: boolean) => void;
  onSecondCustomSpeciesChange: (value: string) => void;
  onSecondAnimalNameChange: (value: string) => void;
  showSecondNameInput: boolean;
}

const SecondAnimalForm: React.FC<SecondAnimalFormProps> = ({
  formData,
  onSecondAnimalSpeciesChange,
  onSecondCustomSpeciesChange,
  onSecondAnimalNameChange,
  showSecondNameInput
}) => {
  return (
    <div className="space-y-4">
      <AnimalSpeciesSelection
        species={formData.secondAnimalSpecies || ''}
        customSpecies={formData.secondCustomSpecies || ''}
        onSpeciesChange={onSecondAnimalSpeciesChange}
        onCustomSpeciesChange={onSecondCustomSpeciesChange}
        title="Sélectionnez l'espèce de votre 2ème animal *"
        prefix="second-"
        animalName={formData.secondAnimalName || ''}
        onAnimalNameChange={onSecondAnimalNameChange}
        showNameInput={showSecondNameInput}
        nameInputId="second-animal-name"
        nameInputPlaceholder="Nom du 2e animal"
      />
    </div>
  );
};

export default SecondAnimalForm;
