
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConsultationReasonSelect from "@/components/ConsultationReasonSelect";
import ConvenienceConsultationSelect from "@/components/ConvenienceConsultationSelect";
import SecondAnimalSection from "@/components/SecondAnimalSection";
import Header from "@/components/Header";
import { useConsultationReason } from "@/hooks/useConsultationReason";

const ConsultationReason = () => {
  const navigate = useNavigate();
  const {
    consultationReason,
    setConsultationReason,
    convenienceOptions,
    setConvenienceOptions,
    customText,
    setCustomText,
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

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)' }}>
      <Header />

      <main className="container mx-auto px-3 sm:px-6 py-3 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Bouton retour - Mobile optimized */}
          <div className="mb-3 sm:mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="text-vet-navy hover:bg-vet-beige/20 p-1 text-sm sm:p-2 sm:text-base -ml-2"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Retour
            </Button>
          </div>

          {/* Titre - Mobile optimized */}
          <div className="text-center mb-4 sm:mb-8 animate-fade-in">
            <h1 className="text-xl sm:text-3xl font-bold text-vet-navy mb-2 px-2">
              Motif de consultation
            </h1>
          </div>

          {/* Formulaire - Mobile optimized */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardContent className="p-3 sm:p-8">
              <div className="space-y-4 sm:space-y-8">
                {/* Si pas de deuxième animal OU si le motif n'est pas différent pour le 2e animal */}
                {(!hasTwoAnimals || !secondAnimalDifferentReason) && (
                  <div className="space-y-3 sm:space-y-4">
                    <ConsultationReasonSelect
                      value={consultationReason}
                      onValueChange={setConsultationReason}
                    />
                    
                    {/* Sélection des options de convenance pour le premier animal */}
                    {consultationReason === 'consultation-convenance' && (
                      <ConvenienceConsultationSelect
                        selectedOptions={convenienceOptions}
                        onOptionsChange={setConvenienceOptions}
                        customText={customText}
                        onCustomTextChange={setCustomText}
                      />
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
                  secondAnimalConsultationReason={secondAnimalConsultationReason}
                  onSecondAnimalConsultationReasonChange={setSecondAnimalConsultationReason}
                  secondAnimalConvenienceOptions={secondAnimalConvenienceOptions}
                  onSecondAnimalConvenienceOptionsChange={setSecondAnimalConvenienceOptions}
                  secondAnimalCustomText={secondAnimalCustomText}
                  onSecondAnimalCustomTextChange={setSecondAnimalCustomText}
                />

                {/* Bouton Suivant - Identique à celui de la première page */}
                <div className="pt-3 sm:pt-4">
                  <Button 
                    onClick={handleNext} 
                    disabled={!canProceed} 
                    className="bg-vet-sage hover:bg-vet-sage/90 disabled:opacity-50 disabled:cursor-not-allowed text-white w-full h-12 sm:h-11 text-base sm:text-lg font-medium rounded-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200"
                  >
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ConsultationReason;
