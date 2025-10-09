import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useFormQuestions } from "@/hooks/useFormQuestions";

const NavigationFlowEditor = () => {
  const { questions, isLoading } = useFormQuestions();

  // Ordre de navigation du flux booking
  const navigationOrder = [
    'booking_start',
    'animal_info',
    'consultation_reason',
    'conditional_questions',
    'symptom_duration',
    'additional_points',
    'client_comment',
    'contact_info',
    'appointment_slots'
  ];

  const getQuestionsForStep = (stepType: string) => {
    return questions.filter(q => q.question_type === stepType && q.is_active);
  };

  const getStepLabel = (stepType: string) => {
    const labels: Record<string, string> = {
      'booking_start': 'Informations animal (Démarrage)',
      'animal_info': 'Informations complémentaires animal',
      'consultation_reason': 'Motif de consultation',
      'conditional_questions': 'Questions conditionnelles',
      'symptom_duration': 'Durée des symptômes',
      'additional_points': 'Points supplémentaires',
      'client_comment': 'Commentaire client',
      'contact_info': 'Coordonnées',
      'appointment_slots': 'Choix du créneau'
    };
    return labels[stepType] || stepType;
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-vet-navy mb-2">
          Flux de navigation complet
        </h3>
        <p className="text-sm text-vet-brown">
          Visualisez l'ordre des étapes du formulaire de réservation et les questions associées
        </p>
      </div>

      <div className="space-y-4">
        {navigationOrder.map((stepType, index) => {
          const stepQuestions = getQuestionsForStep(stepType);
          
          return (
            <div key={stepType}>
              <Card className="bg-white border-vet-blue/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-vet-sage text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-vet-navy mb-2">
                        {getStepLabel(stepType)}
                      </h4>
                      
                      {stepQuestions.length > 0 ? (
                        <div className="space-y-2">
                          {stepQuestions.map((question) => (
                            <div 
                              key={question.id}
                              className="text-sm bg-vet-beige/20 p-2 rounded border border-vet-blue/10"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-vet-navy">
                                  {question.question_key}
                                </span>
                                <Badge 
                                  variant="outline" 
                                  className="bg-green-50 text-green-700 border-green-200"
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              </div>
                              <p className="text-vet-brown">{question.question_text}</p>
                              {question.description && (
                                <p className="text-xs text-vet-brown/70 mt-1 italic">
                                  {question.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-vet-brown/60 italic">
                          Aucune question configurée pour cette étape
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {index < navigationOrder.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowRight className="h-5 w-5 text-vet-sage" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationFlowEditor;
