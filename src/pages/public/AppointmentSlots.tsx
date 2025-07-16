
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { useBookingFormData } from "@/hooks/useBookingFormData";

const AppointmentSlots = () => {
  const navigate = useNavigate();
  const { availableSlots, isLoading } = useAvailableSlots();
  const { updateBookingData } = useBookingFormData();
  const [selectedSlot, setSelectedSlot] = useState<{date: string, time: string, veterinarianId: string} | null>(null);

  const handleBack = () => {
    navigate('/booking/contact-info');
  };

  const handleSlotSelect = (date: string, time: string, veterinarianId: string) => {
    setSelectedSlot({ date, time, veterinarianId });
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      // Mettre à jour les données avec le créneau sélectionné
      const updatedData = {
        appointmentDate: selectedSlot.date,
        appointmentTime: selectedSlot.time,
        veterinarianId: selectedSlot.veterinarianId
      };
      
      updateBookingData(updatedData);
      console.log('Créneau sélectionné:', selectedSlot);
      
      // Navigation vers la page de confirmation
      navigate('/booking/confirmation');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-vet-brown">Chargement des créneaux disponibles...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <ProgressBar value={90} />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-vet-navy mb-4">
              Choisissez votre créneau
            </h1>
            <p className="text-vet-brown text-lg">
              Sélectionnez le jour et l'heure qui vous conviennent le mieux
            </p>
          </div>

          <div className="space-y-6">
            {availableSlots.map((daySlots) => (
              <Card key={daySlots.date} className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-vet-navy">
                    <Calendar className="h-5 w-5 mr-2" />
                    {formatDate(daySlots.date)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {daySlots.slots
                      .filter(slot => slot.available)
                      .map((slot) => (
                        <Button
                          key={`${daySlots.date}-${slot.time}-${slot.veterinarian_id}`}
                          variant={
                            selectedSlot?.date === daySlots.date && 
                            selectedSlot?.time === slot.time && 
                            selectedSlot?.veterinarianId === slot.veterinarian_id
                              ? "default" 
                              : "outline"
                          }
                          className={`h-12 ${
                            selectedSlot?.date === daySlots.date && 
                            selectedSlot?.time === slot.time && 
                            selectedSlot?.veterinarianId === slot.veterinarian_id
                              ? "bg-vet-sage text-white border-vet-sage" 
                              : "border-vet-blue/30 text-vet-navy hover:bg-vet-sage/10"
                          }`}
                          onClick={() => handleSlotSelect(daySlots.date, slot.time, slot.veterinarian_id)}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {slot.time}
                        </Button>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {availableSlots.length === 0 && (
            <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
              <CardContent className="text-center py-12">
                <p className="text-vet-brown mb-4">
                  Aucun créneau disponible pour le moment.
                </p>
                <p className="text-vet-brown/70">
                  Veuillez nous contacter directement pour prendre rendez-vous.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            
            <Button
              onClick={handleConfirm}
              disabled={!selectedSlot}
              className="bg-vet-sage hover:bg-vet-sage/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedSlot ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmer le {selectedSlot.date} à {selectedSlot.time}
                </>
              ) : (
                "Sélectionnez un créneau"
              )}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentSlots;
