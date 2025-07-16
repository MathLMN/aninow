
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { useBookingFormData } from "@/hooks/useBookingFormData";
import { useVeterinarianPreference } from "@/hooks/useVeterinarianPreference";
import { VeterinarianPreference } from "@/components/slots/VeterinarianPreference";
import { DateSlotCard } from "@/components/slots/DateSlotCard";

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
        <div className="max-w-4xl mx-auto">
          <ProgressBar value={90} />

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-vet-navy mb-2 sm:mb-4">
              Choisissez votre créneau
            </h1>
            <p className="text-vet-brown text-base sm:text-lg px-2">
              Sélectionnez votre préférence de vétérinaire et le créneau qui vous convient
            </p>
          </div>

          {/* Section préférence de vétérinaire - en haut sur mobile */}
          <div className="mb-6">
            <VeterinarianPreference
              veterinarians={veterinarians}
              selectedVeterinarian={selectedVeterinarian}
              onVeterinarianSelect={setSelectedVeterinarian}
            />
          </div>

          {/* Section créneaux disponibles */}
          <div className="space-y-3 sm:space-y-4">
            {filteredSlots.length > 0 ? (
              <>
                {/* Première carte automatiquement ouverte */}
                {filteredSlots[0] && (
                  <DateSlotCard
                    key={filteredSlots[0].date}
                    date={filteredSlots[0].date}
                    slots={filteredSlots[0].slots}
                    veterinarians={veterinarians}
                    selectedSlot={selectedSlot}
                    onSlotSelect={handleSlotSelect}
                    isExpanded={true}
                  />
                )}
                
                {/* Autres cartes collapsées */}
                {filteredSlots.slice(1).map((daySlots) => (
                  <DateSlotCard
                    key={daySlots.date}
                    date={daySlots.date}
                    slots={daySlots.slots}
                    veterinarians={veterinarians}
                    selectedSlot={selectedSlot}
                    onSlotSelect={handleSlotSelect}
                    isExpanded={false}
                  />
                ))}

                {/* Bouton "Voir plus de dates" si nécessaire */}
                {filteredSlots.length >= 7 && (
                  <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-sm">
                    <CardContent className="p-4">
                      <Button
                        variant="outline"
                        className="w-full border-vet-blue text-vet-blue hover:bg-vet-blue hover:text-white"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        VOIR PLUS DE DATES
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
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

          {/* Boutons de navigation */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between mt-8 sm:mt-12">
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white transition-colors text-sm sm:text-base py-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            
            <Button
              onClick={handleConfirm}
              disabled={!selectedSlot}
              className="bg-vet-sage hover:bg-vet-sage/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base py-3"
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
