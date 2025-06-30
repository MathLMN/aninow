
import { useState } from "react";
import SelectionButton from "@/components/SelectionButton";

interface ConditionalQuestionsFormProps {
  selectedSymptoms: string[];
  customSymptom: string;
  onAnswersChange: (answers: any) => void;
}

const ConditionalQuestionsForm = ({ selectedSymptoms, customSymptom, onAnswersChange }: ConditionalQuestionsFormProps) => {
  const [answers, setAnswers] = useState<{[key: string]: string | File}>({});

  // Vérifier si des symptômes nécessitent les questions générales
  const symptomsRequiringQuestions = ['vomissements', 'diarrhée', 'toux', 'cris/gémissements'];
  const needsQuestions = selectedSymptoms.some(symptom => 
    symptomsRequiringQuestions.includes(symptom.toLowerCase())
  ) || symptomsRequiringQuestions.some(symptom => 
    customSymptom.toLowerCase().includes(symptom)
  );

  // Vérifier si "sang dans les selles" est sélectionné pour ajouter la question sur la consistance
  const hasBloodInStool = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('sang-selles') || symptom.toLowerCase().includes('sang dans les selles')
  ) || customSymptom.toLowerCase().includes('sang dans les selles');

  // Vérifier si "problèmes urinaires" est sélectionné
  const hasUrinaryProblems = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('problemes-urinaires') || symptom.toLowerCase().includes('problèmes urinaires')
  ) || customSymptom.toLowerCase().includes('problèmes urinaires');

  // Vérifier si "démangeaisons cutanées" est sélectionné
  const hasSkinItching = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('demangeaisons-cutanees') || symptom.toLowerCase().includes('démangeaisons cutanées')
  ) || customSymptom.toLowerCase().includes('démangeaisons cutanées');

  // Vérifier si "plaie" est sélectionné
  const hasWound = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('plaie')
  ) || customSymptom.toLowerCase().includes('plaie');

  // Vérifier si "démangeaisons de l'oreille" ou "otite" est sélectionné
  const hasEarProblems = selectedSymptoms.some(symptom => 
    symptom.toLowerCase().includes('demangeaisons-oreille') || 
    symptom.toLowerCase().includes('démangeaisons de l\'oreille') ||
    symptom.toLowerCase().includes('otite')
  ) || customSymptom.toLowerCase().includes('démangeaisons de l\'oreille') || 
       customSymptom.toLowerCase().includes('otite');

  if (!needsQuestions && !hasBloodInStool && !hasUrinaryProblems && !hasSkinItching && !hasWound && !hasEarProblems) {
    return null;
  }

  const handleAnswerChange = (questionKey: string, value: string) => {
    const newAnswers = { ...answers, [questionKey]: value };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  const handleFileChange = (questionKey: string, file: File | null) => {
    const newAnswers = { ...answers, [questionKey]: file };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  const questions = [];

  // Questions générales pour certains symptômes
  if (needsQuestions) {
    questions.push(
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
    );
  }

  // Question pour "sang dans les selles"
  if (hasBloodInStool) {
    questions.push({
      key: 'stool_consistency',
      title: 'Quelle est la consistance des selles ?',
      options: ['Selles normales', 'Selles molles', 'Selles fermes']
    });
  }

  // Questions spécifiques aux problèmes urinaires
  if (hasUrinaryProblems) {
    questions.push(
      {
        key: 'urine_quantity',
        title: "Quelle est la quantité d'urine ?",
        options: ['Normale', 'Quelques gouttes', 'Aucune']
      },
      {
        key: 'urination_frequency',
        title: 'Quelle est la fréquence des mictions ?',
        options: ['Normale', 'Très rapprochées', 'Rares']
      },
      {
        key: 'blood_in_urine',
        title: "Est-ce qu'il y a une présence de sang dans les urines ?",
        options: ['Non', 'Légère teinte rosée', 'Sang visible']
      },
      {
        key: 'genital_licking',
        title: 'Se lèche-t-il les parties intimes ?',
        options: ['Pas du tout', 'Un peu', 'Beaucoup']
      }
    );
  }

  // Questions spécifiques aux démangeaisons cutanées
  if (hasSkinItching) {
    questions.push(
      {
        key: 'skin_itching_areas',
        title: 'Sur quelle(s) zone(s) du corps ?',
        options: ['Généralisée', 'Plusieurs zones', 'Une zone localisée']
      },
      {
        key: 'antiparasitic_treatment',
        title: 'Quand a-t-il eu son dernier traitement antiparasitaire ?',
        options: ['moins d\'1 mois', '1 à 3 mois', 'plus de 3 mois', 'Jamais']
      },
      {
        key: 'hair_loss',
        title: 'Est-ce qu\'il y a une perte de poils localisée ?',
        options: ['Aucune', 'Légère', 'Importante']
      }
    );
  }

  // Questions spécifiques aux plaies
  if (hasWound) {
    questions.push(
      {
        key: 'wound_location',
        title: 'Sur quelle(s) zone(s) du corps ?',
        options: ['Généralisée', 'Plusieurs zones', 'Une zone localisée']
      },
      {
        key: 'wound_oozing',
        title: 'La plaie est suintante (pus ou liquide) ?',
        options: ['Ne suinte pas', 'Légèrement', 'Abondamment']
      },
      {
        key: 'wound_depth',
        title: 'La plaie semble superficielle ou profonde ?',
        options: ['Superficielle', 'Légèrement profonde', 'Très profonde']
      },
      {
        key: 'wound_bleeding',
        title: 'La plaie saigne ?',
        options: ['Ne saigne pas', 'Légèrement', 'Abondamment']
      }
    );
  }

  // Questions spécifiques aux problèmes d'oreille (démangeaisons de l'oreille et otite)
  if (hasEarProblems) {
    questions.push(
      {
        key: 'general_form',
        title: 'Quelle est sa forme générale ?',
        options: ['En forme', 'Pas en forme', 'Amorphe (avachi)']
      },
      {
        key: 'ear_redness',
        title: "Est-ce l'oreille est rouge ?",
        options: ['Non', 'Légèrement', 'Rouge vif']
      },
      {
        key: 'head_shaking',
        title: "Est-ce qu'il se secoue la tête ?",
        options: ['Non', 'Quelques fois', 'Fréquemment']
      },
      {
        key: 'pain_complaints',
        title: "Est-ce qu'il se plaint de douleurs ?",
        options: ['Ne se plaint pas', 'Gémissements légers', 'Cris fréquents']
      }
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      {questions.map((question) => (
        <div key={question.key} className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg text-vet-navy text-left mb-4 sm:mb-6">
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

      {/* Champ de téléchargement de photo pour les plaies */}
      {hasWound && (
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg text-vet-navy text-left mb-4 sm:mb-6">
            Ajoutez une photo de la plaie ci-dessous (optionnel)
          </h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-vet-sage/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('wound_photo', e.target.files?.[0] || null)}
              className="hidden"
              id="wound-photo-upload"
            />
            <label
              htmlFor="wound-photo-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm text-gray-600">
                Cliquez pour choisir un fichier ou faites-le glisser ici
              </span>
            </label>
            {answers['wound_photo'] && answers['wound_photo'] instanceof File && (
              <p className="text-sm text-vet-sage mt-2">
                Fichier sélectionné: {answers['wound_photo'].name}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConditionalQuestionsForm;
