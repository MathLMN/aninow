
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import BookingForm from "@/components/BookingForm";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { FormData } from "@/types/FormDataTypes";
import { useBookingFormData } from "@/hooks/useBookingFormData";

const BookingStart = () => {
  const navigate = useNavigate();
  const { updateBookingData } = useBookingFormData();

  const handleNext = (data: FormData) => {
    console.log('BookingStart: Form data submitted:', data);
    
    // Sauvegarder les données
    const dataToSave = {
      ...data,
      // Si c'est une portée, pré-remplir le motif de consultation
      ...(data.multipleAnimals.includes('une-portee') && data.vaccinationType ? {
        consultationReason: 'consultation-convenance',
        convenienceOptions: [data.vaccinationType === 'vaccinations-identifications' ? 'vaccination-identification' : 'vaccination']
      } : {})
    };
    
    updateBookingData(dataToSave);
    
    // Naviguer directement vers la prochaine étape
    const isLitter = data.multipleAnimals.includes('une-portee');
    if (isLitter && data.vaccinationType) {
      navigate('/booking/animal-info');
    } else {
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
