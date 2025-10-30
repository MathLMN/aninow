import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart } from "lucide-react";
import BreedSearchInput from "@/components/breed-selector/BreedSearchInput";
import BreedDropdown from "@/components/breed-selector/BreedDropdown";
import { getBreedsByAnimalSpecies } from "@/data/breedData";
import { useBreedSearch } from "@/hooks/useBreedSearch";

interface AnimalSectionProps {
  formData: any;
  onFieldUpdate: (field: string, value: string | number | boolean) => void;
}

export const AnimalSection = ({ formData, onFieldUpdate }: AnimalSectionProps) => {
  const baseBreeds = getBreedsByAnimalSpecies(formData.animalSpecies || 'chien');
  
  const {
    searchTerm,
    isInputFocused,
    breedsWithOther,
    handleSearchChange,
    handleInputFocus,
    handleInputBlur,
    clearSearch
  } = useBreedSearch(baseBreeds);

  const handleBreedClick = (breed: string) => {
    if (breed === 'Autre') {
      onFieldUpdate('animalBreed', '');
    } else {
      onFieldUpdate('animalBreed', breed);
    }
    clearSearch();
    handleInputBlur();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center mb-2">
        <Heart className="h-4 w-4 mr-1 text-amber-600" />
        <h3 className="font-semibold text-amber-900 text-sm">Animal</h3>
      </div>
      
      <div className="space-y-2">
        <div>
          <Label htmlFor="animalName" className="text-xs font-medium text-gray-700">Nom *</Label>
          <Input
            id="animalName"
            type="text"
            placeholder="Nom de l'animal"
            value={formData.animalName}
            onChange={(e) => onFieldUpdate('animalName', e.target.value)}
            required
            className="h-7 text-xs"
          />
        </div>

        <div>
          <Label htmlFor="animalSpecies" className="text-xs font-medium text-gray-700">Espèce *</Label>
          <Select 
            value={formData.animalSpecies} 
            onValueChange={(value) => onFieldUpdate('animalSpecies', value)}
            required
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue placeholder="Espèce" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chien">Chien</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="lapin">Lapin</SelectItem>
              <SelectItem value="furet">Furet</SelectItem>
              <SelectItem value="oiseau">Oiseau</SelectItem>
              <SelectItem value="reptile">Reptile</SelectItem>
              <SelectItem value="rongeur">Rongeur</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="animalBreed" className="text-xs font-medium text-gray-700">Race</Label>
          {(formData.animalSpecies === 'chien' || formData.animalSpecies === 'chat') ? (
            <div className="relative">
              <BreedSearchInput
                searchTerm={searchTerm || formData.animalBreed || ''}
                onSearchChange={handleSearchChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <BreedDropdown
                breeds={breedsWithOther}
                isVisible={isInputFocused}
                onBreedClick={handleBreedClick}
              />
            </div>
          ) : (
            <Input
              id="animalBreed"
              type="text"
              placeholder="Race"
              value={formData.animalBreed || ''}
              onChange={(e) => onFieldUpdate('animalBreed', e.target.value)}
              className="h-7 text-xs"
            />
          )}
          
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="isNoBreed"
              checked={formData.isNoBreed || false}
              onCheckedChange={(checked) => onFieldUpdate('isNoBreed', checked)}
            />
            <Label
              htmlFor="isNoBreed"
              className="text-xs font-normal text-gray-600 cursor-pointer"
            >
              Croisement / sans race
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="animalAge" className="text-xs font-medium text-gray-700">Âge</Label>
            <Select value={formData.animalAge || ''} onValueChange={(value) => onFieldUpdate('animalAge', value)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Âge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-6 mois">0-6 mois</SelectItem>
                <SelectItem value="6 mois à 1 an">6m-1an</SelectItem>
                <SelectItem value="1 à 2 ans">1-2 ans</SelectItem>
                <SelectItem value="2 à 5 ans">2-5 ans</SelectItem>
                <SelectItem value="5 à 8 ans">5-8 ans</SelectItem>
                <SelectItem value="8 à 12 ans">8-12 ans</SelectItem>
                <SelectItem value="Plus de 12 ans">12+ ans</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="animalWeight" className="text-xs font-medium text-gray-700">Poids (kg)</Label>
            <Input
              id="animalWeight"
              type="number"
              step="0.1"
              placeholder="Poids"
              value={formData.animalWeight || ''}
              onChange={(e) => onFieldUpdate('animalWeight', parseFloat(e.target.value) || null)}
              className="h-7 text-xs"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="animalSex" className="text-xs font-medium text-gray-700">Sexe</Label>
          <Select value={formData.animalSex || ''} onValueChange={(value) => onFieldUpdate('animalSex', value)}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue placeholder="Sexe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Mâle</SelectItem>
              <SelectItem value="femelle">Femelle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
