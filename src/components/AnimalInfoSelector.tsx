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

// Liste des races de chiens
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
  'Race commune (Croisement)',
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
