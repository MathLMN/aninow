
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowRight, ArrowLeft, Info } from "lucide-react";
import ConditionalQuestionsForm from "@/components/ConditionalQuestionsForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConditionalQuestionsContentProps {
  bookingData: any;
  answers: {
    [key: string]: any;
  };
  onAnswersChange: (answers: any) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  hasAnyConditions: boolean;
}

const ConditionalQuestionsContent = ({
  bookingData,
  answers,
  onAnswersChange,
  onNext,
  onBack,
  canProceed,
  hasAnyConditions
}: ConditionalQuestionsContentProps) => {
  const isMobile = useIsMobile();

  // Vérifier si l'utilisateur a sélectionné "2 animaux"
  const hasTwoAnimals = bookingData.multipleAnimals?.includes('2-animaux');

  // Vérifier si les animaux ont des motifs différents
  const hasSecondAnimalDifferentReason = bookingData.secondAnimalDifferentReason === true;

  // Déterminer si on a des symptômes pour chaque animal
  const hasFirstAnimalSymptoms = (bookingData.selectedSymptoms?.length > 0 || bookingData.customSymptom?.trim() !== '') && bookingData.consultationReason === 'symptomes-anomalie';

  // Pour le deuxième animal, vérifier d'abord qu'il y a bien 2 animaux sélectionnés ET des motifs différents
  const hasSecondAnimalSymptoms = hasTwoAnimals && hasSecondAnimalDifferentReason && (Array.isArray(bookingData.secondAnimalSelectedSymptoms) && bookingData.secondAnimalSelectedSymptoms?.length > 0 || bookingData.secondAnimalCustomSymptom?.trim() !== '') && bookingData.secondAnimalConsultationReason === 'symptomes-anomalie';

  // Gestionnaire centralisé pour les changements de réponses
  const handleAnswersChange = (newAnswers: any) => {
    console.log('ConditionalQuestionsContent: Received answers update:', newAnswers);
    // Fusionner avec les réponses existantes pour préserver toutes les réponses
    const mergedAnswers = { ...answers, ...newAnswers };
    onAnswersChange(mergedAnswers);
  };

  // Compter le nombre total de symptômes sélectionnés
  const firstAnimalSymptomsCount = (bookingData.selectedSymptoms?.length || 0) + (bookingData.customSymptom?.trim() ? 1 : 0);
  // Ne compter les symptômes du 2e animal que s'il existe vraiment et a un motif différent
  const secondAnimalSymptomsCount = (hasTwoAnimals && hasSecondAnimalDifferentReason) 
    ? ((bookingData.secondAnimalSelectedSymptoms?.length || 0) + (bookingData.secondAnimalCustomSymptom?.trim() ? 1 : 0))
    : 0;
  const totalSymptoms = firstAnimalSymptomsCount + secondAnimalSymptomsCount;
  const hasMultipleSymptoms = totalSymptoms >= 2;

  return (
    <>
      {/* Formulaire */}
      <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg relative">
        <CardContent className="p-3 sm:p-6">
          {/* Bouton retour - À l'intérieur de la carte, en haut */}
          <div className="mb-4 sm:mb-6">
            <Button variant="ghost" onClick={onBack} className="text-vet-navy hover:bg-vet-beige/20 p-2 text-sm sm:text-base -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Questions pour l'animal 1 OU questions communes si motif partagé */}
            {hasFirstAnimalSymptoms && (
              <div className="space-y-4">
                <h3 className="font-semibold border-b border-gray-200 pb-2 text-base text-[#96c3ce]">
                  {hasTwoAnimals && !hasSecondAnimalDifferentReason ? 
                    `Questions pour ${bookingData.animalName || 'Animal 1'} et ${bookingData.secondAnimalName || 'Animal 2'}` : 
                    `Questions pour ${bookingData.animalName || 'Animal 1'}`
                  }
                </h3>
                <ConditionalQuestionsForm 
                  selectedSymptoms={bookingData.selectedSymptoms || []} 
                  customSymptom={bookingData.customSymptom || ''} 
                  onAnswersChange={handleAnswersChange} 
                  animalPrefix="animal1_"
                  initialAnswers={answers}
                />
              </div>
            )}

            {/* Questions pour l'animal 2 - Seulement si 2 animaux sélectionnés ET motifs différents */}
            {hasSecondAnimalSymptoms && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-vet-navy border-b border-gray-200 pb-2">
                  Questions pour {bookingData.secondAnimalName || 'Animal 2'}
                </h3>
                <ConditionalQuestionsForm 
                  selectedSymptoms={bookingData.secondAnimalSelectedSymptoms || []} 
                  customSymptom={bookingData.secondAnimalCustomSymptom || ''} 
                  onAnswersChange={handleAnswersChange} 
                  animalPrefix="animal2_"
                  initialAnswers={answers}
                />
              </div>
            )}

            {!hasAnyConditions && (
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
                onClick={onNext} 
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

      {/* Bouton Continuer fixe en bas à droite - Mobile seulement */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={onNext} 
            disabled={!canProceed} 
            className="bg-vet-sage hover:bg-vet-sage/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Continuer
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default ConditionalQuestionsContent;
