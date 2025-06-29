
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AnimalSpeciesSelection from './AnimalSpeciesSelection';
import AnimalNameInput from './AnimalNameInput';
import MultipleAnimalsOptions from './MultipleAnimalsOptions';
import SecondAnimalForm from './SecondAnimalForm';
import LitterOptions from './LitterOptions';
import { useFormMemory, BookingFormData } from '@/hooks/useFormMemory';

const BookingForm = ({
  onNext
}: {
  onNext: (data: BookingFormData) => void;
}) => {
  const { formData, updateFormData } = useFormMemory();
  
  const [showNameInput, setShowNameInput] = useState(false);
  const [showMultipleOptions, setShowMultipleOptions] = useState(false);
  const [showSecondAnimal, setShowSecondAnimal] = useState(false);
  const [showSecondNameInput, setShowSecondNameInput] = useState(false);
  const [showLitterOptions, setShowLitterOptions] = useState(false);

  // Restaurer l'état de l'interface basé sur les données sauvegardées
  useEffect(() => {
    if (formData.animalSpecies) {
      setShowNameInput(true);
      setShowMultipleOptions(true);
    }

    if (formData.multipleAnimals.includes('2-animaux')) {
      setShowSecondAnimal(true);
      if (formData.secondAnimalSpecies) {
        setShowSecondNameInput(true);
      }
    }

    if (formData.multipleAnimals.includes('une-portee')) {
      setShowLitterOptions(true);
    }
  }, [formData]);

  const handleSpeciesChange = (value: string, selected: boolean) => {
    if (selected) {
      updateFormData({
        animalSpecies: value,
        customSpecies: ''
      });
      setShowNameInput(true);
      setShowMultipleOptions(true);
    } else {
      updateFormData({
        animalSpecies: '',
        customSpecies: '',
        animalName: '',
        multipleAnimals: [],
        secondAnimalSpecies: '',
        secondAnimalName: '',
        secondCustomSpecies: '',
        vaccinationType: ''
      });
      setShowNameInput(false);
      setShowMultipleOptions(false);
      setShowSecondAnimal(false);
      setShowSecondNameInput(false);
      setShowLitterOptions(false);
    }
  };

  const handleCustomSpeciesChange = (value: string) => {
    updateFormData({ customSpecies: value });
  };

  const handleNameChange = (value: string) => {
    updateFormData({ animalName: value });
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

    updateFormData({ 
      multipleAnimals: newMultipleAnimals,
      ...(newMultipleAnimals.length === 0 && {
        secondAnimalSpecies: '',
        secondAnimalName: '',
        secondCustomSpecies: '',
        vaccinationType: ''
      })
    });

    setShowSecondAnimal(newMultipleAnimals.includes('2-animaux'));
    setShowLitterOptions(newMultipleAnimals.includes('une-portee'));
  };

  const handleSecondAnimalSpeciesChange = (value: string, selected: boolean) => {
    if (selected) {
      updateFormData({
        secondAnimalSpecies: value,
        secondCustomSpecies: ''
      });
      setShowSecondNameInput(true);
    } else {
      updateFormData({
        secondAnimalSpecies: '',
        secondCustomSpecies: '',
        secondAnimalName: ''
      });
      setShowSecondNameInput(false);
    }
  };

  const handleSecondCustomSpeciesChange = (value: string) => {
    updateFormData({ secondCustomSpecies: value });
  };

  const handleSecondAnimalNameChange = (value: string) => {
    updateFormData({ secondAnimalName: value });
  };

  const handleVaccinationTypeChange = (value: string, selected: boolean) => {
    if (selected) {
      updateFormData({ vaccinationType: value });
    } else {
      updateFormData({ vaccinationType: '' });
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

        {/* Champ nom de l'animal */}
        {showNameInput && (
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
            📋 Complétez les informations puis cliquez sur <span className="font-semibold text-vet-sage">Suivant</span>
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
          Suivant
          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </div>
  );
};

export default BookingForm;
