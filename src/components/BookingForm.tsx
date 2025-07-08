
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AnimalSpeciesSelection from './AnimalSpeciesSelection';
import AnimalNameInput from './AnimalNameInput';
import MultipleAnimalsOptions from './MultipleAnimalsOptions';
import SecondAnimalForm from './SecondAnimalForm';
import LitterOptions from './LitterOptions';
import { useBookingFormLogic } from '../hooks/useBookingFormLogic';
import { validateBookingForm } from '../utils/formValidation';
import { FormData } from '../types/FormDataTypes';

const BookingForm = ({
  onNext
}: {
  onNext: (data: FormData) => void;
}) => {
  const {
    formData,
    formState,
    isLitter,
    handleSpeciesChange,
    handleCustomSpeciesChange,
    handleNameChange,
    handleMultipleAnimalsChange,
    handleSecondAnimalSpeciesChange,
    handleSecondCustomSpeciesChange,
    handleSecondAnimalNameChange,
    handleVaccinationTypeChange
  } = useBookingFormLogic();

  const canProceed = validateBookingForm(formData, formState, isLitter);

  const handleSubmit = () => {
    if (canProceed) {
      // Si c'est une portée, préparer les données avec le motif de consultation prédéfini
      if (isLitter) {
        const litterData = {
          ...formData,
          consultationReason: 'consultation-convenance',
          convenienceOptions: [formData.vaccinationType === 'vaccinations-identifications' ? 'vaccination-identification' : 'vaccination']
        };
        onNext(litterData);
      } else {
        onNext(formData);
      }
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
          animalName={formData.animalName}
          onAnimalNameChange={handleNameChange}
          showNameInput={formState.showNameInput && !isLitter}
          nameInputId="animal-name"
          nameInputPlaceholder="Nom de l'animal"
        />
      </div>

      {/* Options multiples animaux */}
      {formState.showMultipleOptions && (
        <div className="animate-fade-in">
          <MultipleAnimalsOptions
            multipleAnimals={formData.multipleAnimals}
            onMultipleAnimalsChange={handleMultipleAnimalsChange}
          />
        </div>
      )}

      {/* Deuxième animal */}
      {formState.showSecondAnimal && (
        <div className="animate-fade-in bg-vet-beige/20 p-3 sm:p-4 rounded-lg border border-vet-blue/20">
          <SecondAnimalForm
            formData={formData}
            onSecondAnimalSpeciesChange={handleSecondAnimalSpeciesChange}
            onSecondCustomSpeciesChange={handleSecondCustomSpeciesChange}
            onSecondAnimalNameChange={handleSecondAnimalNameChange}
            showSecondNameInput={formState.showSecondNameInput}
          />
        </div>
      )}

      {/* Options pour une portée */}
      {formState.showLitterOptions && (
        <div className="animate-fade-in bg-vet-sage/10 p-3 sm:p-4 rounded-lg border border-vet-sage/20">
          <LitterOptions
            vaccinationType={formData.vaccinationType}
            onVaccinationTypeChange={handleVaccinationTypeChange}
          />
        </div>
      )}

      {/* Message informatif - Mobile optimized */}
      {(formState.showNameInput || formState.showMultipleOptions) && (
        <div className="bg-vet-blue/10 p-3 rounded-md border border-vet-blue/20">
          <p className="text-xs sm:text-sm text-vet-navy text-center leading-relaxed">
            📋 Complétez les informations puis cliquez sur <span className="font-semibold text-vet-sage">continuer</span>
          </p>
        </div>
      )}

      {/* Bouton Continuer - Mobile first */}
      <div className="pt-3 sm:pt-4">
        <Button 
          onClick={handleSubmit} 
          disabled={!canProceed} 
          className="bg-vet-sage hover:bg-vet-sage/90 disabled:opacity-50 disabled:cursor-not-allowed text-white w-full h-12 sm:h-11 text-base sm:text-lg font-medium rounded-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200"
        >
          Continuer
          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </div>
  );
};

export default BookingForm;
