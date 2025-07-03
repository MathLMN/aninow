
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";

const ClientComment = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Vérifier que les données du formulaire existent
    const storedData = localStorage.getItem('bookingFormData');
    if (!storedData) {
      navigate('/');
      return;
    }
    
    // Récupérer le commentaire existant s'il y en a un
    const parsedData = JSON.parse(storedData);
    if (parsedData.clientComment) {
      setComment(parsedData.clientComment);
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/booking/animal-info');
  };

  const handleNext = () => {
    // Sauvegarder le commentaire (même s'il est vide car optionnel)
    const existingData = JSON.parse(localStorage.getItem('bookingFormData') || '{}');
    const updatedData = {
      ...existingData,
      clientComment: comment.trim()
    };
    
    localStorage.setItem('bookingFormData', JSON.stringify(updatedData));
    console.log('Updated booking data with comment:', updatedData);

    // Naviguer vers la page des coordonnées client
    navigate('/booking/contact-info');
  };

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)'
    }}>
      <Header />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20">
        <div className="max-w-2xl mx-auto">
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
              Laissez-nous un commentaire si besoin (optionnel)
            </h1>
          </div>

          {/* Formulaire */}
          <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg relative">
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-4">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Exemples : précisions ou explications supplémentaires, animal agressif ou peureux, antécédents médicaux..."
                  className="min-h-[120px] sm:min-h-[150px] resize-none border-2 border-gray-200 rounded-lg focus:border-vet-sage transition-colors text-sm sm:text-base"
                />
              </div>

              {/* Bouton Continuer - Desktop/Tablet: dans la card, Mobile: fixe */}
              {!isMobile && (
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                  <Button 
                    onClick={handleNext} 
                    className="bg-vet-sage hover:bg-vet-sage/90 text-white px-6 py-2 text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Suivant
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
            className="bg-vet-sage hover:bg-vet-sage/90 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Suivant
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClientComment;
