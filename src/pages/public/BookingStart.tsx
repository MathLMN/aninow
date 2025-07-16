import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BookingForm from "@/components/BookingForm";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { FormData } from "@/types/FormDataTypes";
import { useBookingFormData } from "@/hooks/useBookingFormData";

const BookingStart = () => {
  const navigate = useNavigate();
  const { bookingData } = useBookingFormData();

  // Check if user has already completed this step and should be redirected
  useEffect(() => {
    if (bookingData && bookingData.animalSpecies) {
      const isLitter = bookingData.multipleAnimals?.includes('une-portee');
      
      // If it's a litter with vaccination type selected, or a regular animal with name
      if ((isLitter && bookingData.vaccinationType) || (!isLitter && bookingData.animalName)) {
        console.log('User has already completed basic data, checking next step...');
        
        // If user has consultation reason, redirect to animal info
        if (bookingData.consultationReason) {
          navigate('/booking/animal-info', { replace: true });
          return;
        }
        
        // Otherwise redirect to consultation reason unless it's a litter (which goes to animal info)
        if (isLitter && bookingData.vaccinationType) {
          navigate('/booking/animal-info', { replace: true });
        } else if (!isLitter) {
          navigate('/booking/consultation-reason', { replace: true });
        }
      }
    }
  }, [bookingData, navigate]);

  const handleNext = (data: FormData) => {
    console.log('Form data submitted:', data);
    
    // Si c'est une portée avec type de vaccination sélectionné, aller directement aux infos animal
    if (data.multipleAnimals.includes('une-portee') && data.vaccinationType) {
      console.log('Litter with vaccination type, navigating to animal info');
      navigate('/booking/animal-info');
    } else {
      // Sinon, aller vers le motif de consultation
      console.log('Regular animal or no vaccination type, navigating to consultation reason');
      navigate('/booking/consultation-reason');
    }
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)' }}>
      <Header />

      <main className="container mx-auto px-3 sm:px-6 py-3 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressBar value={14.3} />
          
          {/* Titre - Mobile optimized */}
          <div className="text-center mb-4 sm:mb-8 animate-fade-in">
            <h1 className="text-xl sm:text-3xl font-bold text-vet-navy mb-2 px-2">
              Demande de rendez-vous
            </h1>
            <p className="text-sm sm:text-lg text-vet-navy/70 leading-relaxed px-2">
              Commençons par quelques informations sur votre compagnon
            </p>
          </div>

          {/* Formulaire - Mobile optimized */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardContent className="p-3 sm:p-8">
              <BookingForm onNext={handleNext} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BookingStart;
