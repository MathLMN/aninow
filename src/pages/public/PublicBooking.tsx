
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BookingForm from "@/components/BookingForm";

const PublicBooking = () => {
  const navigate = useNavigate();

  const handleFormNext = (formData: any) => {
    console.log('Form data:', formData);
    // Stocker les données du formulaire et naviguer vers la sélection du motif
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
    navigate('/booking/reason');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      {/* Header - Mobile first */}
      <header className="bg-vet-navy text-vet-beige shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-vet-sage" />
              <span className="text-lg sm:text-xl font-bold">AniNow</span>
            </div>
            <Link to="/vet/login">
              <Button variant="ghost" className="text-vet-beige hover:bg-white/10 text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden xs:inline">Espace </span>Clinique
              </Button>
            </Link>
          </div>
        </div>
      </header>

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
