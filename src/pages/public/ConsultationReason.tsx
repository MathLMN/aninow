
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ConsultationReasonSelect from "@/components/ConsultationReasonSelect";
import ConvenienceConsultationSelect from "@/components/ConvenienceConsultationSelect";
import SymptomSelector from "@/components/SymptomSelector";
import SecondAnimalSection from "@/components/SecondAnimalSection";
import Header from "@/components/Header";
import { useConsultationReason } from "@/hooks/useConsultationReason";
import { useIsMobile } from "@/hooks/use-mobile";

const ConsultationReason = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [bookingData, setBookingData] = useState<any>(null);
  
  const {
    consultationReason,
    setConsultationReason,
    convenienceOptions,
    setConvenienceOptions,
    customText,
    setCustomText,
    selectedSymptoms,
    setSelectedSymptoms,
    customSymptom,
    setCustomSymptom,
    secondAnimalSelectedSymptoms,
    setSecondAnimalSelectedSymptoms,
    secondAnimalCustomSymptom,
    setSecondAnimalCustomSymptom,
    secondAnimalDifferentReason,
    setSecondAnimalDifferentReason,
    secondAnimalConsultationReason,
    setSecondAnimalConsultationReason,
    secondAnimalConvenienceOptions,
    setSecondAnimalConvenienceOptions,
    secondAnimalCustomText,
    setSecondAnimalCustomText,
    hasTwoAnimals,
    handleNext,
    canProceed,
    shouldForceConvenienceForAnimal2
  } = useConsultationReason();

  useEffect(() => {
    // Récupérer les données du formulaire pour obtenir les prénoms des animaux
    const storedData = localStorage.getItem('bookingFormData');
    if (storedData) {
      setBookingData(JSON.parse(storedData));
    }
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const firstAnimalName = bookingData?.animalName || 'votre animal';
  const secondAnimalName = bookingData?.secondAnimalName || 'le deuxième animal';

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)' }}>
      <Header />

      <main className="container mx-auto px-3 sm:px-6 py-3 sm:py-8 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Titre - Mobile optimized */}
          <div className="text-center mb-4 sm:mb-8 animate-fade-in">
            <h1 className="text-xl sm:text-3xl font-bold text-vet-navy mb-2 px-2">
              Motif de consultation
            </h1>
          </div>

          {/* Formulaire - Mobile optimized */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl relative">
            <CardContent className="p-3 sm:p-8">
              {/* Bouton retour - À l'intérieur de la carte, en haut */}
              <div className="mb-4 sm:mb-6">
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  className="text-vet-navy hover:bg-vet-beige/20 p-2 text-sm sm:text-base -ml-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </div>

              <div className="space-y-4 sm:space-y-8">
                {/* Affichage unifié tant que pas de motif différent pour le 2e animal */}
                {(!hasTwoAnimals || !secondAnimalDifferentReason) && (
                  <div className="space-y-3 sm:space-y-4">
                    <ConsultationReasonSelect
                      value={consultationReason}
                      onValueChange={setConsultationReason}
                    />
                    
                    {/* Sélection des options de convenance */}
                    {consultationReason === 'consultation-convenance' && (
                      <ConvenienceConsultationSelect
                        selectedOptions={convenienceOptions}
                        onOptionsChange={setConvenienceOptions}
                        customText={customText}
                        onCustomTextChange={setCustomText}
                      />
                    )}

                    {/* Sélection des symptômes - Affiché directement même avec 2 animaux */}
                    {consultationReason === 'symptomes-anomalie' && (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="border-t border-gray-200 pt-4">
                          <h3 className="text-base sm:text-lg font-semibold text-vet-navy mb-3">
                            Quels symptômes vous amènent à consulter ? <span className="text-vet-navy ml-1">*</span>
                          </h3>
                          <SymptomSelector
                            selectedSymptoms={selectedSymptoms}
                            onSymptomsChange={setSelectedSymptoms}
                            customSymptom={customSymptom}
                            onCustomSymptomChange={setCustomSymptom}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <SecondAnimalSection
                  hasTwoAnimals={hasTwoAnimals}
                  shouldForceConvenienceForAnimal2={shouldForceConvenienceForAnimal2}
                  secondAnimalDifferentReason={secondAnimalDifferentReason}
                  onSecondAnimalDifferentReasonChange={setSecondAnimalDifferentReason}
                  consultationReason={consultationReason}
                  onConsultationReasonChange={setConsultationReason}
                  convenienceOptions={convenienceOptions}
                  onConvenienceOptionsChange={setConvenienceOptions}
                  customText={customText}
                  onCustomTextChange={setCustomText}
                  selectedSymptoms={selectedSymptoms}
                  onSymptomsChange={setSelectedSymptoms}
                  customSymptom={customSymptom}
                  onCustomSymptomChange={setCustomSymptom}
                  secondAnimalConsultationReason={secondAnimalConsultationReason}
                  onSecondAnimalConsultationReasonChange={setSecondAnimalConsultationReason}
                  secondAnimalConvenienceOptions={secondAnimalConvenienceOptions}
                  onSecondAnimalConvenienceOptionsChange={setSecondAnimalConvenienceOptions}
                  secondAnimalCustomText={secondAnimalCustomText}
                  onSecondAnimalCustomTextChange={setSecondAnimalCustomText}
                  secondAnimalSelectedSymptoms={secondAnimalSelectedSymptoms}
                  onSecondAnimalSymptomsChange={setSecondAnimalSelectedSymptoms}
                  secondAnimalCustomSymptom={secondAnimalCustomSymptom}
                  onSecondAnimalCustomSymptomChange={setSecondAnimalCustomSymptom}
                  firstAnimalName={firstAnimalName}
                  secondAnimalName={secondAnimalName}
                />
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

export default ConsultationReason;
