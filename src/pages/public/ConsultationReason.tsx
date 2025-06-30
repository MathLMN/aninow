
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConsultationReasonSelect from "@/components/ConsultationReasonSelect";
import ConvenienceConsultationSelect from "@/components/ConvenienceConsultationSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import Header from "@/components/Header";

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

  // Effet pour gérer la logique conditionnelle du deuxième animal
  useEffect(() => {
    if (hasTwoAnimals && consultationReason === 'symptomes-anomalie') {
      // Si animal 1 a "symptomes-anomalie", forcer animal 2 à "consultation-convenance"
      setSecondAnimalConsultationReason('consultation-convenance');
      setSecondAnimalDifferentReason(true);
    }
  }, [consultationReason, hasTwoAnimals]);

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

  // Détermine si on doit forcer la consultation de convenance pour l'animal 2
  const shouldForceConvenienceForAnimal2 = hasTwoAnimals && consultationReason === 'symptomes-anomalie';

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

                {/* Checkbox pour motif différent pour le 2e animal - Masqué si symptômes pour animal 1 */}
                {hasTwoAnimals && !shouldForceConvenienceForAnimal2 && (
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

                {/* Message informatif quand consultation forcée pour animal 2 */}
                {shouldForceConvenienceForAnimal2 && (
                  <div className="bg-vet-blue/10 p-3 rounded-md border border-vet-blue/20">
                    <p className="text-xs sm:text-sm text-vet-navy text-center leading-relaxed">
                      ℹ️ Pour le 2e animal, seule une consultation de convenance est possible
                    </p>
                  </div>
                )}

                {/* Sections séparées pour chaque animal si motif différent - Mobile optimized */}
                {hasTwoAnimals && (secondAnimalDifferentReason || shouldForceConvenienceForAnimal2) && (
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
                        {/* Si pas de consultation forcée, afficher le sélecteur normal */}
                        {!shouldForceConvenienceForAnimal2 && (
                          <ConsultationReasonSelect
                            value={secondAnimalConsultationReason}
                            onValueChange={setSecondAnimalConsultationReason}
                          />
                        )}
                        
                        {/* Si consultation forcée ou consultation de convenance sélectionnée, afficher les options */}
                        {(shouldForceConvenienceForAnimal2 || secondAnimalConsultationReason === 'consultation-convenance') && (
                          <>
                            {shouldForceConvenienceForAnimal2 && (
                              <div className="mb-3">
                                <Label className="text-sm sm:text-base font-medium text-vet-navy block">
                                  💉 Consultation de convenance (motif automatique)
                                </Label>
                              </div>
                            )}
                            <ConvenienceConsultationSelect
                              selectedOptions={secondAnimalConvenienceOptions}
                              onOptionsChange={setSecondAnimalConvenienceOptions}
                              customText={secondAnimalCustomText}
                              onCustomTextChange={setSecondAnimalCustomText}
                            />
                          </>
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
