
export interface FormData {
  bookingSituation: '1-animal' | '2-animaux' | 'une-portee' | '';
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
  showFirstAnimalForm: boolean;
  showSecondAnimalForm: boolean;
  showLitterForm: boolean;
  showNameInput: boolean;
  showSecondNameInput: boolean;
}
