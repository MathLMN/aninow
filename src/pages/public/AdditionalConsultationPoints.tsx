
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import SelectionButton from "@/components/SelectionButton";
import AdditionalPointsSelector from "@/components/AdditionalPointsSelector";
import { useIsMobile } from "@/hooks/use-mobile";

const AdditionalConsultationPoints = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [hasAdditionalPoints, setHasAdditionalPoints] = useState('');
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [customPoint, setCustomPoint] = useState('');
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    // Vérifier que l'utilisateur vient bien de la page de durée des symptômes
    const storedData = localStorage.getItem('bookingFormData');
    if (!storedData) {
      navigate('/');
      return;
    }
    const parsedData = JSON.parse(storedData);
    setBookingData(parsedData);

    // Vérifier que le motif est bien "symptomes-anomalie"
    const hasSymptomConsultation = parsedData.consultationReason === 'symptomes-anomalie' || 
      parsedData.secondAnimalConsultationReason === 'symptomes-anomalie';
    
    if (!hasSymptomConsultation) {
      navigate('/booking/animal-info');
      return;
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/booking/duration');
  };

  const handleNext = () => {
    if (!hasAdditionalPoints) return;

    const existingData = JSON.parse(localStorage.getItem('bookingFormData') || '{}');
    const updatedData = {
      ...existingData,
      hasAdditionalConsultationPoints: hasAdditionalPoints,
      ...(hasAdditionalPoints === 'oui' && {
        additionalPoints: selectedPoints,
        customAdditionalPoint: customPoint
      })
    };
    localStorage.setItem('bookingFormData', JSON.stringify(updatedData));
    console.log('Updated booking data with additional consultation points:', updatedData);

    // Naviguer vers la page des informations animal
    navigate('/booking/animal-info');
  };

  const canProceed = hasAdditionalPoints !== '' && 
    (hasAdditionalPoints === 'non' || 
     (hasAdditionalPoints === 'oui' && (selectedPoints.length > 0 || customPoint.trim() !== '')));

  if (!bookingData) {
    return null;
  }

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)'
    }}>
      <Header />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <ProgressBar value={71.4} />
          
          {/* Titre */}
          <div className="text-center mb-4 sm:mb-8 animate-fade-in">
            <h1 className="text-xl sm:text-3xl font-bold text-vet-navy mb-2 px-2">
              Points supplémentaires
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

              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg text-vet-navy text-left mb-4 sm:mb-6">
                  Il y aura-t-il d'autres points à voir pendant la consultation ?
                  <span className="text-red-500 ml-1">*</span>
                </h3>
                
                {/* Boutons Oui/Non plus petits */}
                <div className="flex gap-3 justify-center sm:justify-start">
                  <SelectionButton
                    id="additional-points-yes"
                    value="oui"
                    isSelected={hasAdditionalPoints === 'oui'}
                    onSelect={(value) => {
                      setHasAdditionalPoints(value);
                      if (value !== 'oui') {
                        setSelectedPoints([]);
                        setCustomPoint('');
                      }
                    }}
                    className="px-6 py-2 text-sm font-medium min-w-[80px]"
                  >
                    <span className="text-center">Oui</span>
                  </SelectionButton>
                  
                  <SelectionButton
                    id="additional-points-no"
                    value="non"
                    isSelected={hasAdditionalPoints === 'non'}
                    onSelect={(value) => {
                      setHasAdditionalPoints(value);
                      if (value !== 'oui') {
                        setSelectedPoints([]);
                        setCustomPoint('');
                      }
                    }}
                    className="px-6 py-2 text-sm font-medium min-w-[80px]"
                  >
                    <span className="text-center">Non</span>
                  </SelectionButton>
                </div>

                {/* Sélection des points supplémentaires si "oui" est sélectionné */}
                {hasAdditionalPoints === 'oui' && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm sm:text-base text-vet-navy mb-4">
                      Sélectionnez parmi cette liste :
                      <span className="text-red-500 ml-1">*</span>
                    </h4>
                    <AdditionalPointsSelector
                      selectedPoints={selectedPoints}
                      onPointsChange={setSelectedPoints}
                      customPoint={customPoint}
                      onCustomPointChange={setCustomPoint}
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

export default AdditionalConsultationPoints;
