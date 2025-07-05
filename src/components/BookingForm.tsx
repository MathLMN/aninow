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

  // Vérifier si c'est une portée
  const isLitter = formData.multipleAnimals.includes('une-portee');

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
        // Pour une portée, on vide le nom de l'animal car il n'est pas nécessaire
        setFormData(prev => ({
          ...prev,
          animalName: ''
        }));
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
    
    // Pour une portée, le nom n'est pas obligatoire
    if (!isLitter && !formData.animalName) return false;

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
    <div className="space-y-4 sm:space-y-6">
      {/* Question principale : Espèce de l'animal */}
      <div className="space-y-3 sm:space-y-4">
        <AnimalSpeciesSelection
          species={formData.animalSpecies}
          customSpecies={formData.customSpecies}
          onSpeciesChange={handleSpeciesChange}
          onCustomSpeciesChange={handleCustomSpeciesChange}
          title="Sélectionnez l'espèce votre animal *"
        />

        {/* Champ nom de l'animal - masqué pour une portée */}
        {showNameInput && !isLitter && (
          <div className="animate-fade-in">
            <AnimalNameInput
              name={formData.animalName}
              onNameChange={handleNameChange}
              placeholder="Nom de l'animal"
              id="animal-name"
            />
          </div>
        )}
      </div>

      {/* Options multiples animaux */}
      {showMultipleOptions && (
        <div className="animate-fade-in">
          <MultipleAnimalsOptions
            multipleAnimals={formData.multipleAnimals}
            onMultipleAnimalsChange={handleMultipleAnimalsChange}
          />
        </div>
      )}

      {/* Deuxième animal */}
      {showSecondAnimal && (
        <div className="animate-fade-in bg-vet-beige/20 p-3 sm:p-4 rounded-lg border border-vet-blue/20">
          <SecondAnimalForm
            formData={formData}
            onSecondAnimalSpeciesChange={handleSecondAnimalSpeciesChange}
            onSecondCustomSpeciesChange={handleSecondCustomSpeciesChange}
            onSecondAnimalNameChange={handleSecondAnimalNameChange}
            showSecondNameInput={showSecondNameInput}
          />
        </div>
      )}

      {/* Options pour une portée */}
      {showLitterOptions && (
        <div className="animate-fade-in bg-vet-sage/10 p-3 sm:p-4 rounded-lg border border-vet-sage/20">
          <LitterOptions
            vaccinationType={formData.vaccinationType}
            onVaccinationTypeChange={handleVaccinationTypeChange}
          />
        </div>
      )}

      {/* Message informatif - Mobile optimized */}
      {(showNameInput || showMultipleOptions) && (
        <div className="bg-vet-blue/10 p-3 rounded-md border border-vet-blue/20">
          <p className="text-xs sm:text-sm text-vet-navy text-center leading-relaxed">
            📋 Complétez les informations puis cliquez sur <span className="font-semibold text-vet-sage">continuer</span>
          </p>
        </div>
      )}

      {/* Bouton Suivant - Mobile first */}
      <div className="pt-3 sm:pt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={!canProceed()} 
          className="bg-vet-sage hover:bg-vet-sage/90 disabled:opacity-50 disabled:cursor-not-allowed text-white w-full h-12 sm:h-11 text-base sm:text-lg font-medium rounded-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200"
        >
          continuer
          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </div>
  );
};

export default BookingForm;
