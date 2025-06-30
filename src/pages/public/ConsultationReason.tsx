
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Settings, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ConsultationReasonSelect from "@/components/ConsultationReasonSelect";
import ConvenienceConsultationSelect from "@/components/ConvenienceConsultationSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

const ConsultationReason = () => {
  const navigate = useNavigate();
  const [consultationReason, setConsultationReason] = useState('');
  const [convenienceOptions, setConvenienceOptions] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');
  const [secondAnimalDifferentReason, setSecondAnimalDifferentReason] = useState(false);
  const [secondAnimalConsultationReason, setSecondAnimalConsultationReason] = useState('');
  const [secondAnimalConvenienceOptions, setSecondAnimalConvenienceOptions] = useState<string[]>([]);
  const [secondAnimalCustomText, setSecondAnimalCustomText] = useState('');
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
    const isFirstAnimalValid = consultationReason !== '' && 
      (consultationReason !== 'consultation-convenance' || 
       (convenienceOptions.length > 0 && 
        (!convenienceOptions.includes('autre') || customText.trim() !== '')));
    
    const isSecondAnimalValid = !secondAnimalDifferentReason || 
      (secondAnimalConsultationReason !== '' && 
       (secondAnimalConsultationReason !== 'consultation-convenance' || 
        (secondAnimalConvenienceOptions.length > 0 &&
         (!secondAnimalConvenienceOptions.includes('autre') || secondAnimalCustomText.trim() !== ''))));

    if (isFirstAnimalValid && isSecondAnimalValid) {
      // Récupérer les données existantes et ajouter le motif de consultation
      const existingData = JSON.parse(localStorage.getItem('bookingFormData') || '{}');
      const updatedData = {
        ...existingData,
        consultationReason,
        convenienceOptions,
        customText,
        secondAnimalDifferentReason,
        secondAnimalConsultationReason: secondAnimalDifferentReason ? secondAnimalConsultationReason : consultationReason,
        secondAnimalConvenienceOptions: secondAnimalDifferentReason ? secondAnimalConvenienceOptions : convenienceOptions,
        secondAnimalCustomText: secondAnimalDifferentReason ? secondAnimalCustomText : customText
      };
      
      localStorage.setItem('bookingFormData', JSON.stringify(updatedData));
      console.log('Updated booking data:', updatedData);
      
      // Naviguer vers la page suivante (créneaux)
      navigate('/booking/slots');
    }
  };

  const canProceed = consultationReason !== '' && 
    (consultationReason !== 'consultation-convenance' || 
     (convenienceOptions.length > 0 && 
      (!convenienceOptions.includes('autre') || customText.trim() !== ''))) &&
    (!secondAnimalDifferentReason || 
     (secondAnimalConsultationReason !== '' && 
      (secondAnimalConsultationReason !== 'consultation-convenance' || 
       (secondAnimalConvenienceOptions.length > 0 &&
        (!secondAnimalConvenienceOptions.includes('autre') || secondAnimalCustomText.trim() !== '')))));

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
                        customText={customText}
                        onCustomTextChange={setCustomText}
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
                          customText={customText}
                          onCustomTextChange={setCustomText}
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
                            customText={secondAnimalCustomText}
                            onCustomTextChange={setSecondAnimalCustomText}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

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
