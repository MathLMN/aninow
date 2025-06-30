
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useConsultationReason = () => {
  const navigate = useNavigate();
  const [consultationReason, setConsultationReason] = useState('');
  const [convenienceOptions, setConvenienceOptions] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');
  const [secondAnimalDifferentReason, setSecondAnimalDifferentReason] = useState(false);
  const [secondAnimalConsultationReason, setSecondAnimalConsultationReason] = useState('');
  const [secondAnimalConvenienceOptions, setSecondAnimalConvenienceOptions] = useState<string[]>([]);
  const [secondAnimalCustomText, setSecondAnimalCustomText] = useState('');
  const [hasTwoAnimals, setHasTwoAnimals] = useState(false);

  useEffect(() => {
    // Vérifier que les données du formulaire précédent existent
    const bookingData = localStorage.getItem('bookingFormData');
    if (!bookingData) {
      navigate('/');
      return;
    }

    const parsedData = JSON.parse(bookingData);
    // Vérifier si l'utilisateur a sélectionné "2 animaux"
    const hasSecondAnimal = parsedData.multipleAnimals?.includes('2-animaux');
    setHasTwoAnimals(hasSecondAnimal);
  }, [navigate]);

  // Effet pour gérer la logique conditionnelle du deuxième animal
  useEffect(() => {
    if (hasTwoAnimals && consultationReason === 'symptomes-anomalie') {
      // Si animal 1 a "symptomes-anomalie", forcer animal 2 à "consultation-convenance"
      setSecondAnimalConsultationReason('consultation-convenance');
      setSecondAnimalDifferentReason(true);
    }
  }, [consultationReason, hasTwoAnimals]);

  const handleNext = () => {
    const isFirstAnimalValid = consultationReason !== '' && 
      (consultationReason !== 'consultation-convenance' || 
       (convenienceOptions.length > 0 && 
        (!convenienceOptions.includes('autre') || customText.trim() !== '')));
    
    const isSecondAnimalValid = !secondAnimalDifferentReason || 
      (secondAnimalConsultationReason !== '' && 
       (secondAnimalConsultationReason !== 'consultation-convenance' || 
        (secondAnimalConvenienceOptions.length > 0 &&
         (!secondAnimalConvenienceOptions.includes('autre') || secondAnimalCustomText.trim() !== ''))));

    if (isFirstAnimalValid && isSecondAnimalValid) {
      // Récupérer les données existantes et ajouter le motif de consultation
      const existingData = JSON.parse(localStorage.getItem('bookingFormData') || '{}');
      const updatedData = {
        ...existingData,
        consultationReason,
        convenienceOptions,
        customText,
        secondAnimalDifferentReason,
        secondAnimalConsultationReason: secondAnimalDifferentReason ? secondAnimalConsultationReason : consultationReason,
        secondAnimalConvenienceOptions: secondAnimalDifferentReason ? secondAnimalConvenienceOptions : convenienceOptions,
        secondAnimalCustomText: secondAnimalDifferentReason ? secondAnimalCustomText : customText
      };
      
      localStorage.setItem('bookingFormData', JSON.stringify(updatedData));
      console.log('Updated booking data:', updatedData);
      
      // Naviguer vers la page suivante (créneaux)
      navigate('/booking/slots');
    }
  };

  const canProceed = consultationReason !== '' && 
    (consultationReason !== 'consultation-convenance' || 
     (convenienceOptions.length > 0 && 
      (!convenienceOptions.includes('autre') || customText.trim() !== ''))) &&
    (!secondAnimalDifferentReason || 
     (secondAnimalConsultationReason !== '' && 
      (secondAnimalConsultationReason !== 'consultation-convenance' || 
       (secondAnimalConvenienceOptions.length > 0 &&
        (!secondAnimalConvenienceOptions.includes('autre') || secondAnimalCustomText.trim() !== '')))));

  const shouldForceConvenienceForAnimal2 = hasTwoAnimals && consultationReason === 'symptomes-anomalie';

  return {
    consultationReason,
    setConsultationReason,
    convenienceOptions,
    setConvenienceOptions,
    customText,
    setCustomText,
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
    shouldForceConvenienceForAnimal2
  };
};
