
import { useState } from "react";
import SelectionButton from "@/components/SelectionButton";

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
    <div className="space-y-8 sm:space-y-12">
      {questions.map((question) => (
        <div key={question.key} className="space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-vet-navy text-left mb-4 sm:mb-6">
            {question.title}
            <span className="text-red-500 ml-1">*</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {question.options.map((option) => (
              <SelectionButton
                key={option}
                id={`${question.key}-${option}`}
                value={option}
                isSelected={answers[question.key] === option}
                onSelect={(value) => handleAnswerChange(question.key, value)}
                className="p-2 text-sm font-medium"
              >
                <span className="text-center leading-tight">{option}</span>
              </SelectionButton>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConditionalQuestionsForm;
