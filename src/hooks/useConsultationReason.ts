
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingFormData } from './useBookingFormData';
import { filterAllConditionalAnswers } from '@/utils/conditionalAnswersFilter';

export const useConsultationReason = () => {
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBookingFormData();
  
  const [consultationReason, setConsultationReason] = useState('');
  const [convenienceOptions, setConvenienceOptions] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');
  const [secondAnimalDifferentReason, setSecondAnimalDifferentReason] = useState(false);
  const [secondAnimalConsultationReason, setSecondAnimalConsultationReason] = useState('');
  const [secondAnimalConvenienceOptions, setSecondAnimalConvenienceOptions] = useState<string[]>([]);
  const [secondAnimalCustomText, setSecondAnimalCustomText] = useState('');
  const [hasTwoAnimals, setHasTwoAnimals] = useState(false);
  
  // États pour les symptômes - Animal 1
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');

  // États pour les symptômes - Animal 2
  const [secondAnimalSelectedSymptoms, setSecondAnimalSelectedSymptoms] = useState<string[]>([]);
  const [secondAnimalCustomSymptom, setSecondAnimalCustomSymptom] = useState('');

  useEffect(() => {
    // Charger les données existantes
    if (bookingData.consultationReason) setConsultationReason(bookingData.consultationReason);
    if (bookingData.convenienceOptions) setConvenienceOptions(bookingData.convenienceOptions);
    if (bookingData.customText) setCustomText(bookingData.customText);
    if (bookingData.selectedSymptoms) setSelectedSymptoms(bookingData.selectedSymptoms);
    if (bookingData.customSymptom) setCustomSymptom(bookingData.customSymptom);
    if (bookingData.secondAnimalDifferentReason) setSecondAnimalDifferentReason(bookingData.secondAnimalDifferentReason);
    if (bookingData.secondAnimalConsultationReason) setSecondAnimalConsultationReason(bookingData.secondAnimalConsultationReason);
    if (bookingData.secondAnimalConvenienceOptions) setSecondAnimalConvenienceOptions(bookingData.secondAnimalConvenienceOptions);
    if (bookingData.secondAnimalCustomText) setSecondAnimalCustomText(bookingData.secondAnimalCustomText);
    if (bookingData.secondAnimalSelectedSymptoms) setSecondAnimalSelectedSymptoms(bookingData.secondAnimalSelectedSymptoms);
    if (bookingData.secondAnimalCustomSymptom) setSecondAnimalCustomSymptom(bookingData.secondAnimalCustomSymptom);

    // Vérifier si l'utilisateur a sélectionné "2 animaux"
    const hasSecondAnimal = bookingData.multipleAnimals?.includes('2-animaux');
    setHasTwoAnimals(hasSecondAnimal);
  }, [bookingData]);

  // Effet pour gérer la logique conditionnelle du deuxième animal
  useEffect(() => {
    // Ne forcer "consultation-convenance" pour l'animal 2 que si :
    // 1. Il y a deux animaux
    // 2. Le client a coché "motif différent pour le 2e animal"  
    // 3. L'animal 1 a "symptomes-anomalie"
    if (hasTwoAnimals && secondAnimalDifferentReason && consultationReason === 'symptomes-anomalie') {
      setSecondAnimalConsultationReason('consultation-convenance');
    }
  }, [consultationReason, hasTwoAnimals, secondAnimalDifferentReason]);

  const handleNext = () => {
    const isFirstAnimalValid = consultationReason !== '' && 
      (consultationReason !== 'consultation-convenance' || 
       (convenienceOptions.length > 0 && 
        (!convenienceOptions.includes('autre') || customText.trim() !== ''))) &&
      (consultationReason !== 'symptomes-anomalie' || 
       selectedSymptoms.length > 0 || customSymptom.trim() !== '');
    
    const isSecondAnimalValid = !secondAnimalDifferentReason || 
      (secondAnimalConsultationReason !== '' && 
       (secondAnimalConsultationReason !== 'consultation-convenance' || 
        (secondAnimalConvenienceOptions.length > 0 &&
         (!secondAnimalConvenienceOptions.includes('autre') || secondAnimalCustomText.trim() !== ''))) &&
       (secondAnimalConsultationReason !== 'symptomes-anomalie' || 
        secondAnimalSelectedSymptoms.length > 0 || secondAnimalCustomSymptom.trim() !== ''));

    if (isFirstAnimalValid && isSecondAnimalValid) {
      const updatedData = {
        consultationReason,
        convenienceOptions,
        customText,
        selectedSymptoms,
        customSymptom: customSymptom.trim(),
        secondAnimalDifferentReason,
        secondAnimalConsultationReason: secondAnimalDifferentReason ? secondAnimalConsultationReason : consultationReason,
        secondAnimalConvenienceOptions: secondAnimalDifferentReason ? secondAnimalConvenienceOptions : convenienceOptions,
        secondAnimalCustomText: secondAnimalDifferentReason ? secondAnimalCustomText : customText,
        secondAnimalSelectedSymptoms: secondAnimalDifferentReason ? secondAnimalSelectedSymptoms : selectedSymptoms,
        secondAnimalCustomSymptom: secondAnimalDifferentReason ? secondAnimalCustomSymptom.trim() : customSymptom.trim()
      };
      
      // Filtrer les réponses conditionnelles pour ne garder que celles correspondant aux symptômes actuellement sélectionnés
      const filteredConditionalAnswers = filterAllConditionalAnswers(
        bookingData.conditionalAnswers,
        {
          ...bookingData,
          ...updatedData
        }
      );
      
      updateBookingData({
        ...updatedData,
        conditionalAnswers: filteredConditionalAnswers
      });
      console.log('Updated booking data with filtered conditional answers:', { ...updatedData, conditionalAnswers: filteredConditionalAnswers });
      
      // Si le motif principal est "symptomes-anomalie", aller vers les questions conditionnelles (route corrigée)
      // Sinon, aller directement vers les informations animal
      if (consultationReason === 'symptomes-anomalie' || 
          (secondAnimalDifferentReason && secondAnimalConsultationReason === 'symptomes-anomalie')) {
        navigate('/booking/conditional-questions');
      } else {
        navigate('/booking/animal-info');
      }
    }
  };

  const canProceed = consultationReason !== '' && 
    (consultationReason !== 'consultation-convenance' || 
     (convenienceOptions.length > 0 && 
      (!convenienceOptions.includes('autre') || customText.trim() !== ''))) &&
    (consultationReason !== 'symptomes-anomalie' || 
     selectedSymptoms.length > 0 || customSymptom.trim() !== '') &&
    (!secondAnimalDifferentReason || 
     (secondAnimalConsultationReason !== '' && 
      (secondAnimalConsultationReason !== 'consultation-convenance' || 
       (secondAnimalConvenienceOptions.length > 0 &&
        (!secondAnimalConvenienceOptions.includes('autre') || secondAnimalCustomText.trim() !== ''))) &&
      (secondAnimalConsultationReason !== 'symptomes-anomalie' || 
       secondAnimalSelectedSymptoms.length > 0 || secondAnimalCustomSymptom.trim() !== '')));

  // La fonction ne force "consultation-convenance" pour l'animal 2 que si le client a coché la case
  const shouldForceConvenienceForAnimal2 = hasTwoAnimals && secondAnimalDifferentReason && consultationReason === 'symptomes-anomalie';

  return {
    consultationReason,
    setConsultationReason,
    convenienceOptions,
    setConvenienceOptions,
    customText,
    setCustomText,
    selectedSymptoms,
    setSelectedSymptoms,
    customSymptom,
    setCustomSymptom,
    secondAnimalSelectedSymptoms,
    setSecondAnimalSelectedSymptoms,
    secondAnimalCustomSymptom,
    setSecondAnimalCustomSymptom,
    secondAnimalDifferentReason,
    setSecondAnimalDifferentReason,
    secondAnimalConsultationReason,
    setSecondAnimalConsultationReason,
    secondAnimalConvenienceOptions,
    setSecondAnimalConvenienceOptions,
    secondAnimalCustomText,
    setSecondAnimalCustomText,
    hasTwoAnimals,
    handleNext,
    canProceed,
    shouldForceConvenienceForAnimal2,
    bookingData
  };
};
