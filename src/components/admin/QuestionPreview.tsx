import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useFormQuestions } from "@/hooks/useFormQuestions";
import { CheckCircle2, XCircle } from "lucide-react";

const QuestionPreview = () => {
  const { questions, isLoading } = useFormQuestions();
  const [selectedType, setSelectedType] = useState<string>('all');

  const questionTypes = [
    { value: 'all', label: 'Toutes les questions' },
    { value: 'booking_start', label: 'Démarrage (Espèce/Nom)' },
    { value: 'animal_info', label: 'Informations animal' },
    { value: 'consultation_reason', label: 'Motif de consultation' },
    { value: 'conditional_questions', label: 'Questions conditionnelles' },
    { value: 'symptom_duration', label: 'Durée symptômes' },
    { value: 'additional_points', label: 'Points supplémentaires' },
    { value: 'client_comment', label: 'Commentaire' },
    { value: 'contact_info', label: 'Coordonnées' },
    { value: 'appointment_slots', label: 'Créneaux' }
  ];

  const filteredQuestions = selectedType === 'all' 
    ? questions 
    : questions.filter(q => q.question_type === selectedType);

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-vet-navy">
            Aperçu des questions
          </h3>
          <p className="text-sm text-vet-brown">
            Prévisualisez les questions et leurs options
          </p>
        </div>
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            {questionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <Card className="bg-white border-vet-blue/20">
            <CardContent className="p-8 text-center">
              <p className="text-vet-brown">Aucune question trouvée</p>
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map((question) => (
            <Card key={question.id} className="bg-white border-vet-blue/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-vet-blue/10 text-vet-navy border-vet-blue/30">
                        {question.question_type}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={question.is_active 
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {question.is_active ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-vet-navy text-sm mb-1">
                      {question.question_key}
                    </h4>
                  </div>
                  <span className="text-xs text-vet-brown/60 bg-vet-beige/20 px-2 py-1 rounded">
                    Ordre: {question.order_index}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-base text-vet-navy font-medium">
                      {question.question_text}
                    </p>
                    {question.description && (
                      <p className="text-sm text-vet-brown/70 mt-1 italic">
                        {question.description}
                      </p>
                    )}
                  </div>

                  {question.options && Array.isArray(question.options) && question.options.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-vet-navy mb-2">
                        Options disponibles :
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {question.options.map((option: any, index: number) => (
                          <div 
                            key={index}
                            className="text-sm bg-vet-beige/30 p-2 rounded border border-vet-blue/10"
                          >
                            {typeof option === 'string' ? option : option.label || option.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.trigger_conditions && Object.keys(question.trigger_conditions).length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 p-2 rounded">
                      <p className="text-xs font-medium text-yellow-800 mb-1">
                        Conditions de déclenchement :
                      </p>
                      <pre className="text-xs text-yellow-700">
                        {JSON.stringify(question.trigger_conditions, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionPreview;
