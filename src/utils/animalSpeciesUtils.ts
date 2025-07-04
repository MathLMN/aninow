
export const getAnimalSpecies = (animalNumber?: number): string => {
  const storedData = localStorage.getItem('bookingFormData');
  if (!storedData) return 'chat'; // Par défaut
  
  const parsedData = JSON.parse(storedData);
  
  if (animalNumber === 2) {
    return parsedData.secondAnimalSpecies || 'chat';
  } else {
    return parsedData.animalSpecies || 'chat';
  }
};
