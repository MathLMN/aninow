
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ConditionalQuestionsFormProps {
  selectedSymptoms: string[];
  customSymptom: string;
  onAnswersChange: (answers: any) => void;
}

const ConditionalQuestionsForm = ({ selectedSymptoms, customSymptom, onAnswersChange }: ConditionalQuestionsFormProps) => {
  const [answers, setAnswers] = useState<{[key: string]: string}>({});

  // Vérifier si des symptômes nécessitent ces questions
  const symptomsRequiringQuestions = ['vomissements', 'diarrhée', 'toux', 'cris/gémissements'];
  const needsQuestions = selectedSymptoms.some(symptom => 
    symptomsRequiringQuestions.includes(symptom.toLowerCase())
  ) || symptomsRequiringQuestions.some(symptom => 
    customSymptom.toLowerCase().includes(symptom)
  );

  if (!needsQuestions) {
    return null;
  }

  const handleAnswerChange = (questionKey: string, value: string) => {
    const newAnswers = { ...answers, [questionKey]: value };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  const questions = [
    {
      key: 'general_form',
      title: 'Quelle est sa forme générale ?',
      options: ['En forme', 'Pas en forme', 'Amorphe (avachi)']
    },
    {
      key: 'eating',
      title: "Est-ce qu'il mange ?",
      options: ['Mange normalement', 'Mange peu', 'Ne mange pas']
    },
    {
      key: 'drinking',
      title: "Est-ce qu'il boit de l'eau ?",
      options: ['Soif normale', 'Soif excessive', 'Pas soif']
    }
  ];

  return (
    <div className="space-y-8">
      {questions.map((question) => (
        <div key={question.key} className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-vet-navy text-center">
            {question.title}
            <span className="text-red-500 ml-1">*</span>
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option) => (
              <Button
                key={option}
                type="button"
                variant="outline"
                className={`h-auto p-4 sm:p-6 text-center justify-center text-sm sm:text-base font-medium rounded-xl transition-all duration-200 border-2 ${
                  answers[question.key] === option
                    ? 'bg-vet-sage text-white border-vet-sage shadow-lg'
                    : 'bg-white hover:bg-vet-beige/30 border-vet-brown/20 text-vet-brown hover:border-vet-sage/50'
                }`}
                onClick={() => handleAnswerChange(question.key, option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConditionalQuestionsForm;
