
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ConditionalQuestionsForm from "@/components/ConditionalQuestionsForm";
import { useIsMobile } from "@/hooks/use-mobile";

const ConditionalQuestions = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [answers, setAnswers] = useState<{
    [key: string]: any;
  }>({});
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    // Vérifier que l'utilisateur vient bien de la page symptômes
    const storedData = localStorage.getItem('bookingFormData');
    if (!storedData) {
      navigate('/');
      return;
    }
    const parsedData = JSON.parse(storedData);
    setBookingData(parsedData);

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

  const handleAnswersChange = (newAnswers: any) => {
    setAnswers(newAnswers);
  };

  // Vérifier si toutes les questions requises ont été répondues
  const symptomsRequiringQuestions = ['vomissements', 'diarrhée', 'toux', 'cris/gémissements'];
  const needsQuestions = bookingData?.selectedSymptoms?.some((symptom: string) => symptomsRequiringQuestions.includes(symptom.toLowerCase())) || symptomsRequiringQuestions.some((symptom: string) => bookingData?.customSymptom?.toLowerCase()?.includes(symptom));
  
  // Vérifier si "sang dans les selles" est sélectionné
  const hasBloodInStool = bookingData?.selectedSymptoms?.some((symptom: string) => 
    symptom.toLowerCase().includes('sang-selles') || symptom.toLowerCase().includes('sang dans les selles')
  ) || bookingData?.customSymptom?.toLowerCase()?.includes('sang dans les selles');

  // Vérifier si "problèmes urinaires" est sélectionné
  const hasUrinaryProblems = bookingData?.selectedSymptoms?.some((symptom: string) => 
    symptom.toLowerCase().includes('problemes-urinaires') || symptom.toLowerCase().includes('problèmes urinaires')
  ) || bookingData?.customSymptom?.toLowerCase()?.includes('problèmes urinaires');

  // Vérifier si "démangeaisons cutanées" est sélectionné
  const hasSkinItching = bookingData?.selectedSymptoms?.some((symptom: string) => 
    symptom.toLowerCase().includes('demangeaisons-cutanees') || symptom.toLowerCase().includes('démangeaisons cutanées')
  ) || bookingData?.customSymptom?.toLowerCase()?.includes('démangeaisons cutanées');

  // Vérifier si "plaie" est sélectionné
  const hasWound = bookingData?.selectedSymptoms?.some((symptom: string) => 
    symptom.toLowerCase().includes('plaie')
  ) || bookingData?.customSymptom?.toLowerCase()?.includes('plaie');

  // Vérifier si "démangeaisons de l'oreille" ou "otite" est sélectionné
  const hasEarProblems = bookingData?.selectedSymptoms?.some((symptom: string) => 
    symptom.toLowerCase().includes('demangeaisons-oreille') || 
    symptom.toLowerCase().includes('démangeaisons de l\'oreille') ||
    symptom.toLowerCase().includes('otite')
  ) || bookingData?.customSymptom?.toLowerCase()?.includes('démangeaisons de l\'oreille') || 
       bookingData?.customSymptom?.toLowerCase()?.includes('otite');

  // Vérifier si "écoulement des yeux" est sélectionné
  const hasEyeDischarge = bookingData?.selectedSymptoms?.some((symptom: string) => 
    symptom.toLowerCase().includes('ecoulements-yeux') || 
    symptom.toLowerCase().includes('écoulement des yeux') ||
    symptom.toLowerCase().includes('ecoulement des yeux')
  ) || bookingData?.customSymptom?.toLowerCase()?.includes('écoulement des yeux') ||
       bookingData?.customSymptom?.toLowerCase()?.includes('ecoulement des yeux');

  let requiredQuestions: string[] = [];
  
  // Ajouter les questions générales si nécessaire
  if (needsQuestions) {
    requiredQuestions.push('general_form', 'eating', 'drinking');
  }
  
  // Ajouter la question sur la consistance des selles si nécessaire
  if (hasBloodInStool) {
    requiredQuestions.push('stool_consistency');
  }

  // Ajouter les questions spécifiques aux problèmes urinaires si nécessaire
  if (hasUrinaryProblems) {
    requiredQuestions.push('urine_quantity', 'urination_frequency', 'blood_in_urine', 'genital_licking');
  }

  // Ajouter les questions spécifiques aux démangeaisons cutanées si nécessaire
  if (hasSkinItching) {
    requiredQuestions.push('skin_itching_areas', 'antiparasitic_treatment', 'hair_loss');
  }

  // Ajouter les questions spécifiques aux plaies si nécessaire
  if (hasWound) {
    requiredQuestions.push('wound_location', 'wound_oozing', 'wound_depth', 'wound_bleeding');
  }

  // Ajouter les questions spécifiques aux problèmes d'oreille si nécessaire
  if (hasEarProblems) {
    requiredQuestions.push('general_form', 'ear_redness', 'head_shaking', 'pain_complaints');
  }

  // Ajouter la question sur l'état de l'œil si nécessaire
  if (hasEyeDischarge) {
    requiredQuestions.push('eye_condition');
  }

  const allQuestionsAnswered = (needsQuestions || hasBloodInStool || hasUrinaryProblems || hasSkinItching || hasWound || hasEarProblems || hasEyeDischarge) ? requiredQuestions.every(key => answers[key]) : true;
  const canProceed = allQuestionsAnswered;

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
          {/* Bouton retour */}
          <div className="mb-4 sm:mb-6">
            <Button variant="ghost" onClick={handleBack} className="text-vet-navy hover:bg-vet-beige/20 p-1 text-sm sm:p-2 sm:text-base -ml-2">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Retour
            </Button>
          </div>

          {/* Titre */}
          <div className="text-center mb-4 sm:mb-6 animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-vet-navy mb-1 sm:mb-2 leading-tight">
              Quelques questions complémentaires
            </h1>
            <p className="text-sm sm:text-base text-vet-brown/80 px-2">Aidez-nous à mieux détecter l'urgence</p>
          </div>

          {/* Formulaire */}
          <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg relative">
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                
                <ConditionalQuestionsForm 
                  selectedSymptoms={bookingData.selectedSymptoms || []} 
                  customSymptom={bookingData.customSymptom || ''} 
                  onAnswersChange={handleAnswersChange} 
                />

                {!needsQuestions && !hasBloodInStool && !hasUrinaryProblems && !hasSkinItching && !hasWound && !hasEarProblems && !hasEyeDischarge && (
                  <div className="text-center text-vet-brown/60 py-8">
                    <p className="text-sm sm:text-base">
                      Aucune question complémentaire n'est nécessaire pour les symptômes sélectionnés.
                    </p>
                  </div>
                )}
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

export default ConditionalQuestions;
