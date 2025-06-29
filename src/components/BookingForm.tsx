
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";

interface FormData {
  animalSpecies: string;
  customSpecies: string;
  animalName: string;
  multipleAnimals: string[];
  secondAnimalSpecies?: string;
  secondAnimalName?: string;
  secondCustomSpecies?: string;
  vaccinationType?: string;
}

const BookingForm = ({ onNext }: { onNext: (data: FormData) => void }) => {
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

  const [showNameInput, setShowNameInput] = useState(false);
  const [showMultipleOptions, setShowMultipleOptions] = useState(false);
  const [showSecondAnimal, setShowSecondAnimal] = useState(false);
  const [showLitterOptions, setShowLitterOptions] = useState(false);

  const handleSpeciesChange = (value: string) => {
    setFormData(prev => ({ ...prev, animalSpecies: value, customSpecies: '' }));
    setShowNameInput(true);
    setShowMultipleOptions(true);
  };

  const handleCustomSpeciesChange = (value: string) => {
    setFormData(prev => ({ ...prev, customSpecies: value }));
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, animalName: value }));
  };

  const handleMultipleAnimalsChange = (option: string, checked: boolean) => {
    let newMultipleAnimals = [...formData.multipleAnimals];
    
    if (checked) {
      newMultipleAnimals.push(option);
    } else {
      newMultipleAnimals = newMultipleAnimals.filter(item => item !== option);
    }
    
    setFormData(prev => ({ ...prev, multipleAnimals: newMultipleAnimals }));
    
    // Show second animal form if "2 animaux" is selected
    setShowSecondAnimal(newMultipleAnimals.includes('2-animaux'));
    
    // Show litter options if "Une portée" is selected
    setShowLitterOptions(newMultipleAnimals.includes('une-portee'));
  };

  const handleSecondAnimalSpeciesChange = (value: string) => {
    setFormData(prev => ({ ...prev, secondAnimalSpecies: value, secondCustomSpecies: '' }));
  };

  const handleSecondCustomSpeciesChange = (value: string) => {
    setFormData(prev => ({ ...prev, secondCustomSpecies: value }));
  };

  const handleSecondAnimalNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, secondAnimalName: value }));
  };

  const handleVaccinationTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, vaccinationType: value }));
  };

  const canProceed = () => {
    // Basic validation
    if (!formData.animalSpecies) return false;
    if (formData.animalSpecies === 'autre' && !formData.customSpecies) return false;
    if (!formData.animalName) return false;
    
    // If second animal is selected, validate second animal data
    if (showSecondAnimal) {
      if (!formData.secondAnimalSpecies) return false;
      if (formData.secondAnimalSpecies === 'autre' && !formData.secondCustomSpecies) return false;
      if (!formData.secondAnimalName) return false;
    }
    
    // If litter is selected, validate vaccination type
    if (showLitterOptions && !formData.vaccinationType) return false;
    
    return true;
  };

  const handleSubmit = () => {
    if (canProceed()) {
      onNext(formData);
    }
  };

  return (
    <div className="space-y-8">
      {/* Question principale : Espèce de l'animal */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-vet-navy">
          Sélectionnez l'espèce votre animal *
        </Label>
        
        <RadioGroup 
          value={formData.animalSpecies} 
          onValueChange={handleSpeciesChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-vet-beige/30 transition-colors">
            <RadioGroupItem value="chat" id="chat" />
            <Label htmlFor="chat" className="flex-1 cursor-pointer">Chat</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-vet-beige/30 transition-colors">
            <RadioGroupItem value="chien" id="chien" />
            <Label htmlFor="chien" className="flex-1 cursor-pointer">Chien</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-vet-beige/30 transition-colors">
            <RadioGroupItem value="autre" id="autre" />
            <Label htmlFor="autre" className="flex-1 cursor-pointer">Autre (précisez)</Label>
          </div>
        </RadioGroup>

        {/* Champ pour espèce personnalisée */}
        {formData.animalSpecies === 'autre' && (
          <div className="mt-4">
            <Label htmlFor="custom-species" className="text-vet-navy">
              Précisez l'espèce de votre animal *
            </Label>
            <Input
              id="custom-species"
              value={formData.customSpecies}
              onChange={(e) => handleCustomSpeciesChange(e.target.value)}
              placeholder="Écrivez l'espèce de votre animal"
              className="mt-2"
            />
          </div>
        )}
      </div>

      {/* Question du nom de l'animal */}
      {showNameInput && (
        <div className="space-y-4">
          <Label htmlFor="animal-name" className="text-lg font-semibold text-vet-navy">
            Quel est son nom ? *
          </Label>
          <Input
            id="animal-name"
            value={formData.animalName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Nom de l'animal"
            className="text-base"
          />
        </div>
      )}

      {/* Options multiples animaux */}
      {showMultipleOptions && (
        <div className="space-y-4">
          <div>
            <p className="text-vet-brown mb-2">
              Cochez l'une des options ci-dessous uniquement{' '}
              <span className="text-vet-blue italic">si vous venez avec plusieurs animaux.</span>
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="deux-animaux"
                checked={formData.multipleAnimals.includes('2-animaux')}
                onCheckedChange={(checked) => 
                  handleMultipleAnimalsChange('2-animaux', checked as boolean)
                }
              />
              <Label htmlFor="deux-animaux" className="text-vet-navy cursor-pointer">
                2 animaux
              </Label>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="une-portee"
                checked={formData.multipleAnimals.includes('une-portee')}
                onCheckedChange={(checked) => 
                  handleMultipleAnimalsChange('une-portee', checked as boolean)
                }
              />
              <Label htmlFor="une-portee" className="text-vet-navy cursor-pointer">
                Une portée
              </Label>
            </div>
          </div>
        </div>
      )}

      {/* Deuxième animal */}
      {showSecondAnimal && (
        <div className="space-y-4 pl-4 border-l-2 border-vet-sage/30">
          <Label className="text-lg font-semibold text-vet-navy">
            Le 2e animal est *
          </Label>
          
          <RadioGroup 
            value={formData.secondAnimalSpecies} 
            onValueChange={handleSecondAnimalSpeciesChange}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-vet-beige/30 transition-colors">
              <RadioGroupItem value="chat" id="second-chat" />
              <Label htmlFor="second-chat" className="flex-1 cursor-pointer">Chat</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-vet-beige/30 transition-colors">
              <RadioGroupItem value="chien" id="second-chien" />
              <Label htmlFor="second-chien" className="flex-1 cursor-pointer">Chien</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-vet-beige/30 transition-colors">
              <RadioGroupItem value="autre" id="second-autre" />
              <Label htmlFor="second-autre" className="flex-1 cursor-pointer">Autre (précisez)</Label>
            </div>
          </RadioGroup>

          {formData.secondAnimalSpecies === 'autre' && (
            <div className="mt-4">
              <Label htmlFor="second-custom-species" className="text-vet-navy">
                Précisez l'espèce du 2e animal *
              </Label>
              <Input
                id="second-custom-species"
                value={formData.secondCustomSpecies}
                onChange={(e) => handleSecondCustomSpeciesChange(e.target.value)}
                placeholder="Écrivez l'espèce du 2e animal"
                className="mt-2"
              />
            </div>
          )}

          <div className="mt-4">
            <Label htmlFor="second-animal-name" className="text-vet-navy">
              Quel est son nom ? *
            </Label>
            <Input
              id="second-animal-name"
              value={formData.secondAnimalName}
              onChange={(e) => handleSecondAnimalNameChange(e.target.value)}
              placeholder="Nom du 2e animal"
              className="mt-2"
            />
          </div>
        </div>
      )}

      {/* Options pour une portée */}
      {showLitterOptions && (
        <div className="space-y-4 pl-4 border-l-2 border-vet-sage/30">
          <Label className="text-lg font-semibold text-vet-navy">
            Vous souhaitez *
          </Label>
          
          <RadioGroup 
            value={formData.vaccinationType} 
            onValueChange={handleVaccinationTypeChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-vet-beige/30 transition-colors">
              <RadioGroupItem value="vaccinations-identifications" id="vacc-id" />
              <Label htmlFor="vacc-id" className="flex-1 cursor-pointer">
                Vaccinations et identifications
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-vet-beige/30 transition-colors">
              <RadioGroupItem value="vaccinations-seulement" id="vacc-only" />
              <Label htmlFor="vacc-only" className="flex-1 cursor-pointer">
                Vaccinations uniquement
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Bouton Suivant */}
      <div className="flex justify-center pt-6">
        <Button 
          onClick={handleSubmit}
          disabled={!canProceed()}
          className="bg-vet-sage hover:bg-vet-sage/90 text-white px-8 py-3 text-lg"
        >
          Suivant
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default BookingForm;
