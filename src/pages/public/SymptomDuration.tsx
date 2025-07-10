
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import SelectionButton from "@/components/SelectionButton";
import { useIsMobile } from "@/hooks/use-mobile";

const SymptomDuration = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedDuration, setSelectedDuration] = useState('');
  const [bookingData, setBookingData] = useState<any>(null);

  const durationOptions = [
    '1 à 2 jours',
    '3 à 5 jours', 
    '1 semaine',
    'Plusieurs semaines'
  ];

  useEffect(() => {
    // Vérifier que l'utilisateur vient bien des questions conditionnelles
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
      navigate('/booking/slots');
      return;
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/booking/questions');
  };

  const handleNext = () => {
    if (!selectedDuration) return;

    const existingData = JSON.parse(localStorage.getItem('bookingFormData') || '{}');
    const updatedData = {
      ...existingData,
      symptomDuration: selectedDuration
    };
    localStorage.setItem('bookingFormData', JSON.stringify(updatedData));
    console.log('Updated booking data with symptom duration:', updatedData);

    // Naviguer vers la page des points supplémentaires
    navigate('/booking/additional-points');
  };

  const canProceed = selectedDuration !== '';

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
          <ProgressBar value={57.1} />
          
          {/* Titre */}
          <div className="text-center mb-4 sm:mb-8 animate-fade-in">
            <h1 className="text-xl sm:text-3xl font-bold text-vet-navy mb-2 px-2">
              Durée des symptômes
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
                  Depuis combien de temps observez-vous ce(s) symptôme(s) ?
                  <span className="text-red-500 ml-1">*</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {durationOptions.map((option) => (
                    <SelectionButton
                      key={option}
                      id={`symptom-duration-${option}`}
                      value={option}
                      isSelected={selectedDuration === option}
                      onSelect={setSelectedDuration}
                      className="p-3 text-sm font-medium"
                    >
                      <span className="text-center leading-tight">{option}</span>
                    </SelectionButton>
                  ))}
                </div>
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

export default SymptomDuration;
