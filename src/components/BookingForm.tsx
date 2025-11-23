
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import BookingSituationSelector from './BookingSituationSelector';
import AnimalSpeciesSelection from './AnimalSpeciesSelection';
import SecondAnimalForm from './SecondAnimalForm';
import LitterOptions from './LitterOptions';
import { useBookingFormLogic } from '../hooks/useBookingFormLogic';
import { validateBookingForm } from '../utils/formValidation';
import { FormData } from '../types/FormDataTypes';
import { useBookingFormData } from '../hooks/useBookingFormData';
import { useMultiTenantBookingNavigation } from '../hooks/useMultiTenantBookingNavigation';
import { useLocation } from 'react-router-dom';

const BookingForm = () => {
  const location = useLocation();
  const { bookingData, updateBookingData } = useBookingFormData();
  const { navigateNext } = useMultiTenantBookingNavigation();
  
  const {
    formData,
    formState,
    isLitter,
    initializeFormData,
    handleBookingSituationChange,
    handleSpeciesChange,
    handleCustomSpeciesChange,
    handleNameChange,
    handleMultipleAnimalsChange,
    handleSecondAnimalSpeciesChange,
    handleSecondCustomSpeciesChange,
    handleSecondAnimalNameChange,
    handleVaccinationTypeChange
  } = useBookingFormLogic();

  // Initialisation simple une seule fois au montage
  React.useEffect(() => {
    if (bookingData && Object.keys(bookingData).length > 0 && !formData.animalSpecies) {
      console.log('Initializing form with saved data:', bookingData);
      initializeFormData(bookingData);
    }
  }, [bookingData, formData.animalSpecies, initializeFormData]);

  const canProceed = validateBookingForm(formData, formState, isLitter);

  const handleSubmit = () => {
    if (canProceed) {
      console.log('Form submission with data:', formData);
      
      const dataToSave = isLitter ? {
        ...formData,
        consultationReason: 'consultation-convenance',
        convenienceOptions: [formData.vaccinationType === 'vaccinations-identifications' ? 'vaccination-identification' : 'vaccination']
      } : formData;
      
      updateBookingData(dataToSave);
      navigateNext(location.pathname);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Sélecteur de situation - toujours visible en premier */}
      <BookingSituationSelector
        selectedSituation={formData.bookingSituation}
        onSituationChange={handleBookingSituationChange}
      />

      {/* Formulaire du premier animal */}
      {formState.showFirstAnimalForm && (
        <div className="animate-fade-in space-y-3 sm:space-y-4">
          {formData.bookingSituation === '2-animaux' && (
            <div className="flex items-center gap-3 pb-3 border-b-2 border-primary/20">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Premier animal</h3>
                <p className="text-sm text-muted-foreground">Informations du premier animal</p>
              </div>
            </div>
          )}
          <AnimalSpeciesSelection
            species={formData.animalSpecies}
            customSpecies={formData.customSpecies}
            onSpeciesChange={handleSpeciesChange}
            onCustomSpeciesChange={handleCustomSpeciesChange}
            title={isLitter ? "Sélectionnez l'espèce de la portée *" : "Sélectionnez l'espèce de votre animal *"}
            animalName={formData.animalName}
            onAnimalNameChange={handleNameChange}
            showNameInput={formState.showNameInput}
            nameInputId="animal-name"
            nameInputPlaceholder="Nom de l'animal"
          />
        </div>
      )}

      {/* Formulaire du deuxième animal */}
      {formState.showSecondAnimalForm && (
        <div className="animate-fade-in mt-8">
          <div className="flex items-center gap-3 pb-3 mb-4 border-b-2 border-secondary/30">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-bold text-lg shrink-0">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Deuxième animal</h3>
              <p className="text-sm text-muted-foreground">Informations du deuxième animal</p>
            </div>
          </div>
          <div className="bg-secondary/5 p-3 sm:p-4 rounded-lg border-2 border-secondary/20">
            <SecondAnimalForm
            formData={formData}
            onSecondAnimalSpeciesChange={handleSecondAnimalSpeciesChange}
            onSecondCustomSpeciesChange={handleSecondCustomSpeciesChange}
            onSecondAnimalNameChange={handleSecondAnimalNameChange}
            showSecondNameInput={formState.showSecondNameInput}
          />
          </div>
        </div>
      )}

      {/* Options pour une portée */}
      {formState.showLitterForm && (
        <div className="animate-fade-in bg-vet-sage/10 p-3 sm:p-4 rounded-lg border border-vet-sage/20">
          <LitterOptions
            vaccinationType={formData.vaccinationType}
            onVaccinationTypeChange={handleVaccinationTypeChange}
          />
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
