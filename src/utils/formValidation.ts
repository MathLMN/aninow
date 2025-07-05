
import { FormData, FormState } from '../types/FormDataTypes';

export const validateBookingForm = (
  formData: FormData, 
  formState: FormState, 
  isLitter: boolean
): boolean => {
  if (!formData.animalSpecies) return false;
  if (formData.animalSpecies === 'autre' && !formData.customSpecies) return false;
  
  // Pour une portée, le nom n'est pas obligatoire
  if (!isLitter && !formData.animalName) return false;

  if (formState.showSecondAnimal) {
    if (!formData.secondAnimalSpecies) return false;
    if (formData.secondAnimalSpecies === 'autre' && !formData.secondCustomSpecies) return false;
    if (!formData.secondAnimalName) return false;
  }

  if (formState.showLitterOptions && !formData.vaccinationType) return false;
  return true;
};
