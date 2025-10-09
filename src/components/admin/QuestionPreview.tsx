import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFormQuestions } from "@/hooks/useFormQuestions";
import { Eye, FileQuestion } from "lucide-react";
import SelectionButton from "@/components/SelectionButton";

const QUESTION_TYPES = [
  { value: 'booking_start', label: '📝 Page de démarrage' },
  { value: 'animal_info', label: '🐾 Informations animal' },
  { value: 'consultation_reason', label: '🏥 Motif de consultation' },
  { value: 'conditional_questions', label: '❓ Questions conditionnelles' },
  { value: 'symptom_duration', label: '⏱️ Durée des symptômes' },
  { value: 'additional_points', label: '📋 Points complémentaires' },
  { value: 'client_comment', label: '💬 Commentaire client' },
  { value: 'contact_info', label: '📞 Coordonnées' },
  { value: 'appointment_slots', label: '📅 Choix du créneau' },
];

export const QuestionPreview = () => {
  const { questions } = useFormQuestions();
  const [selectedType, setSelectedType] = useState<string>('booking_start');
  const [previewAnswers, setPreviewAnswers] = useState<{ [key: string]: any }>({});

  const filteredQuestions = questions.filter(
    q => q.question_type === selectedType && q.is_active
  );

  const typeLabel = QUESTION_TYPES.find(t => t.value === selectedType)?.label || selectedType;

  const handleAnswerChange = (questionKey: string, value: any) => {
    setPreviewAnswers(prev => ({
      ...prev,
      [questionKey]: value
    }));
  };

  const renderQuestionPreview = (question: any) => {
    const isMultiSelect = Array.isArray(question.options) && 
                         question.options.length > 0 && 
                         question.options[0]?.multiSelect;

    return (
      <Card key={question.id} className="bg-white border-vet-blue/20">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-vet-navy">
                {question.question_text}
                {question.is_required !== false && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h3>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {question.question_key}
              </code>
            </div>
            {question.description && (
              <p className="text-sm text-vet-brown/80 mb-3">
                {question.description}
              </p>
            )}
          </div>

          {/* Rendu des options */}
          {question.options && question.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {question.options.map((option: any, index: number) => {
                const optionId = option.id || option.value || option.label || `option-${index}`;
                const optionLabel = option.label || option.value || option;
                const isSelected = isMultiSelect
                  ? previewAnswers[question.question_key]?.includes(optionId)
                  : previewAnswers[question.question_key] === optionId;

                return (
                  <SelectionButton
                    key={optionId}
                    id={`preview-${question.question_key}-${optionId}`}
                    value={optionId}
                    isSelected={isSelected}
                    onSelect={(value) => {
                      if (isMultiSelect) {
                        const current = previewAnswers[question.question_key] || [];
                        const newValue = current.includes(value)
                          ? current.filter((v: any) => v !== value)
                          : [...current, value];
                        handleAnswerChange(question.question_key, newValue);
                      } else {
                        handleAnswerChange(question.question_key, value);
                      }
                    }}
                    className="p-3 text-sm font-medium"
                  >
                    <span className="text-center">{optionLabel}</span>
                  </SelectionButton>
                );
              })}
            </div>
          )}

          {/* Si pas d'options, afficher un message */}
          {(!question.options || question.options.length === 0) && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Aucune option définie pour cette question
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-vet-navy">
            <Eye className="h-5 w-5" />
            Aperçu des questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="text-sm font-medium text-vet-navy mb-2 block">
              Sélectionnez une catégorie de questions
            </label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-96">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUESTION_TYPES.map(type => {
                  const count = questions.filter(
                    q => q.question_type === type.value && q.is_active
                  ).length;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label} ({count})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-vet-navy">
                {typeLabel}
              </h3>
              <Badge variant="secondary">
                {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <Alert>
              <FileQuestion className="h-4 w-4" />
              <AlertDescription>
                Aucune question active pour cette catégorie. 
                Créez des questions dans l'onglet "Questions".
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map(renderQuestionPreview)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résumé des réponses */}
      {Object.keys(previewAnswers).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-vet-navy">Réponses sélectionnées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(previewAnswers).map(([key, value]) => (
                <div key={key} className="flex items-start gap-2 p-2 bg-vet-blue/5 rounded">
                  <code className="text-xs bg-vet-sage/20 px-2 py-1 rounded flex-shrink-0">
                    {key}
                  </code>
                  <span className="text-sm text-vet-navy">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
