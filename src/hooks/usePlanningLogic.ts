import { useState, useCallback } from 'react';
import { FormData, FormState } from '../types/FormDataTypes';
import { assignAppointmentToColumn } from '@/components/planning/utils/appointmentAssignment';

export const usePlanningLogic = () => {
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
      showSecondAnimalForm: newMultipleAnimals.includes('2-animaux'),
      showLitterForm: newMultipleAnimals.includes('une-portee')
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
