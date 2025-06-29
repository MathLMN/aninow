
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Settings, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ConsultationReasonSelect from "@/components/ConsultationReasonSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

const ConsultationReason = () => {
  const navigate = useNavigate();
  const [consultationReason, setConsultationReason] = useState('');
  const [secondAnimalDifferentReason, setSecondAnimalDifferentReason] = useState(false);
  const [secondAnimalConsultationReason, setSecondAnimalConsultationReason] = useState('');
  const [hasTwoAnimals, setHasTwoAnimals] = useState(false);

  useEffect(() => {
    // Vérifier que les données du formulaire précédent existent
    const bookingData = localStorage.getItem('bookingFormData');
    if (!bookingData) {
      navigate('/');
      return;
    }

    const parsedData = JSON.parse(bookingData);
    // Vérifier si l'utilisateur a sélectionné "2 animaux"
    const hasSecondAnimal = parsedData.multipleAnimals?.includes('2-animaux');
    setHasTwoAnimals(hasSecondAnimal);
  }, [navigate]);

  const handleBack = () => {
    navigate('/');
  };

  const handleNext = () => {
    if (consultationReason && (!secondAnimalDifferentReason || secondAnimalConsultationReason)) {
      // Récupérer les données existantes et ajouter le motif de consultation
      const existingData = JSON.parse(localStorage.getItem('bookingFormData') || '{}');
      const updatedData = {
        ...existingData,
        consultationReason,
        secondAnimalDifferentReason,
        secondAnimalConsultationReason: secondAnimalDifferentReason ? secondAnimalConsultationReason : consultationReason
      };
      
      localStorage.setItem('bookingFormData', JSON.stringify(updatedData));
      console.log('Updated booking data:', updatedData);
      
      // Naviguer vers la page suivante (créneaux)
      navigate('/booking/slots');
    }
  };

  const canProceed = consultationReason !== '' && 
    (!secondAnimalDifferentReason || secondAnimalConsultationReason !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      {/* Header */}
      <header className="bg-vet-navy text-vet-beige shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-vet-sage" />
              <span className="text-lg sm:text-xl font-bold">AniNow</span>
            </div>
            <Link to="/vet/login">
              <Button variant="ghost" className="text-vet-beige hover:bg-white/10 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Espace Clinique</span>
                <span className="sm:hidden">Clinique</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Bouton retour */}
          <div className="mb-4 sm:mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="text-vet-navy hover:bg-vet-beige/20 p-1 sm:p-2 text-sm sm:text-base"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Retour
            </Button>
          </div>

          {/* Titre */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-vet-navy mb-2">
              Motif de consultation
            </h1>
          </div>

          {/* Formulaire */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardContent className="p-4 sm:p-8">
              <div className="space-y-6 sm:space-y-8">
                {/* Si pas de deuxième animal OU si le motif n'est pas différent pour le 2e animal */}
                {(!hasTwoAnimals || !secondAnimalDifferentReason) && (
                  <ConsultationReasonSelect
                    value={consultationReason}
                    onValueChange={setConsultationReason}
                  />
                )}

                {/* Checkbox pour motif différent pour le 2e animal - seulement si 2 animaux */}
                {hasTwoAnimals && (
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <Checkbox 
                      id="different-reason-second-animal"
                      checked={secondAnimalDifferentReason}
                      onCheckedChange={(checked) => setSecondAnimalDifferentReason(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="different-reason-second-animal" className="text-vet-navy cursor-pointer text-sm sm:text-base leading-tight">
                      Le motif est différent pour le 2e animal
                    </Label>
                  </div>
                )}

                {/* Sections séparées pour chaque animal si motif différent */}
                {hasTwoAnimals && secondAnimalDifferentReason && (
                  <div className="space-y-6 sm:space-y-8">
                    {/* Animal 1 */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-vet-blue">Animal 1</h3>
                      <ConsultationReasonSelect
                        value={consultationReason}
                        onValueChange={setConsultationReason}
                      />
                    </div>

                    {/* Animal 2 */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-vet-blue">Animal 2</h3>
                      <div className="space-y-3 sm:space-y-4">
                        <Label className="text-base sm:text-lg font-semibold text-vet-navy block">
                          Choisissez le motif de consultation
                        </Label>
                        <ConsultationReasonSelect
                          value={secondAnimalConsultationReason}
                          onValueChange={setSecondAnimalConsultationReason}
                        />
                      </div>
                    </div>

                    {/* Message informatif */}
                    <div className="bg-vet-beige/20 p-3 sm:p-4 rounded-md">
                      <p className="text-xs sm:text-sm text-vet-navy italic leading-tight">
                        Précisez le(s) motif(s) puis cliquez sur <span className="text-vet-sage font-medium">Suivant</span> pour continuer.
                      </p>
                    </div>
                  </div>
                )}

                {/* Bouton Suivant */}
                <div className="flex justify-center pt-4 sm:pt-6">
                  <Button 
                    onClick={handleNext} 
                    disabled={!canProceed} 
                    className="bg-vet-sage hover:bg-vet-sage/90 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
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
