
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import AnimalInfoSelector from "@/components/AnimalInfoSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBookingFormData } from "@/hooks/useBookingFormData";
import { useBookingNavigation } from "@/hooks/useBookingNavigation";

const AnimalInfo = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { bookingData, updateBookingData } = useBookingFormData();
  const { navigateBack, navigateNext } = useBookingNavigation();
  
  // États pour l'animal 1
  const [firstAnimalBreed, setFirstAnimalBreed] = useState('');
  const [firstAnimalAge, setFirstAnimalAge] = useState('');
  const [firstAnimalWeight, setFirstAnimalWeight] = useState('');
  const [firstAnimalSex, setFirstAnimalSex] = useState('');
  
  // États pour l'animal 2 (si applicable)
  const [secondAnimalBreed, setSecondAnimalBreed] = useState('');
  const [secondAnimalAge, setSecondAnimalAge] = useState('');
  const [secondAnimalWeight, setSecondAnimalWeight] = useState('');
  const [secondAnimalSex, setSecondAnimalSex] = useState('');

  useEffect(() => {
    // Charger les données existantes
    if (bookingData.animalBreed) setFirstAnimalBreed(bookingData.animalBreed);
    if (bookingData.animalAge) setFirstAnimalAge(bookingData.animalAge);
    if (bookingData.animalWeight) setFirstAnimalWeight(bookingData.animalWeight.toString());
    if (bookingData.animalSex) setFirstAnimalSex(bookingData.animalSex);
    if (bookingData.secondAnimalBreed) setSecondAnimalBreed(bookingData.secondAnimalBreed);
    if (bookingData.secondAnimalAge) setSecondAnimalAge(bookingData.secondAnimalAge);
    if (bookingData.secondAnimalWeight) setSecondAnimalWeight(bookingData.secondAnimalWeight.toString());
    if (bookingData.secondAnimalSex) setSecondAnimalSex(bookingData.secondAnimalSex);
  }, [bookingData]);

  const handleBack = () => {
    navigateBack('/booking/animal-info');
  };

  const handleNext = () => {
    if (!canProceed) return;

    const updatedData = {
      animalBreed: firstAnimalBreed,
      animalAge: firstAnimalAge,
      animalWeight: firstAnimalWeight ? parseFloat(firstAnimalWeight) : undefined,
      animalSex: firstAnimalSex,
      ...(hasTwoAnimals && {
        secondAnimalBreed,
        secondAnimalAge,
        secondAnimalWeight: secondAnimalWeight ? parseFloat(secondAnimalWeight) : undefined,
        secondAnimalSex
      })
    };
    
    updateBookingData(updatedData);
    console.log('AnimalInfo: Updated booking data:', updatedData);

    navigateNext('/booking/animal-info');
  };

  if (!bookingData) {
    return null;
  }

  const hasTwoAnimals = bookingData.multipleAnimals?.includes('2-animaux');
  const isLitter = bookingData.multipleAnimals?.includes('une-portee');
  const firstAnimalName = bookingData.animalName || 'votre animal';
  const secondAnimalName = bookingData.secondAnimalName || 'le deuxième animal';

  // Logique de validation adaptée pour les portées
  const isFirstAnimalValid = (firstAnimalBreed !== '' && firstAnimalBreed !== 'no-breed') || firstAnimalBreed === 'no-breed';
  const isSecondAnimalValid = !hasTwoAnimals || ((secondAnimalBreed !== '' && secondAnimalBreed !== 'no-breed') || secondAnimalBreed === 'no-breed');
  
  // Pour une portée, l'âge n'est pas requis
  const canProceed = isFirstAnimalValid && 
    (isLitter || (firstAnimalAge !== '' && firstAnimalWeight !== '' && firstAnimalSex !== '')) && 
    isSecondAnimalValid && 
    (!hasTwoAnimals || isLitter || (secondAnimalAge !== '' && secondAnimalWeight !== '' && secondAnimalSex !== ''));

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)'
    }}>
      <Header />

      <main className="container mx-auto px-3 sm:px-6 pt-20 sm:pt-24 py-4 sm:py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <ProgressBar value={85.7} />
          
          {/* Titre */}
          <div className="text-center mb-4 sm:mb-8 animate-fade-in">
            <h1 className="text-xl sm:text-3xl font-bold text-vet-navy mb-2 px-2">
              {isLitter ? 'Informations sur la portée' : 
               hasTwoAnimals ? 'Informations sur vos animaux' : 'Informations sur votre animal'}
            </h1>
          </div>

          {/* Formulaire */}
          <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg relative">
            <CardContent className="p-3 sm:p-6">
              {/* Bouton retour - À l'intérieur de la carte, en haut */}
              <div className="mb-4 sm:mb-6">
                <Button variant="ghost" onClick={handleBack} className="text-vet-navy hover:bg-vet-beige/20 p-2 text-sm sm:text-base -ml-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {/* Informations Animal 1 */}
                <AnimalInfoSelector
                  animalName={firstAnimalName}
                  animalNumber={hasTwoAnimals ? 1 : undefined}
                  selectedBreed={firstAnimalBreed}
                  onBreedChange={setFirstAnimalBreed}
                  selectedAge={firstAnimalAge}
                  onAgeChange={setFirstAnimalAge}
                  selectedWeight={firstAnimalWeight}
                  onWeightChange={setFirstAnimalWeight}
                  selectedSex={firstAnimalSex}
                  onSexChange={setFirstAnimalSex}
                  isLitter={isLitter}
                />

                {/* Informations Animal 2 si applicable */}
                {hasTwoAnimals && (
                  <div className="border-t border-gray-200 pt-6">
                    <AnimalInfoSelector
                      animalName={secondAnimalName}
                      animalNumber={2}
                      selectedBreed={secondAnimalBreed}
                      onBreedChange={setSecondAnimalBreed}
                      selectedAge={secondAnimalAge}
                      onAgeChange={setSecondAnimalAge}
                      selectedWeight={secondAnimalWeight}
                      onWeightChange={setSecondAnimalWeight}
                      selectedSex={secondAnimalSex}
                      onSexChange={setSecondAnimalSex}
                      isLitter={false}
                    />
                  </div>
                )}
              </div>

              {/* Bouton Continuer - Desktop/Tablet: dans la card, Mobile: fixe */}
              {!isMobile && (
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                  <Button 
                    onClick={handleNext} 
                    disabled={!canProceed} 
                    className="bg-vet-sage hover:bg-vet-sage/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Continuer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bouton Continuer fixe en bas à droite - Mobile seulement */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={handleNext} 
            disabled={!canProceed} 
            className="bg-vet-sage hover:bg-vet-sage/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Continuer
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AnimalInfo;
