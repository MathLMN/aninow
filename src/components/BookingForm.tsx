
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AnimalSpeciesSelection from './AnimalSpeciesSelection';
import AnimalNameInput from './AnimalNameInput';
import MultipleAnimalsOptions from './MultipleAnimalsOptions';
import SecondAnimalForm from './SecondAnimalForm';
import LitterOptions from './LitterOptions';

interface FormData {
  animalSpecies: string;
  customSpecies: string;
  animalName: string;
  multipleAnimals: string[];
  secondAnimalSpecies?: string;
  secondAnimalName?: string;
  secondCustomSpecies?: string;
  vaccinationType?: string;
}

const BookingForm = ({
  onNext
}: {
  onNext: (data: FormData) => void;
}) => {
  const [formData, setFormData] = useState<FormData>({
    animalSpecies: '',
    customSpecies: '',
    animalName: '',
    multipleAnimals: [],
    secondAnimalSpecies: '',
    secondAnimalName: '',
    secondCustomSpecies: '',
    vaccinationType: ''
  });

  const [showNameInput, setShowNameInput] = useState(false);
  const [showMultipleOptions, setShowMultipleOptions] = useState(false);
  const [showSecondAnimal, setShowSecondAnimal] = useState(false);
  const [showSecondNameInput, setShowSecondNameInput] = useState(false);
  const [showLitterOptions, setShowLitterOptions] = useState(false);

  const handleSpeciesChange = (value: string, selected: boolean) => {
    if (selected) {
      setFormData(prev => ({
        ...prev,
        animalSpecies: value,
        customSpecies: ''
      }));
      setShowNameInput(true);
      setShowMultipleOptions(true);
    } else {
      setFormData(prev => ({
        ...prev,
        animalSpecies: '',
        customSpecies: ''
      }));
      setShowNameInput(false);
      setShowMultipleOptions(false);
      setShowSecondAnimal(false);
      setShowSecondNameInput(false);
      setShowLitterOptions(false);
    }
  };

  const handleCustomSpeciesChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      customSpecies: value
    }));
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      animalName: value
    }));
  };

  const handleMultipleAnimalsChange = (option: string, checked: boolean) => {
    let newMultipleAnimals: string[] = [];
    if (checked) {
      if (option === '2-animaux') {
        newMultipleAnimals = ['2-animaux'];
      } else if (option === 'une-portee') {
        newMultipleAnimals = ['une-portee'];
      }
    } else {
      newMultipleAnimals = [];
    }

    setFormData(prev => ({
      ...prev,
      multipleAnimals: newMultipleAnimals
    }));

    setShowSecondAnimal(newMultipleAnimals.includes('2-animaux'));
    setShowLitterOptions(newMultipleAnimals.includes('une-portee'));
  };

  const handleSecondAnimalSpeciesChange = (value: string, selected: boolean) => {
    if (selected) {
      setFormData(prev => ({
        ...prev,
        secondAnimalSpecies: value,
        secondCustomSpecies: ''
      }));
      setShowSecondNameInput(true);
    } else {
      setFormData(prev => ({
        ...prev,
        secondAnimalSpecies: '',
        secondCustomSpecies: ''
      }));
      setShowSecondNameInput(false);
    }
  };

  const handleSecondCustomSpeciesChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      secondCustomSpecies: value
    }));
  };

  const handleSecondAnimalNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      secondAnimalName: value
    }));
  };

  const handleVaccinationTypeChange = (value: string, selected: boolean) => {
    if (selected) {
      setFormData(prev => ({
        ...prev,
        vaccinationType: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        vaccinationType: ''
      }));
    }
  };

  const canProceed = () => {
    if (!formData.animalSpecies) return false;
    if (formData.animalSpecies === 'autre' && !formData.customSpecies) return false;
    if (!formData.animalName) return false;

    if (showSecondAnimal) {
      if (!formData.secondAnimalSpecies) return false;
      if (formData.secondAnimalSpecies === 'autre' && !formData.secondCustomSpecies) return false;
      if (!formData.secondAnimalName) return false;
    }

    if (showLitterOptions && !formData.vaccinationType) return false;
    return true;
  };

  const handleSubmit = () => {
    if (canProceed()) {
      onNext(formData);
    }
  };

  return (
    <div className="space-y-8">
      {/* Question principale : Espèce de l'animal */}
      <div className="space-y-4">
        <AnimalSpeciesSelection
          species={formData.animalSpecies}
          customSpecies={formData.customSpecies}
          onSpeciesChange={handleSpeciesChange}
          onCustomSpeciesChange={handleCustomSpeciesChange}
          title="Sélectionnez l'espèce votre animal *"
        />

        {/* Champ nom de l'animal */}
        {showNameInput && (
          <AnimalNameInput
            name={formData.animalName}
            onNameChange={handleNameChange}
            placeholder="Nom de l'animal"
            id="animal-name"
          />
        )}
      </div>

      {/* Options multiples animaux */}
      {showMultipleOptions && (
        <MultipleAnimalsOptions
          multipleAnimals={formData.multipleAnimals}
          onMultipleAnimalsChange={handleMultipleAnimalsChange}
        />
      )}

      {/* Deuxième animal */}
      {showSecondAnimal && (
        <SecondAnimalForm
          formData={formData}
          onSecondAnimalSpeciesChange={handleSecondAnimalSpeciesChange}
          onSecondCustomSpeciesChange={handleSecondCustomSpeciesChange}
          onSecondAnimalNameChange={handleSecondAnimalNameChange}
          showSecondNameInput={showSecondNameInput}
        />
      )}

      {/* Options pour une portée */}
      {showLitterOptions && (
        <LitterOptions
          vaccinationType={formData.vaccinationType}
          onVaccinationTypeChange={handleVaccinationTypeChange}
        />
      )}

      {/* Bouton Suivant */}
      <div className="flex justify-center pt-6">
        <Button 
          onClick={handleSubmit} 
          disabled={!canProceed()} 
          className="bg-vet-sage hover:bg-vet-sage/90 text-white px-8 py-3 text-lg"
        >
          Suivant
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default BookingForm;
