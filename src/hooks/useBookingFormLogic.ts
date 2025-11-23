
import { useState } from 'react';
import { FormData, FormState } from '../types/FormDataTypes';

export const useBookingFormLogic = () => {
  const [formData, setFormData] = useState<FormData>({
    bookingSituation: '',
    animalSpecies: '',
    customSpecies: '',
    animalName: '',
    multipleAnimals: [],
    secondAnimalSpecies: '',
    secondAnimalName: '',
    secondCustomSpecies: '',
    vaccinationType: ''
  });

  const [formState, setFormState] = useState<FormState>({
    showFirstAnimalForm: false,
    showSecondAnimalForm: false,
    showLitterForm: false,
    showNameInput: false,
    showSecondNameInput: false
  });

  // Vérifier si c'est une portée
  const isLitter = formData.multipleAnimals.includes('une-portee');

  // Handler pour le changement de situation
  const handleBookingSituationChange = (situation: string) => {
    // Réinitialiser les données selon la nouvelle situation
    const newFormData: FormData = {
      bookingSituation: situation as '1-animal' | '2-animaux' | 'une-portee' | '',
      animalSpecies: formData.animalSpecies,
      customSpecies: formData.customSpecies,
      animalName: situation === 'une-portee' ? '' : formData.animalName,
      multipleAnimals: situation === '2-animaux' ? ['2-animaux'] : situation === 'une-portee' ? ['une-portee'] : [],
      secondAnimalSpecies: situation === '2-animaux' ? formData.secondAnimalSpecies : '',
      secondAnimalName: situation === '2-animaux' ? formData.secondAnimalName : '',
      secondCustomSpecies: situation === '2-animaux' ? formData.secondCustomSpecies : '',
      vaccinationType: situation === 'une-portee' ? formData.vaccinationType : ''
    };
    
    setFormData(newFormData);
    
    // Mettre à jour l'état des formulaires
    const newFormState: FormState = {
      showFirstAnimalForm: situation !== '',
      showSecondAnimalForm: situation === '2-animaux',
      showLitterForm: situation === 'une-portee',
      showNameInput: !!formData.animalSpecies && situation !== 'une-portee',
      showSecondNameInput: situation === '2-animaux' && !!formData.secondAnimalSpecies
    };
    
    setFormState(newFormState);
  };

  // Function to initialize form data from localStorage - simplified
  const initializeFormData = (data: Partial<FormData>) => {
    const newFormData: FormData = {
      bookingSituation: data.bookingSituation || '',
      animalSpecies: data.animalSpecies || '',
      customSpecies: data.customSpecies || '',
      animalName: data.animalName || '',
      multipleAnimals: data.multipleAnimals || [],
      secondAnimalSpecies: data.secondAnimalSpecies || '',
      secondAnimalName: data.secondAnimalName || '',
      secondCustomSpecies: data.secondCustomSpecies || '',
      vaccinationType: data.vaccinationType || ''
    };
    
    setFormData(newFormData);
    
    // Update form state based on the loaded data
    const situation = newFormData.bookingSituation;
    const newFormState: FormState = {
      showFirstAnimalForm: !!situation,
      showSecondAnimalForm: situation === '2-animaux',
      showLitterForm: situation === 'une-portee',
      showNameInput: !!newFormData.animalSpecies && situation !== 'une-portee',
      showSecondNameInput: !!newFormData.secondAnimalSpecies && situation === '2-animaux'
    };
    
    setFormState(newFormState);
  };

  const handleSpeciesChange = (value: string, selected: boolean) => {
    if (selected) {
      setFormData(prev => ({
        ...prev,
        animalSpecies: value,
        customSpecies: ''
      }));
      setFormState(prev => ({
        ...prev,
        showNameInput: prev.showLitterForm ? false : true
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        animalSpecies: '',
        customSpecies: ''
      }));
      setFormState(prev => ({
        ...prev,
        showNameInput: false
      }));
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

    setFormState(prev => ({
      ...prev,
      showSecondAnimal: newMultipleAnimals.includes('2-animaux'),
      showLitterOptions: newMultipleAnimals.includes('une-portee')
    }));
  };

  const handleSecondAnimalSpeciesChange = (value: string, selected: boolean) => {
    if (selected) {
      setFormData(prev => ({
        ...prev,
        secondAnimalSpecies: value,
        secondCustomSpecies: ''
      }));
      setFormState(prev => ({
        ...prev,
        showSecondNameInput: true
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        secondAnimalSpecies: '',
        secondCustomSpecies: ''
      }));
      setFormState(prev => ({
        ...prev,
        showSecondNameInput: false
      }));
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

  return {
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
  };
};
