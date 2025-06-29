import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";
import SelectionButton from './SelectionButton';

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
  const [showSecondNameInput, setShowSecondNameInput] = useState(false);
  const [showLitterOptions, setShowLitterOptions] = useState(false);

  const handleSpeciesChange = (value: string, selected: boolean) => {
    if (selected) {
      setFormData(prev => ({ ...prev, animalSpecies: value, customSpecies: '' }));
      setShowNameInput(true);
      setShowMultipleOptions(true);
    } else {
      setFormData(prev => ({ ...prev, animalSpecies: '', customSpecies: '' }));
      setShowNameInput(false);
      setShowMultipleOptions(false);
      setShowSecondAnimal(false);
      setShowSecondNameInput(false);
      setShowLitterOptions(false);
    }
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

  const handleSecondAnimalSpeciesChange = (value: string, selected: boolean) => {
    if (selected) {
      setFormData(prev => ({ ...prev, secondAnimalSpecies: value, secondCustomSpecies: '' }));
      setShowSecondNameInput(true);
    } else {
      setFormData(prev => ({ ...prev, secondAnimalSpecies: '', secondCustomSpecies: '' }));
      setShowSecondNameInput(false);
    }
  };

  const handleSecondCustomSpeciesChange = (value: string) => {
    setFormData(prev => ({ ...prev, secondCustomSpecies: value }));
  };

  const handleSecondAnimalNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, secondAnimalName: value }));
  };

  const handleVaccinationTypeChange = (value: string, selected: boolean) => {
    if (selected) {
      setFormData(prev => ({ ...prev, vaccinationType: value }));
    } else {
      setFormData(prev => ({ ...prev, vaccinationType: '' }));
    }
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SelectionButton
            id="chat"
            value="chat"
            isSelected={formData.animalSpecies === 'chat'}
            onSelect={handleSpeciesChange}
          >
            Chat
          </SelectionButton>
          <SelectionButton
            id="chien"
            value="chien"
            isSelected={formData.animalSpecies === 'chien'}
            onSelect={handleSpeciesChange}
          >
            Chien
          </SelectionButton>
          <SelectionButton
            id="autre"
            value="autre"
            isSelected={formData.animalSpecies === 'autre'}
            onSelect={handleSpeciesChange}
          >
            Autre (précisez)
          </SelectionButton>
        </div>

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

      {/* Champ nom de l'animal - sans question */}
      {showNameInput && (
        <div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SelectionButton
              id="second-chat"
              value="chat"
              isSelected={formData.secondAnimalSpecies === 'chat'}
              onSelect={handleSecondAnimalSpeciesChange}
            >
              Chat
            </SelectionButton>
            <SelectionButton
              id="second-chien"
              value="chien"
              isSelected={formData.secondAnimalSpecies === 'chien'}
              onSelect={handleSecondAnimalSpeciesChange}
            >
              Chien
            </SelectionButton>
            <SelectionButton
              id="second-autre"
              value="autre"
              isSelected={formData.secondAnimalSpecies === 'autre'}
              onSelect={handleSecondAnimalSpeciesChange}
            >
              Autre (précisez)
            </SelectionButton>
          </div>

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

          {/* Champ nom du 2e animal - sans question */}
          {showSecondNameInput && (
            <div>
              <Input
                id="second-animal-name"
                value={formData.secondAnimalName}
                onChange={(e) => handleSecondAnimalNameChange(e.target.value)}
                placeholder="Nom du 2e animal"
                className="text-base"
              />
            </div>
          )}
        </div>
      )}

      {/* Options pour une portée */}
      {showLitterOptions && (
        <div className="space-y-4 pl-4 border-l-2 border-vet-sage/30">
          <Label className="text-lg font-semibold text-vet-navy">
            Vous souhaitez *
          </Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SelectionButton
              id="vacc-id"
              value="vaccinations-identifications"
              isSelected={formData.vaccinationType === 'vaccinations-identifications'}
              onSelect={handleVaccinationTypeChange}
            >
              Vaccinations et identifications
            </SelectionButton>
            <SelectionButton
              id="vacc-only"
              value="vaccinations-seulement"
              isSelected={formData.vaccinationType === 'vaccinations-seulement'}
              onSelect={handleVaccinationTypeChange}
            >
              Vaccinations uniquement
            </SelectionButton>
          </div>
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
