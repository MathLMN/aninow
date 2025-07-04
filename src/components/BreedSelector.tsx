
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface BreedSelectorProps {
  animalSpecies: string;
  selectedBreed: string;
  onBreedChange: (breed: string) => void;
  animalNumber?: number;
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

// Liste des races de chiens (sans "Race commune (Croisement)")
const DOG_BREEDS = [
  'Affenpinscher',
  'Airedale Terrier',
  'Aussiedoodle',
  'American Staffordshire Terrier (Staff)',
  'Akita américain',
  'Akita Inu',
  'Azawakh',
  'Barbet',
  'Barzoï',
  'Basenji',
  'Basset artésien normand',
  'Basset bleu de Gascogne',
  'Basset des Alpes',
  'Basset fauve de Bretagne',
  'Basset hound',
  'Beagle',
  'Beagle harrier',
  'Bearded collie',
  'Bedlington terrier',
  'Berger allemand',
  'Berger américain miniature (MAS)',
  'Berger australien',
  'Berger belge Groenendael',
  'Berger belge Laekenois',
  'Berger belge Malinois',
  'Berger belge Tervueren',
  'Berger blanc suisse',
  'Berger d\'Anatolie (Kangal)',
  'Berger de Beauce (Beauceron)',
  'Berger de Bergame',
  'Berger de Brie (Briard)',
  'Berger de Maremme',
  'Berger des Pyrénées',
  'Berger des Shetland',
  'Berger des Tatras',
  'Berger du Caucase',
  'Berger hollandais',
  'Berger islandais',
  'Berger picard',
  'Berger polonais de plaine (Nizinny)',
  'Berger portugais',
  'Berger yougoslave',
  'Bernedoodle',
  'Bichon frisé',
  'Bichon havanais',
  'Bichon maltais',
  'Biewer Yorkshire',
  'Billy',
  'Bobtail',
  'Border collie',
  'Border Terrier',
  'Boston Terrier',
  'Bouledogue américain',
  'Bouledogue anglais',
  'Bouledogue continental',
  'Bouledogue français',
  'Bouvier australien',
  'Bouvier bernois',
  'Bouvier de l\'Entlebuch',
  'Bouvier des Flandres',
  'Boxer',
  'Braque allemand',
  'Braque allemand poils durs (Drahthaar)',
  'Braque d\'Auvergne',
  'Braque de Weimar',
  'Braque du Bourbonnais',
  'Braque français',
  'Braque hongrois',
  'Braque portugais',
  'Braque Saint-Germain',
  'Bruno du Jura',
  'Bull terrier',
  'Bullmastiff',
  'Cairn terrier',
  'Cane corso',
  'Caniche',
  'Caniche moyen',
  'Caniche nain',
  'Caniche Royal',
  'Caniche Toy',
  'Carlin',
  'Cavalier King Charles',
  'Chesapeake bay retriever',
  'Chien courant grec',
  'Chien courant serbe',
  'Chien courant slovaque',
  'Chien courant suisse',
  'Chien d\'arrêt frison',
  'Chien d\'Artois',
  'Chien d\'eau portugais',
  'Chien de Saint-Hubert',
  'Chien loup',
  'Chien loup de Tchécoslovaquie',
  'Chien loup de Saarloos',
  'Chien nu du Mexique',
  'Chien nu du Pérou',
  'Chihuahua',
  'Chow-chow',
  'Cirneco de l\'Etna',
  'Clumber spaniel',
  'Cocker américain',
  'Cocker anglais',
  'Colley à poil court',
  'Colley à poil long',
  'Coton de Tuléar',
  'Dalmatien',
  'Dandie Dinmont Terrier',
  'Dobermann',
  'Dogue allemand',
  'Dogue argentin',
  'Dogue de Bordeaux',
  'Dogue des Canaries (Presa canario)',
  'Dogue du Tibet',
  'Eurasier',
  'Epagneul bleu de Picardie',
  'Epagneul breton',
  'Epagneul de Pont-Audemer',
  'Epagneul d\'eau irlandais (Irish Water Spaniel)',
  'Epagneul français',
  'Epagneul nain continental',
  'Epagneul nain Continental Papillon',
  'Epagneul japonais',
  'Epagneul nain Phalène',
  'Epagneul picard',
  'Epagneul tibétain',
  'Finnois de Laponie',
  'Fox terrier à poils lisses',
  'Fox terrier à poils durs',
  'Goldendoodle',
  'Golden retriever',
  'Grand bleu de Gascogne',
  'Grand bouvier suisse',
  'Griffon (type)',
  'Griffon belge',
  'Griffon bleu de Gascogne',
  'Griffon bruxellois',
  'Griffon fauve de Bretagne',
  'Griffon korthals',
  'Griffon nivernais',
  'Hovawart',
  'Husky de Sibérie',
  'Jack Russell terrier',
  'Jagdterrier',
  'Komondor',
  'Kooikerhondje',
  'Kuvasz',
  'Labradoodle',
  'Labrador retriever',
  'Lagotto Romagnolo',
  'Laika de Lakouti (Yakoutie)',
  'Laika de Sibérie',
  'Lakeland Terrier',
  'Landseer',
  'Laobé',
  'Lhassa apso',
  'Leonberg',
  'Lévrier Afghan',
  'Lévrier anglais (Greyhound)',
  'Lévrier écossais (Deerhound)',
  'Lévrier Galgo espagnol',
  'Lévrier irlandais (Wolfhound)',
  'Lévrier Persan (Saluki)',
  'Lévrier Podenco',
  'Lévrier Sloughi',
  'Lévrier Whippet',
  'Lurcher',
  'Malamute de l\'Alaska',
  'Maltese Poodle (Maltipoo)',
  'Malshi (Maltzu)',
  'Mastiff',
  'Mâtin espagnol',
  'Mâtin des Pyrénées',
  'Mâtin napolitain',
  'Micro Bully',
  'Montagne des Pyrénées (Patou)',
  'Morkie',
  'Norfolk terrier',
  'Norwich terrier',
  'Parson Russell terrier',
  'Petit basset griffon vendéen',
  'Petit brabançon',
  'Petit chien lion (Lowchen)',
  'Petit épagneul de Munster',
  'Petit gascon saintongeois',
  'Petit lévrier italien',
  'Pékinois',
  'Pinscher allemand',
  'Pinscher autrichien',
  'Pinscher nain',
  'Pomsky',
  'Pointer',
  'Poitevin',
  'Porcelaine',
  'Puli',
  'Ratier de Prague',
  'Retriever à poil plat (Flat-coated retriever)',
  'Retriever de la Nouvelle-Ecosse (Nova Scotia)',
  'Rhodesian ridgeback',
  'Rottweiler',
  'Rouge de Bavière',
  'Royal Bourbon',
  'Saint-Bernard',
  'Samoyède',
  'Schipperke',
  'Schnauzer',
  'Scottish terrier',
  'Setter anglais',
  'Setter gordon',
  'Setter irlandais',
  'Schapendoes néerlandais',
  'Schnauzer géant',
  'Schnauzer moyen',
  'Schnauzer nain',
  'Schnoodle (Snoodle)',
  'Setter',
  'Shar-Pei',
  'Shiba Inu',
  'Shih Tzu',
  'Spitz allemand',
  'Spitz japonais',
  'Spitz loup',
  'Spitz moyen',
  'Spitz nain (Loulou de Poméranie)',
  'Springer spaniel anglais',
  'Staffordshire bull terrier (Staffie)',
  'Skye Terrier',
  'Teckel',
  'Teckel à poil dur',
  'Teckel à poil long',
  'Teckel à poil ras',
  'Terre-Neuve',
  'Terrier australien',
  'Terrier Kerry Blue',
  'Terrier noir russe',
  'Terrier tibétain',
  'Tosa',
  'Welsh Corgi',
  'Welsh Terrier',
  'West Highland (Westie)',
  'West Highland white terrier',
  'Yorkshire terrier'
];

const BreedSelector: React.FC<BreedSelectorProps> = ({
  animalSpecies,
  selectedBreed,
  onBreedChange,
  animalNumber
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customBreed, setCustomBreed] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const baseBreeds = animalSpecies === 'chat' ? CAT_BREEDS : DOG_BREEDS;
  const noBreedLabel = animalSpecies === 'chat' ? 'Sans race/ type européen' : 'Sans race/ croisement';

  // Filtrer les races selon le terme de recherche
  const filteredBreeds = baseBreeds.filter(breed => 
    breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ajouter l'option "Autre" à la fin
  const breedsWithOther = [...filteredBreeds, 'Autre'];

  // Gérer la checkbox "sans race"
  const isNoBreed = selectedBreed === 'no-breed';
  const isOtherBreed = selectedBreed === 'Autre' || (selectedBreed && !baseBreeds.includes(selectedBreed) && selectedBreed !== 'no-breed');
  
  const handleNoBreedChange = (checked: boolean) => {
    if (checked) {
      onBreedChange('no-breed');
      setCustomBreed('');
    } else {
      onBreedChange('');
    }
  };

  const handleBreedSelectChange = (breed: string) => {
    if (breed === 'Autre') {
      onBreedChange('Autre');
      setCustomBreed('');
    } else {
      onBreedChange(breed);
      setCustomBreed('');
    }
    setIsOpen(false);
  };

  const handleCustomBreedChange = (value: string) => {
    setCustomBreed(value);
    onBreedChange(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value && !isNoBreed) {
      // Si l'utilisateur tape, on cherche dans les races existantes
      const matchingBreed = baseBreeds.find(breed => 
        breed.toLowerCase().startsWith(value.toLowerCase())
      );
      if (matchingBreed) {
        onBreedChange(matchingBreed);
      } else {
        onBreedChange(value);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm sm:text-base font-medium text-vet-navy">
        Quelle est la race ?
        <span className="text-vet-navy ml-1">*</span>
      </Label>
      
      {!isNoBreed && (
        <div className="relative">
          <Input
            type="text"
            placeholder="Écrivez pour trouver la race"
            value={isOtherBreed && selectedBreed !== 'Autre' ? selectedBreed : searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors"
          />
          
          {isOpen && searchTerm && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {breedsWithOther.map(breed => (
                <button
                  key={breed}
                  type="button"
                  onClick={() => handleBreedSelectChange(breed)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg text-sm"
                >
                  {breed}
                </button>
              ))}
              {breedsWithOther.length === 1 && breedsWithOther[0] === 'Autre' && (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  Aucune race trouvée
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!isNoBreed && !isOpen && !searchTerm && (
        <Select 
          value={isOtherBreed ? 'Autre' : selectedBreed} 
          onValueChange={handleBreedSelectChange}
          onOpenChange={setIsOpen}
        >
          <SelectTrigger className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors">
            <SelectValue placeholder="Sélectionnez ou écrivez pour chercher" />
          </SelectTrigger>
          <SelectContent>
            {breedsWithOther.map(breed => (
              <SelectItem key={breed} value={breed}>
                {breed}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {/* Champ personnalisé pour "Autre" */}
      {(selectedBreed === 'Autre' || isOtherBreed) && !isNoBreed && (
        <div className="mt-2">
          <Input
            type="text"
            placeholder="Précisez la race"
            value={customBreed}
            onChange={(e) => handleCustomBreedChange(e.target.value)}
            className="h-12 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-lg hover:border-vet-sage/50 focus:border-vet-sage transition-colors"
          />
        </div>
      )}
      
      {/* Checkbox sans race */}
      <div className="flex items-center space-x-2 mt-3">
        <Checkbox 
          id={`no-breed-${animalNumber || 'single'}`}
          checked={isNoBreed}
          onCheckedChange={handleNoBreedChange}
        />
        <Label 
          htmlFor={`no-breed-${animalNumber || 'single'}`}
          className="text-sm text-vet-navy cursor-pointer"
        >
          {noBreedLabel}
        </Label>
      </div>
    </div>
  );
};

export default BreedSelector;
