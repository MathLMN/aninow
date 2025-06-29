
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Settings, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ConsultationReasonSelect from "@/components/ConsultationReasonSelect";
import { useState, useEffect } from "react";

const ConsultationReason = () => {
  const navigate = useNavigate();
  const [consultationReason, setConsultationReason] = useState('');

  useEffect(() => {
    // Vérifier que les données du formulaire précédent existent
    const bookingData = localStorage.getItem('bookingFormData');
    if (!bookingData) {
      navigate('/');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/');
  };

  const handleNext = () => {
    if (consultationReason) {
      // Récupérer les données existantes et ajouter le motif de consultation
      const existingData = JSON.parse(localStorage.getItem('bookingFormData') || '{}');
      const updatedData = {
        ...existingData,
        consultationReason
      };
      
      localStorage.setItem('bookingFormData', JSON.stringify(updatedData));
      console.log('Updated booking data:', updatedData);
      
      // Naviguer vers la page suivante (créneaux)
      navigate('/booking/slots');
    }
  };

  const canProceed = consultationReason !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      {/* Header */}
      <header className="bg-vet-navy text-vet-beige shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-6 w-6 text-vet-sage" />
              <span className="text-xl font-bold">AniNow</span>
            </div>
            <Link to="/vet/login">
              <Button variant="ghost" className="text-vet-beige hover:bg-white/10">
                <Settings className="h-4 w-4 mr-2" />
                Espace Clinique
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Bouton retour */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="text-vet-navy hover:bg-vet-beige/20 p-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>

          {/* Titre */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-vet-navy mb-2">
              Motif de consultation
            </h1>
          </div>

          {/* Formulaire */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardContent className="p-8">
              <div className="space-y-8">
                <ConsultationReasonSelect
                  value={consultationReason}
                  onValueChange={setConsultationReason}
                />

                {/* Bouton Suivant */}
                <div className="flex justify-center pt-6">
                  <Button 
                    onClick={handleNext} 
                    disabled={!canProceed} 
                    className="bg-vet-sage hover:bg-vet-sage/90 text-white px-8 py-3 text-lg"
                  >
                    Suivant
                    <ArrowRight className="ml-2 h-5 w-5" />
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
