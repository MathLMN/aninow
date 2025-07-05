
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import BookingForm from "@/components/BookingForm";
import Header from "@/components/Header";

const PublicBooking = () => {
  const navigate = useNavigate();
  const handleFormNext = (formData: any) => {
    console.log('Form data:', formData);
    // Stocker les données du formulaire
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
    
    // Si c'est une portée, aller directement vers les informations animal
    if (formData.multipleAnimals?.includes('une-portee')) {
      navigate('/booking/animal-info');
    } else {
      // Sinon, suivre le flux normal vers la sélection du motif
      navigate('/booking/reason');
    }
  };
  
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)'
    }}>
      <Header />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-6">
        <div className="max-w-2xl mx-auto">
          {/* Titre - Mobile optimized */}
          <div className="text-center mb-4 sm:mb-6 animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-vet-navy mb-1 sm:mb-2 leading-tight">
              Prendre un rendez-vous
            </h1>
            <p className="text-sm sm:text-base text-vet-brown/80 px-2">
              Remplissez les informations de votre animal
            </p>
          </div>

          {/* Formulaire - Mobile first card */}
          <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg">
            <CardContent className="p-3 sm:p-6">
              <BookingForm onNext={handleFormNext} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PublicBooking;
