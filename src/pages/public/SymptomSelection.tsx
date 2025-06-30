
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SymptomSelector from "@/components/SymptomSelector";

const SymptomSelection = () => {
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');

  useEffect(() => {
    // Vérifier que l'utilisateur vient bien de la page motif avec "symptomes-anomalie"
    const bookingData = localStorage.getItem('bookingFormData');
    if (!bookingData) {
      navigate('/');
      return;
    }

    const parsedData = JSON.parse(bookingData);
    if (parsedData.consultationReason !== 'symptomes-anomalie') {
      navigate('/booking/reason');
      return;
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/booking/reason');
  };

  const handleNext = () => {
    if (selectedSymptoms.length > 0 || customSymptom.trim() !== '') {
      const existingData = JSON.parse(localStorage.getItem('bookingFormData') || '{}');
      const updatedData = {
        ...existingData,
        selectedSymptoms,
        customSymptom: customSymptom.trim()
      };
      
      localStorage.setItem('bookingFormData', JSON.stringify(updatedData));
      console.log('Updated booking data with symptoms:', updatedData);
      
      // Naviguer vers la page des questions conditionnelles
      navigate('/booking/questions');
    }
  };

  const canProceed = selectedSymptoms.length > 0 || customSymptom.trim() !== '';

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)' }}>
      <Header />

      <main className="container mx-auto px-3 sm:px-6 py-3 sm:py-8 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Bouton retour */}
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

          {/* Titre */}
          <div className="text-center mb-4 sm:mb-8 animate-fade-in">
            <h1 className="text-xl sm:text-3xl font-bold text-vet-navy mb-2 px-2">
              Quels symptômes vous amènent à consulter ?
            </h1>
            <p className="text-sm sm:text-base text-vet-brown/80">
              Sélectionnez un ou plusieurs symptômes *
            </p>
          </div>

          {/* Formulaire */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardContent className="p-3 sm:p-8">
              <div className="space-y-4 sm:space-y-6">
                <SymptomSelector
                  selectedSymptoms={selectedSymptoms}
                  onSymptomsChange={setSelectedSymptoms}
                  customSymptom={customSymptom}
                  onCustomSymptomChange={setCustomSymptom}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Bouton Continuer fixe en bas à droite */}
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
    </div>
  );
};

export default SymptomSelection;
