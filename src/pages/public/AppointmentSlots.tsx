
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { useBookingFormData } from "@/hooks/useBookingFormData";
import { useVeterinarianPreference } from "@/hooks/useVeterinarianPreference";
import { VeterinarianPreference } from "@/components/slots/VeterinarianPreference";

const AppointmentSlots = () => {
  const navigate = useNavigate();
  const { availableSlots, isLoading } = useAvailableSlots();
  const { updateBookingData } = useBookingFormData();
  const { veterinarians, selectedVeterinarian, setSelectedVeterinarian, isLoading: vetsLoading } = useVeterinarianPreference();
  const [selectedSlot, setSelectedSlot] = useState<{date: string, time: string, veterinarianId: string} | null>(null);

  const handleBack = () => {
    navigate('/booking/contact-info');
  };

  const handleSlotSelect = (date: string, time: string, veterinarianId: string) => {
    setSelectedSlot({ date, time, veterinarianId });
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      const updatedData = {
        appointmentDate: selectedSlot.date,
        appointmentTime: selectedSlot.time,
        veterinarianId: selectedSlot.veterinarianId
      };
      
      updateBookingData(updatedData);
      console.log('Créneau sélectionné:', selectedSlot);
      
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

  // Filtrer les créneaux selon la préférence de vétérinaire
  const filteredSlots = availableSlots.map(daySlots => ({
    ...daySlots,
    slots: daySlots.slots.filter(slot => {
      if (!slot.available) return false;
      
      // Si aucune préférence de vétérinaire, afficher tous les créneaux
      if (!selectedVeterinarian) return true;
      
      // Si préférence spécifique, ne montrer que les créneaux de ce vétérinaire
      return slot.veterinarian_id === selectedVeterinarian;
    })
  })).filter(daySlots => daySlots.slots.length > 0);

  if (isLoading || vetsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vet-beige via-background to-vet-blue/20">
        <Header />
        <main className="container mx-auto px-3 sm:px-6 py-6 sm:py-12">
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

      <main className="container mx-auto px-3 sm:px-6 py-6 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <ProgressBar value={90} />

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-vet-navy mb-2 sm:mb-4">
              Choisissez votre créneau
            </h1>
            <p className="text-vet-brown text-base sm:text-lg px-2">
              Sélectionnez votre préférence de vétérinaire et le créneau qui vous convient
            </p>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Section préférence de vétérinaire - mobile first */}
            <div className="lg:col-span-1 order-1">
              <VeterinarianPreference
                veterinarians={veterinarians}
                selectedVeterinarian={selectedVeterinarian}
                onVeterinarianSelect={setSelectedVeterinarian}
              />
            </div>

            {/* Section créneaux disponibles */}
            <div className="lg:col-span-2 order-2">
              <div className="space-y-4 sm:space-y-6">
                {filteredSlots.length > 0 ? (
                  filteredSlots.map((daySlots) => (
                    <Card key={daySlots.date} className="bg-white/95 backdrop-blur-sm border-vet-blue/30 shadow-lg">
                      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                        <CardTitle className="flex items-center text-vet-navy text-lg sm:text-xl">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-vet-sage flex-shrink-0" />
                          <span className="text-sm sm:text-base leading-tight">
                            {formatDate(daySlots.date)}
                          </span>
                        </CardTitle>
                        <CardDescription className="text-vet-brown text-xs sm:text-sm">
                          {daySlots.slots.length} créneau{daySlots.slots.length > 1 ? 'x' : ''} disponible{daySlots.slots.length > 1 ? 's' : ''}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                          {daySlots.slots.map((slot) => {
                            const isSelected = selectedSlot?.date === daySlots.date && 
                                             selectedSlot?.time === slot.time && 
                                             selectedSlot?.veterinarianId === slot.veterinarian_id;
                            
                            const veterinarian = veterinarians.find(v => v.id === slot.veterinarian_id);
                            
                            return (
                              <Button
                                key={`${daySlots.date}-${slot.time}-${slot.veterinarian_id}`}
                                variant={isSelected ? "default" : "outline"}
                                className={`h-auto p-2 sm:p-3 flex flex-col items-center text-center transition-all duration-200 ${
                                  isSelected
                                    ? "bg-vet-sage hover:bg-vet-sage/90 text-white border-vet-sage shadow-lg scale-105" 
                                    : "border-vet-blue/30 text-vet-navy hover:bg-vet-sage/10 hover:border-vet-sage/50 hover:shadow-md"
                                }`}
                                onClick={() => handleSlotSelect(daySlots.date, slot.time, slot.veterinarian_id)}
                              >
                                <div className="flex items-center mb-1">
                                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                  <span className="font-semibold text-xs sm:text-sm">{slot.time}</span>
                                </div>
                                {veterinarian && (
                                  <span className="text-xs opacity-75 truncate max-w-full leading-tight">
                                    {veterinarian.name}
                                  </span>
                                )}
                              </Button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/30 shadow-lg">
                    <CardContent className="text-center py-8 sm:py-12 px-3 sm:px-6">
                      <div className="text-vet-brown mb-4">
                        {selectedVeterinarian ? (
                          <>
                            <p className="mb-2 text-sm sm:text-base">Aucun créneau disponible pour le vétérinaire sélectionné.</p>
                            <p className="text-xs sm:text-sm">Essayez de sélectionner "Pas de préférence" ou un autre vétérinaire.</p>
                          </>
                        ) : (
                          <>
                            <p className="mb-2 text-sm sm:text-base">Aucun créneau disponible pour le moment.</p>
                            <p className="text-xs sm:text-sm">Veuillez nous contacter directement pour prendre rendez-vous.</p>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between mt-6 sm:mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white transition-colors text-sm sm:text-base py-2 sm:py-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            
            <Button
              onClick={handleConfirm}
              disabled={!selectedSlot}
              className="bg-vet-sage hover:bg-vet-sage/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base py-2 sm:py-2"
            >
              {selectedSlot ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="truncate">
                    Confirmer le {formatDate(selectedSlot.date)} à {selectedSlot.time}
                  </span>
                </>
              ) : (
                "Sélectionnez un créneau"
              )}
              <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentSlots;
