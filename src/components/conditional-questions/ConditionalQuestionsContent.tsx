
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ConditionalQuestionsForm from "@/components/ConditionalQuestionsForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConditionalQuestionsContentProps {
  bookingData: any;
  answers: {[key: string]: any};
  onAnswersChange: (answers: any) => void;
  onNext: () => void;
  canProceed: boolean;
  hasAnyConditions: boolean;
}

const ConditionalQuestionsContent = ({ 
  bookingData, 
  answers, 
  onAnswersChange, 
  onNext, 
  canProceed, 
  hasAnyConditions 
}: ConditionalQuestionsContentProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Formulaire */}
      <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg relative">
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            
            <ConditionalQuestionsForm 
              selectedSymptoms={bookingData.selectedSymptoms || []} 
              customSymptom={bookingData.customSymptom || ''} 
              onAnswersChange={onAnswersChange} 
            />

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
