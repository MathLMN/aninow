
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface AnimalInfoSelectorProps {
  animalName: string;
  animalNumber?: number;
  selectedBreed: string;
  onBreedChange: (breed: string) => void;
  selectedAge: string;
  onAgeChange: (age: string) => void;
}

// Liste des races de chats
const CAT_BREEDS = [
  'Abyssin',
  'Aegean',
  'American Curl',
  'American Shorthair',
  'American Wirehair',
  'Angora Turc',
  'Asian',
  'Australian Mist',
  'Balinais',
  'Bengal',
  'Bobtail américain',
  'Bobtail japonais',
  'Bobtail du Mekong',
  'Bombay',
  'British Longhair',
  'British Shorthair',
  'Burmese',
  'Burmilla',
  'Chantilly-Tiffany',
  'Chartreux',
  'Chausie',
  'Cheetoh',
  'Colorpoint Shorthair',
  'Cornish Rex',
  'Cymric',
  'Devon Rex',
  'Donskoy',
  'Dragon Li (chat chinois)',
  'European Shorthair',
  'Exotic Shorthair',
  'German Rex',
  'Havana Brown',
  'Khao Manee',
  'Korat',
  'Kurilian Bobtail',
  'LaPerm',
  'Lykoi',
  'Maine Coon',
  'Manx',
  'Mau Arabe',
  'Mau Egyptien',
  'Munchkin',
  'Napoleon',
  'Nebelung',
  'Neva Masquerade',
  'Norvégien',
  'Ocicat',
  'Ojos Azules',
  'Oriental',
  'Oriental Longhair (Mandarin)',
  'Persan',
  'Peterbald',
  'Pixie-bob',
  'Ragamuffin',
  'Ragdoll',
  'Russe (Bleu russe)',
  'Sacré de Birmanie',
  'Savannah',
  'Scottish Fold',
  'Scottish Straight',
  'Selkirk Rex',
  'Serengeti',
  'Seychellois',
  'Siamois',
  'Sibérien',
  'Singapura',
  'Snowshoe',
  'Sokoke',
  'Somali',
  'Sphynx',
  'Thaï',
  'Tiffany',
  'Tonkinois',
  'Toyger',
  'Turc de Van (Van Kedisi)',
  'Ukrainian Levkoy',
  'York Chocolat'
];

// Liste temporaire des races de chiens (à remplacer par la vraie liste)
const DOG_BREEDS = ['Labrador', 'Golden Retriever', 'Berger Allemand', 'Bulldog Français', 'Chihuahua', 'Yorkshire Terrier', 'Caniche', 'Boxer', 'Beagle', 'Border Collie', 'Autre'];

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

  // Récupérer les données du formulaire pour déterminer l'espèce
  const getAnimalSpecies = () => {
    const storedData = localStorage.getItem('bookingFormData');
    if (!storedData) return 'chat'; // Par défaut
    
    const parsedData = JSON.parse(storedData);
    
    if (animalNumber === 2) {
      return parsedData.secondAnimalSpecies || 'chat';
    } else {
      return parsedData.animalSpecies || 'chat';
    }
  };

  const animalSpecies = getAnimalSpecies();
  const breeds = animalSpecies === 'chat' ? CAT_BREEDS : DOG_BREEDS;
  const noBreedLabel = animalSpecies === 'chat' ? 'Sans race/ type européen' : 'Sans race/ croisement';

  // Gérer la checkbox "sans race"
  const isNoBreed = selectedBreed === 'no-breed';
  
  const handleNoBreedChange = (checked: boolean) => {
    if (checked) {
      onBreedChange('no-breed');
    } else {
      onBreedChange('');
    }
  };

  const handleBreedSelectChange = (breed: string) => {
    onBreedChange(breed);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {animalNumber && (
        <div className="bg-vet-beige/20 rounded-lg p-3 sm:p-4 border border-vet-beige/40">
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
              <Select 
                value={isNoBreed ? '' : selectedBreed} 
                onValueChange={handleBreedSelectChange}
                disabled={isNoBreed}
              >
                <SelectTrigger className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors">
                  <SelectValue placeholder="Écrivez pour trouver la race" />
                </SelectTrigger>
                <SelectContent>
                  {breeds.map(breed => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Checkbox sans race */}
              <div className="flex items-center space-x-2 mt-3">
                <Checkbox 
                  id={`no-breed-${animalNumber}`}
                  checked={isNoBreed}
                  onCheckedChange={handleNoBreedChange}
                />
                <Label 
                  htmlFor={`no-breed-${animalNumber}`}
                  className="text-sm text-vet-navy cursor-pointer"
                >
                  {noBreedLabel}
                </Label>
              </div>
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
                  {AGES.map(age => (
                    <SelectItem key={age} value={age}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      {!animalNumber && (
        <>
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
              <Select 
                value={isNoBreed ? '' : selectedBreed} 
                onValueChange={handleBreedSelectChange}
                disabled={isNoBreed}
              >
                <SelectTrigger className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors">
                  <SelectValue placeholder="Écrivez pour trouver la race" />
                </SelectTrigger>
                <SelectContent>
                  {breeds.map(breed => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Checkbox sans race */}
              <div className="flex items-center space-x-2 mt-3">
                <Checkbox 
                  id="no-breed-single"
                  checked={isNoBreed}
                  onCheckedChange={handleNoBreedChange}
                />
                <Label 
                  htmlFor="no-breed-single"
                  className="text-sm text-vet-navy cursor-pointer"
                >
                  {noBreedLabel}
                </Label>
              </div>
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
                  {AGES.map(age => (
                    <SelectItem key={age} value={age}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnimalInfoSelector;
