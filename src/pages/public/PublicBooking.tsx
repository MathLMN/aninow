
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BookingForm from "@/components/BookingForm";

const PublicBooking = () => {
  const navigate = useNavigate();

  const handleFormNext = (formData: any) => {
    console.log('Form data:', formData);
    // Stocker les données du formulaire et naviguer vers la sélection de créneaux
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
    navigate('/booking/slots');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      {/* Header */}
      <header className="bg-vet-navy text-vet-beige shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-6 w-6 text-vet-sage" />
              <span className="text-xl font-bold">AniNow</span>
            </div>
            <Link to="/vet/login">
              <Button variant="ghost" className="text-vet-beige hover:bg-white/10">
                <Settings className="h-4 w-4 mr-2" />
                Espace Clinique
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Titre */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-vet-navy mb-2">
              Prendre un rendez-vous
            </h1>
          </div>

          {/* Formulaire */}
          <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-vet-navy">
                Informations sur votre animal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <BookingForm onNext={handleFormNext} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PublicBooking;
