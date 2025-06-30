
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";

const ConditionalQuestions = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<{[key: string]: any}>({});

  useEffect(() => {
    // Vérifier que l'utilisateur vient bien de la page symptômes
    const bookingData = localStorage.getItem('bookingFormData');
    if (!bookingData) {
      navigate('/');
      return;
    }

    const parsedData = JSON.parse(bookingData);
    
    // Vérifier que des symptômes ont été sélectionnés ou qu'un symptôme personnalisé a été saisi
    const hasSymptoms = parsedData.selectedSymptoms?.length > 0 || parsedData.customSymptom?.trim() !== '';
    if (!hasSymptoms) {
      navigate('/booking/symptoms');
      return;
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/booking/symptoms');
  };

  const handleNext = () => {
    // TODO: Validation logic will be added when questions are implemented
    const existingData = JSON.parse(localStorage.getItem('bookingFormData') || '{}');
    const updatedData = {
      ...existingData,
      conditionalAnswers: answers
    };
    
    localStorage.setItem('bookingFormData', JSON.stringify(updatedData));
    console.log('Updated booking data with conditional answers:', updatedData);
    
    // Naviguer vers la page suivante (créneaux)
    navigate('/booking/slots');
  };

  const canProceed = true; // TODO: Update this when validation logic is added

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)' }}>
      <Header />

      <main className="container mx-auto px-3 sm:px-6 py-3 sm:py-8">
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
              Quelques questions complémentaires
            </h1>
            <p className="text-sm sm:text-base text-vet-brown/80">
              Aidez-nous à mieux comprendre la situation
            </p>
          </div>

          {/* Formulaire */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardContent className="p-3 sm:p-8">
              <div className="space-y-4 sm:space-y-6">
                
                {/* Placeholder pour les questions conditionnelles */}
                <div className="text-center text-vet-brown/60 py-8">
                  <p className="text-sm sm:text-base">
                    Les questions conditionnelles seront ajoutées ici selon la logique que vous fournirez.
                  </p>
                </div>

                {/* Bouton Suivant */}
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

export default ConditionalQuestions;
