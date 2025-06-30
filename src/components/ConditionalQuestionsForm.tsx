
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface ConditionalQuestionsFormProps {
  selectedSymptoms: string[];
  customSymptom: string;
  onAnswersChange: (answers: any) => void;
}

const ConditionalQuestionsForm = ({ selectedSymptoms, customSymptom, onAnswersChange }: ConditionalQuestionsFormProps) => {
  const form = useForm();
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
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.key} className="space-y-3">
          <h3 className="text-base sm:text-lg font-medium text-vet-brown">
            {question.title} <span className="text-red-500">*</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {question.options.map((option) => (
              <Button
                key={option}
                type="button"
                variant="outline"
                className={`h-auto p-3 sm:p-4 text-left justify-start whitespace-normal text-xs sm:text-sm transition-all duration-200 ${
                  answers[question.key] === option
                    ? 'bg-vet-sage text-white border-vet-sage'
                    : 'bg-white hover:bg-vet-beige/20 border-vet-brown/20 text-vet-brown'
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
