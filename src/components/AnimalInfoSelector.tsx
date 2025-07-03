
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
interface AnimalInfoSelectorProps {
  animalName: string;
  animalNumber?: number;
  selectedBreed: string;
  onBreedChange: (breed: string) => void;
  selectedAge: string;
  onAgeChange: (age: string) => void;
}

// Listes temporaires - à remplacer par les vraies listes plus tard
const BREEDS = ['Labrador', 'Golden Retriever', 'Berger Allemand', 'Bulldog Français', 'Chihuahua', 'Yorkshire Terrier', 'Caniche', 'Boxer', 'Beagle', 'Border Collie', 'Autre'];
const AGES = ['Moins de 6 mois', '6 mois à 1 an', '1 à 2 ans', '2 à 5 ans', '5 à 8 ans', '8 à 12 ans', 'Plus de 12 ans'];
const AnimalInfoSelector: React.FC<AnimalInfoSelectorProps> = ({
  animalName,
  animalNumber,
  selectedBreed,
  onBreedChange,
  selectedAge,
  onAgeChange
}) => {
  const title = animalNumber ? `Animal ${animalNumber} - ${animalName}` : animalName;
  return <div className="space-y-4 sm:space-y-6">
      {animalNumber && <div className="bg-vet-beige/20 rounded-lg p-3 sm:p-4 border border-vet-beige/40">
          <h3 className="sm:text-lg font-semibold text-vet-blue mb-4 text-sm">
            {title}
          </h3>
          
          <div className="space-y-4">
            {/* Sélection de la race */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium text-vet-navy">
                Quelle est la race ?
                <span className="text-vet-navy ml-1">*</span>
              </Label>
              <Select value={selectedBreed} onValueChange={onBreedChange}>
                <SelectTrigger className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors">
                  <SelectValue placeholder="Écrivez pour trouver la race" />
                </SelectTrigger>
                <SelectContent>
                  {BREEDS.map(breed => <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Sélection de l'âge */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium text-vet-navy">
                Quel est son âge ?
                <span className="text-vet-navy ml-1">*</span>
              </Label>
              <Select value={selectedAge} onValueChange={onAgeChange}>
                <SelectTrigger className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors">
                  <SelectValue placeholder="Écrivez ou sélectionnez parmi la liste" />
                </SelectTrigger>
                <SelectContent>
                  {AGES.map(age => <SelectItem key={age} value={age}>
                      {age}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>}
      
      {!animalNumber && <>
          <h3 className="text-base sm:text-lg font-semibold text-vet-blue mb-4">
            Informations sur {animalName}
          </h3>

          <div className="space-y-4">
            {/* Sélection de la race */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium text-vet-navy">
                Quelle est la race ?
                <span className="text-vet-navy ml-1">*</span>
              </Label>
              <Select value={selectedBreed} onValueChange={onBreedChange}>
                <SelectTrigger className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors">
                  <SelectValue placeholder="Écrivez pour trouver la race" />
                </SelectTrigger>
                <SelectContent>
                  {BREEDS.map(breed => <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Sélection de l'âge */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium text-vet-navy">
                Quel est son âge ?
                <span className="text-vet-navy ml-1">*</span>
              </Label>
              <Select value={selectedAge} onValueChange={onAgeChange}>
                <SelectTrigger className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors">
                  <SelectValue placeholder="Écrivez ou sélectionnez parmi la liste" />
                </SelectTrigger>
                <SelectContent>
                  {AGES.map(age => <SelectItem key={age} value={age}>
                      {age}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>}
    </div>;
};
export default AnimalInfoSelector;
