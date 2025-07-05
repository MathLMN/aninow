
export interface FormData {
  animalSpecies: string;
  customSpecies: string;
  animalName: string;
  multipleAnimals: string[];
  secondAnimalSpecies?: string;
  secondAnimalName?: string;
  secondCustomSpecies?: string;
  vaccinationType?: string;
}

export interface FormState {
  showNameInput: boolean;
  showMultipleOptions: boolean;
  showSecondAnimal: boolean;
  showSecondNameInput: boolean;
  showLitterOptions: boolean;
}
