
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ConditionalQuestionsHeader from "@/components/conditional-questions/ConditionalQuestionsHeader";
import ConditionalQuestionsContent from "@/components/conditional-questions/ConditionalQuestionsContent";
import { useConditionalQuestionsValidation } from "@/hooks/useConditionalQuestionsValidation";
import { useBookingFormData } from "@/hooks/useBookingFormData";
import { useBookingNavigation } from "@/hooks/useBookingNavigation";

const ConditionalQuestions = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<{
    [key: string]: any;
  }>({});
  
  const { bookingData, updateBookingData } = useBookingFormData();
  const { navigateBack, navigateNext } = useBookingNavigation();

  useEffect(() => {
    // Vérifier que au moins un animal a des symptômes sélectionnés
    const hasFirstAnimalSymptoms = bookingData?.selectedSymptoms?.length > 0 || bookingData?.customSymptom?.trim() !== '';
    const hasSecondAnimalSymptoms = bookingData?.secondAnimalSelectedSymptoms?.length > 0 || bookingData?.secondAnimalCustomSymptom?.trim() !== '';
    
    if (!hasFirstAnimalSymptoms && !hasSecondAnimalSymptoms) {
      navigate('/booking/consultation-reason');
      return;
    }

    // Charger les réponses existantes
    if (bookingData?.conditionalAnswers) {
      setAnswers(bookingData.conditionalAnswers);
    }
  }, [navigate, bookingData]);

  const handleBack = () => {
    navigateBack('/booking/conditional-questions');
  };

  const handleNext = () => {
    updateBookingData({
      conditionalAnswers: answers
    });
    console.log('ConditionalQuestions: Updated booking data with conditional answers:', answers);

    navigateNext('/booking/conditional-questions');
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
