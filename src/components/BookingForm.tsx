import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Phone, Info } from "lucide-react";
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
import { usePublicClinicSettings } from '../hooks/usePublicClinicSettings';
import { Alert, AlertDescription } from "@/components/ui/alert";

const BookingForm = () => {
  const location = useLocation();
  const { bookingData, updateBookingData, resetBookingData } = useBookingFormData();
  const { navigateNext } = useMultiTenantBookingNavigation();
  const { settings } = usePublicClinicSettings();
  
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

  // Nettoyer automatiquement les données si un rendez-vous a été pris récemment
  React.useEffect(() => {
    const lastConfirmation = localStorage.getItem('lastBookingConfirmation');
    if (lastConfirmation) {
      console.log('BookingForm - Cleaning previous booking data after successful submission');
      resetBookingData();
      localStorage.removeItem('lastBookingConfirmation');
    }
  }, [resetBookingData]);

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
      {/* Encadré informatif pour autres situations - disparaît après sélection */}
      {!formData.bookingSituation && settings?.clinic_phone && (
        <Alert className="bg-blue-50 border-blue-200 animate-fade-in">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-gray-700 leading-relaxed">
            Pour toute autre situation non proposée ci-dessous, merci de prendre rendez-vous par téléphone au{' '}
            <a 
              href={`tel:${settings.clinic_phone}`}
              className="font-bold text-blue-700 hover:text-blue-800 underline inline-flex items-center gap-1"
            >
              <Phone className="h-3.5 w-3.5" />
              {settings.clinic_phone}
            </a>
          </AlertDescription>
        </Alert>
      )}

      {/* Sélecteur de situation - toujours visible en premier */}
      <BookingSituationSelector
        selectedSituation={formData.bookingSituation}
        onSituationChange={handleBookingSituationChange}
      />

      {/* Formulaire du premier animal */}
      {formState.showFirstAnimalForm && (
        <div className="animate-fade-in">
          {formData.bookingSituation === '2-animaux' ? (
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    1
                  </span>
                  Animal 1
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <AnimalSpeciesSelection
                  species={formData.animalSpecies}
                  customSpecies={formData.customSpecies}
                  onSpeciesChange={handleSpeciesChange}
                  onCustomSpeciesChange={handleCustomSpeciesChange}
                  title="Sélectionnez l'espèce *"
                  animalName={formData.animalName}
                  onAnimalNameChange={handleNameChange}
                  showNameInput={formState.showNameInput}
                  nameInputId="animal-name"
                  nameInputPlaceholder="Nom de l'animal"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 sm:space-y-4">
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
        </div>
      )}

      {/* Formulaire du deuxième animal */}
      {formState.showSecondAnimalForm && (
        <div className="animate-fade-in mt-6">
          <Card className="border-2 border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary text-secondary-foreground text-sm font-bold">
                  2
                </span>
                Animal 2
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <SecondAnimalForm
                formData={formData}
                onSecondAnimalSpeciesChange={handleSecondAnimalSpeciesChange}
                onSecondCustomSpeciesChange={handleSecondCustomSpeciesChange}
                onSecondAnimalNameChange={handleSecondAnimalNameChange}
                showSecondNameInput={formState.showSecondNameInput}
              />
            </CardContent>
          </Card>
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
