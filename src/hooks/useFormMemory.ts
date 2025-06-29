
import { useState, useEffect } from 'react';

export interface BookingFormData {
  animalSpecies: string;
  customSpecies: string;
  animalName: string;
  multipleAnimals: string[];
  secondAnimalSpecies?: string;
  secondAnimalName?: string;
  secondCustomSpecies?: string;
  vaccinationType?: string;
  consultationReason?: string;
  convenienceOptions?: string[];
  secondAnimalDifferentReason?: boolean;
  secondAnimalConsultationReason?: string;
  secondAnimalConvenienceOptions?: string[];
}

const STORAGE_KEY = 'bookingFormData';

export const useFormMemory = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    animalSpecies: '',
    customSpecies: '',
    animalName: '',
    multipleAnimals: [],
    secondAnimalSpecies: '',
    secondAnimalName: '',
    secondCustomSpecies: '',
    vaccinationType: '',
    consultationReason: '',
    convenienceOptions: [],
    secondAnimalDifferentReason: false,
    secondAnimalConsultationReason: '',
    secondAnimalConvenienceOptions: []
  });

  // Charger les données depuis localStorage au montage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, []);

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const clearFormData = () => {
    setFormData({
      animalSpecies: '',
      customSpecies: '',
      animalName: '',
      multipleAnimals: [],
      secondAnimalSpecies: '',
      secondAnimalName: '',
      secondCustomSpecies: '',
      vaccinationType: '',
      consultationReason: '',
      convenienceOptions: [],
      secondAnimalDifferentReason: false,
      secondAnimalConsultationReason: '',
      secondAnimalConvenienceOptions: []
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    formData,
    updateFormData,
    clearFormData
  };
};
