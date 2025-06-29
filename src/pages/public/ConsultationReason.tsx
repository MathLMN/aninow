
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Settings, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ConsultationReasonSelect from "@/components/ConsultationReasonSelect";
import ConvenienceConsultationSelect from "@/components/ConvenienceConsultationSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useFormMemory } from "@/hooks/useFormMemory";

const ConsultationReason = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormMemory();
  
  const [consultationReason, setConsultationReason] = useState(formData.consultationReason || '');
  const [convenienceOptions, setConvenienceOptions] = useState<string[]>(formData.convenienceOptions || []);
  const [secondAnimalDifferentReason, setSecondAnimalDifferentReason] = useState(formData.secondAnimalDifferentReason || false);
  const [secondAnimalConsultationReason, setSecondAnimalConsultationReason] = useState(formData.secondAnimalConsultationReason || '');
  const [secondAnimalConvenienceOptions, setSecondAnimalConvenienceOptions] = useState<string[]>(formData.secondAnimalConvenienceOptions || []);
  const [hasTwoAnimals, setHasTwoAnimals] = useState(false);

  useEffect(() => {
    // Vérifier que les données du formulaire précédent existent
    if (!formData.animalSpecies) {
      navigate('/');
      return;
    }

    // Vérifier si l'utilisateur a sélectionné "2 animaux"
    const hasSecondAnimal = formData.multipleAnimals?.includes('2-animaux');
    setHasTwoAnimals(hasSecondAnimal);
  }, [navigate, formData]);

  // Synchroniser les changements avec le hook de mémorisation
  useEffect(() => {
    updateFormData({
      consultationReason,
      convenienceOptions,
      secondAnimalDifferentReason,
      secondAnimalConsultationReason,
      secondAnimalConvenienceOptions
    });
  }, [consultationReason, convenienceOptions, secondAnimalDifferentReason, secondAnimalConsultationReason, secondAnimalConvenienceOptions, updateFormData]);

  const handleBack = () => {
    navigate('/');
  };

  const handleNext = () => {
    const isFirstAnimalValid = consultationReason !== '' && 
      (consultationReason !== 'consultation-convenance' || convenienceOptions.length > 0);
    
    const isSecondAnimalValid = !secondAnimalDifferentReason || 
      (secondAnimalConsultationReason !== '' && 
       (secondAnimalConsultationReason !== 'consultation-convenance' || secondAnimalConvenienceOptions.length > 0));

    if (isFirstAnimalValid && isSecondAnimalValid) {
      console.log('Updated booking data:', formData);
      navigate('/booking/slots');
    }
  };

  const canProceed = consultationReason !== '' && 
    (consultationReason !== 'consultation-convenance' || convenienceOptions.length > 0) &&
    (!secondAnimalDifferentReason || 
     (secondAnimalConsultationReason !== '' && 
      (secondAnimalConsultationReason !== 'consultation-convenance' || secondAnimalConvenienceOptions.length > 0)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      {/* Header - Optimized for mobile */}
      <header className="bg-vet-navy text-vet-beige shadow-lg">
        <div className="container mx-auto px-3 sm:px-6 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-vet-sage" />
              <span className="text-base sm:text-xl font-bold">AniNow</span>
            </div>
            <Link to="/vet/login">
              <Button variant="ghost" className="text-vet-beige hover:bg-white/10 text-xs px-2 py-1 sm:text-sm sm:px-4 sm:py-2">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden xs:inline">Espace </span>Clinique
              </Button>
            </Link>
          </div>
        </div>
      </header>

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
                      />
                    )}
                  </div>
                )}

                {/* Checkbox pour motif différent pour le 2e animal - Mobile optimized */}
                {hasTwoAnimals && (
                  <div className="flex items-start space-x-2 p-2 sm:p-0">
                    <Checkbox 
                      id="different-reason-second-animal"
                      checked={secondAnimalDifferentReason}
                      onCheckedChange={(checked) => setSecondAnimalDifferentReason(checked as boolean)}
                      className="mt-0.5 sm:mt-1"
                    />
                    <Label htmlFor="different-reason-second-animal" className="text-vet-navy cursor-pointer text-sm leading-tight sm:text-base">
                      Le motif est différent pour le 2e animal
                    </Label>
                  </div>
                )}

                {/* Sections séparées pour chaque animal si motif différent - Mobile optimized */}
                {hasTwoAnimals && secondAnimalDifferentReason && (
                  <div className="space-y-4 sm:space-y-8">
                    {/* Animal 1 */}
                    <div className="space-y-2 sm:space-y-4 p-3 bg-vet-beige/30 rounded-lg sm:p-4">
                      <h3 className="text-sm sm:text-lg font-semibold text-vet-blue">Animal 1</h3>
                      <ConsultationReasonSelect
                        value={consultationReason}
                        onValueChange={setConsultationReason}
                      />
                      {consultationReason === 'consultation-convenance' && (
                        <ConvenienceConsultationSelect
                          selectedOptions={convenienceOptions}
                          onOptionsChange={setConvenienceOptions}
                        />
                      )}
                    </div>

                    {/* Animal 2 */}
                    <div className="space-y-2 sm:space-y-4 p-3 bg-vet-blue/10 rounded-lg sm:p-4">
                      <h3 className="text-sm sm:text-lg font-semibold text-vet-blue">Animal 2</h3>
                      <div className="space-y-2 sm:space-y-4">
                        <Label className="text-sm sm:text-lg font-semibold text-vet-navy block">
                          Choisissez le motif de consultation
                        </Label>
                        <ConsultationReasonSelect
                          value={secondAnimalConsultationReason}
                          onValueChange={setSecondAnimalConsultationReason}
                        />
                        {secondAnimalConsultationReason === 'consultation-convenance' && (
                          <ConvenienceConsultationSelect
                            selectedOptions={secondAnimalConvenienceOptions}
                            onOptionsChange={setSecondAnimalConvenienceOptions}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Message informatif - Mobile optimized */}
                <div className="bg-vet-beige/20 p-2 sm:p-4 rounded-md mx-1 sm:mx-0">
                  <p className="text-xs sm:text-sm text-vet-navy italic leading-tight text-center sm:text-left">
                    Précisez le(s) motif(s) puis cliquez sur <span className="text-vet-sage font-medium">Suivant</span> pour continuer.
                  </p>
                </div>

                {/* Bouton Suivant - Mobile optimized */}
                <div className="pt-2 sm:pt-6">
                  <Button 
                    onClick={handleNext} 
                    disabled={!canProceed} 
                    className="bg-vet-sage hover:bg-vet-sage/90 text-white px-4 py-3 text-sm sm:px-8 sm:py-3 sm:text-lg w-full h-12 sm:h-auto sm:w-auto sm:mx-auto sm:block"
                  >
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
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
