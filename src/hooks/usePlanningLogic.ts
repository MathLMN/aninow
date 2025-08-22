import { useState, useCallback } from 'react';
import { FormData, FormState } from '../types/FormDataTypes';
import { assignAppointmentToColumn } from '@/components/planning/utils/appointmentAssignment';

export const usePlanningLogic = () => {
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

  const [formState, setFormState] = useState<FormState>({
    showNameInput: false,
    showMultipleOptions: false,
    showSecondAnimal: false,
    showSecondNameInput: false,
    showLitterOptions: false
  });

  // Vérifier si c'est une portée
  const isLitter = formData.multipleAnimals.includes('une-portee');

  // Function to initialize form data from localStorage - simplified
  const initializeFormData = (data: Partial<FormData>) => {
    const newFormData: FormData = {
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
    const newFormState: FormState = {
      showNameInput: !!newFormData.animalSpecies,
      showMultipleOptions: !!newFormData.animalSpecies,
      showSecondAnimal: newFormData.multipleAnimals.includes('2-animaux'),
      showSecondNameInput: !!newFormData.secondAnimalSpecies,
      showLitterOptions: newFormData.multipleAnimals.includes('une-portee')
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
        showNameInput: true,
        showMultipleOptions: true
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        animalSpecies: '',
        customSpecies: ''
      }));
      setFormState({
        showNameInput: false,
        showMultipleOptions: false,
        showSecondAnimal: false,
        showSecondNameInput: false,
        showLitterOptions: false
      });
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

  // Organiser les rendez-vous par colonnes (vétérinaires + ASV)
  const organizeBookingsByColumns = useCallback((bookings: any[], veterinarians: any[]) => {
    const organized = new Map();
    
    // Initialiser les colonnes pour chaque vétérinaire
    veterinarians.forEach(vet => {
      organized.set(vet.id, []);
    });
    
    // Initialiser la colonne ASV
    organized.set('asv', []);
    
    // Répartir les rendez-vous dans les bonnes colonnes
    bookings.forEach(booking => {
      const columnId = assignAppointmentToColumn(booking, veterinarians);
      
      if (!organized.has(columnId)) {
        console.warn(`⚠️ Column ${columnId} not found, assigning to ASV`);
        organized.get('asv').push(booking);
      } else {
        organized.get(columnId).push(booking);
      }
    });
    
    return organized;
  }, []);

  return {
    formData,
    formState,
    isLitter,
    initializeFormData,
    handleSpeciesChange,
    handleCustomSpeciesChange,
    handleNameChange,
    handleMultipleAnimalsChange,
    handleSecondAnimalSpeciesChange,
    handleSecondCustomSpeciesChange,
    handleSecondAnimalNameChange,
    handleVaccinationTypeChange,
    organizeBookingsByColumns,
  };
};
