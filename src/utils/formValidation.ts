
import { FormData, FormState } from '../types/FormDataTypes';

export const validateBookingForm = (
  formData: FormData, 
  formState: FormState, 
  isLitter: boolean
): boolean => {
  // Vérifier qu'une situation est sélectionnée
  if (!formData.bookingSituation) return false;
  
  // Si pas de formulaire animal affiché, on ne peut pas continuer
  if (!formState.showFirstAnimalForm) return false;
  
  // Vérifier l'espèce du premier animal
  if (!formData.animalSpecies) return false;
  if (formData.animalSpecies === 'autre' && !formData.customSpecies) return false;
  
  // Pour une portée, le nom n'est pas obligatoire
  if (!isLitter && !formData.animalName) return false;

  // Pour 2 animaux, vérifier le deuxième animal
  if (formState.showSecondAnimalForm) {
    if (!formData.secondAnimalSpecies) return false;
    if (formData.secondAnimalSpecies === 'autre' && !formData.secondCustomSpecies) return false;
    if (!formData.secondAnimalName) return false;
  }

  // Pour une portée, vérifier le type de vaccination
  if (formState.showLitterForm && !formData.vaccinationType) return false;
  
  return true;
};
