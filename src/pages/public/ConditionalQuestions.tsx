
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ConditionalQuestionsHeader from "@/components/conditional-questions/ConditionalQuestionsHeader";
import ConditionalQuestionsContent from "@/components/conditional-questions/ConditionalQuestionsContent";
import { useConditionalQuestionsValidation } from "@/hooks/useConditionalQuestionsValidation";

const ConditionalQuestions = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<{
    [key: string]: any;
  }>({});
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    // Vérifier que l'utilisateur vient bien de la page motif de consultation
    const storedData = localStorage.getItem('bookingFormData');
    if (!storedData) {
      navigate('/');
      return;
    }
    const parsedData = JSON.parse(storedData);
    setBookingData(parsedData);

    // Vérifier que au moins un animal a des symptômes sélectionnés
    const hasFirstAnimalSymptoms = parsedData.selectedSymptoms?.length > 0 || parsedData.customSymptom?.trim() !== '';
    const hasSecondAnimalSymptoms = parsedData.secondAnimalSelectedSymptoms?.length > 0 || parsedData.secondAnimalCustomSymptom?.trim() !== '';
    
    if (!hasFirstAnimalSymptoms && !hasSecondAnimalSymptoms) {
      navigate('/booking/consultation-reason');
      return;
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/booking/consultation-reason');
  };

  const handleNext = () => {
    const existingData = JSON.parse(localStorage.getItem('bookingFormData') || '{}');
    const updatedData = {
      ...existingData,
      conditionalAnswers: answers
    };
    localStorage.setItem('bookingFormData', JSON.stringify(updatedData));
    console.log('Updated booking data with conditional answers:', updatedData);

    // Naviguer vers la page de durée des symptômes (route corrigée)
    navigate('/booking/symptom-duration');
  };

  const handleAnswersChange = (newAnswers: any) => {
    setAnswers(newAnswers);
  };

  const validation = useConditionalQuestionsValidation({ bookingData, answers });

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
          <ConditionalQuestionsHeader />

          {/* Titre - Maintenant à l'extérieur de la carte pour cohérence */}
          <div className="text-center mb-4 sm:mb-8 animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-vet-navy mb-2 leading-tight">Questions complémentaires</h1>
            <p className="text-sm sm:text-base text-vet-brown/80 px-2">Aidez-nous à mieux détecter l'urgence</p>
          </div>

          <ConditionalQuestionsContent
            bookingData={bookingData}
            answers={answers}
            onAnswersChange={handleAnswersChange}
            onNext={handleNext}
            onBack={handleBack}
            canProceed={validation.canProceed}
            hasAnyConditions={validation.hasAnyConditions}
          />
        </div>
      </main>
    </div>
  );
};

export default ConditionalQuestions;
