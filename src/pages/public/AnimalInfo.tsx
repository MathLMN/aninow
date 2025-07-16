
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import AnimalInfoSelector from "@/components/AnimalInfoSelector";
import { useIsMobile } from "@/hooks/use-mobile";

const AnimalInfo = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [bookingData, setBookingData] = useState<any>(null);
  const [previousRoute, setPreviousRoute] = useState<string>('');
  
  // États pour l'animal 1
  const [firstAnimalBreed, setFirstAnimalBreed] = useState('');
  const [firstAnimalAge, setFirstAnimalAge] = useState('');
  
  // États pour l'animal 2 (si applicable)
  const [secondAnimalBreed, setSecondAnimalBreed] = useState('');
  const [secondAnimalAge, setSecondAnimalAge] = useState('');

  useEffect(() => {
    // Vérifier que les données du formulaire existent
    const storedData = localStorage.getItem('bookingFormData');
    if (!storedData) {
      navigate('/');
      return;
    }
    
    const parsedData = JSON.parse(storedData);
    setBookingData(parsedData);

    // Déterminer d'où vient l'utilisateur pour le bouton retour
    const isLitter = parsedData.multipleAnimals?.includes('une-portee');
    
    if (isLitter) {
      // Pour une portée, retour vers la première page
      setPreviousRoute('/');
    } else {
      // Déterminer la route précédente selon le flux normal
      const hasSymptomConsultation = parsedData.consultationReason === 'symptomes-anomalie' || 
        parsedData.secondAnimalConsultationReason === 'symptomes-anomalie';
      
      if (hasSymptomConsultation && parsedData.hasAdditionalConsultationPoints !== undefined) {
        // Vient de la page des points supplémentaires
        setPreviousRoute('/booking/additional-points');
      } else {
        // Vient de la page motif de consultation (consultation de convenance)
        setPreviousRoute('/booking/consultation-reason');
      }
    }
  }, [navigate]);

  const handleBack = () => {
    navigate(previousRoute);
  };

  const handleNext = () => {
    if (!canProceed) return;

    const existingData = JSON.parse(localStorage.getItem('bookingFormData') || '{}');
    const updatedData = {
      ...existingData,
      firstAnimalBreed,
      firstAnimalAge,
      ...(hasTwoAnimals && {
        secondAnimalBreed,
        secondAnimalAge
      })
    };
    
    localStorage.setItem('bookingFormData', JSON.stringify(updatedData));
    console.log('Updated booking data with animal info:', updatedData);

    // Naviguer vers la page de commentaire client (route corrigée)
    navigate('/booking/client-comment');
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
    (isLitter || firstAnimalAge !== '') && 
    isSecondAnimalValid && 
    (!hasTwoAnimals || isLitter || secondAnimalAge !== '');

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)'
    }}>
      <Header />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20">
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
