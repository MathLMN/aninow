
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { useBookingFormData } from "@/hooks/useBookingFormData";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";
import { VeterinarianPreference } from "@/components/slots/VeterinarianPreference";
import { DateSlotCard } from "@/components/slots/DateSlotCard";
import { useClinicContext } from "@/contexts/ClinicContext";

interface Veterinarian {
  id: string;
  name: string;
  specialty?: string;
}

const AppointmentSlots = () => {
  const navigate = useNavigate();
  const { currentClinic } = useClinicContext();
  const { availableSlots, isLoading } = useAvailableSlots();
  const { updateBookingData } = useBookingFormData();
  const { veterinarians, isLoading: vetsLoading, error: vetsError } = useClinicVeterinarians();
  const [selectedVeterinarian, setSelectedVeterinarian] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{date: string, time: string, veterinarianId: string} | null>(null);

  console.log('🏥 AppointmentSlots - Current clinic:', currentClinic);
  console.log('🏥 AppointmentSlots - Available slots:', availableSlots);
  console.log('🏥 AppointmentSlots - Veterinarians from useClinicVeterinarians:', veterinarians);
  console.log('🏥 AppointmentSlots - Veterinarians count:', Array.isArray(veterinarians) ? veterinarians.length : 0);
  console.log('🏥 AppointmentSlots - Veterinarians array:', JSON.stringify(veterinarians, null, 2));
  console.log('🏥 AppointmentSlots - Selected veterinarian:', selectedVeterinarian);
  console.log('🏥 AppointmentSlots - Is loading slots:', isLoading);
  console.log('🏥 AppointmentSlots - Is loading vets:', vetsLoading);
  console.log('🏥 AppointmentSlots - Vets error:', vetsError);

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

  const groupSlotsByTime = (slots: any[]) => {
    const groupedSlots = new Map();
    
    slots.forEach(slot => {
      if (!slot.available) return;
      
      const timeKey = slot.time;
      if (!groupedSlots.has(timeKey)) {
        // Prendre le premier vétérinaire disponible pour ce créneau
        groupedSlots.set(timeKey, {
          ...slot,
          availableVeterinarians: [slot.veterinarian_id]
        });
      } else {
        // Ajouter le vétérinaire à la liste des disponibles pour ce créneau
        const existingSlot = groupedSlots.get(timeKey);
        existingSlot.availableVeterinarians.push(slot.veterinarian_id);
      }
    });
    
    return Array.from(groupedSlots.values());
  };

  const filteredSlots = availableSlots.map(daySlots => {
    let processedSlots;
    
    if (!selectedVeterinarian) {
      // Pas de préférence : regrouper les créneaux par heure
      processedSlots = groupSlotsByTime(daySlots.slots);
    } else {
      // Préférence spécifique : filtrer par vétérinaire
      processedSlots = daySlots.slots.filter(slot => {
        if (!slot.available) return false;
        return slot.veterinarian_id === selectedVeterinarian;
      });
    }
    
    return {
      ...daySlots,
      slots: processedSlots
    };
  }).filter(daySlots => daySlots.slots.length > 0);

  console.log('🏥 AppointmentSlots - Filtered slots:', filteredSlots);

  if (isLoading || vetsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36%">
        <Header />
        <main className="container mx-auto px-3 sm:px-6 pt-20 sm:pt-24 pb-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-vet-navy mb-2">
                Chargement des créneaux disponibles...
              </h1>
              {currentClinic && (
                <p className="text-vet-brown text-sm">
                  Clinique : {currentClinic.name}
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // S'assurer que veterinarians est un tableau
  const vetsArray: Veterinarian[] = Array.isArray(veterinarians) ? veterinarians : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] from-0% to-[#EDE3DA] to-36%">
      <Header />

      <main className="container mx-auto px-3 sm:px-6 pt-20 sm:pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          <ProgressBar currentStep={7} totalSteps={7} />

          {/* Bouton retour cohérent avec les autres pages */}
          <div className="mb-4 sm:mb-6">
            <Button variant="ghost" onClick={handleBack} className="text-vet-navy hover:bg-vet-beige/20 p-2 text-sm sm:text-base -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-vet-navy mb-2 sm:mb-4">
              Choisissez votre créneau
            </h1>
            <p className="text-vet-brown text-base sm:text-lg px-2">
              Sélectionnez votre préférence de vétérinaire et le créneau qui vous convient
            </p>
            {currentClinic && (
              <p className="text-vet-brown text-sm mt-2">
                {currentClinic.name}
              </p>
            )}
          </div>

          {/* Section préférence de vétérinaire - Toujours afficher */}
          <div className="mb-6">
            <VeterinarianPreference
              veterinarians={vetsArray}
              selectedVeterinarian={selectedVeterinarian}
              onVeterinarianSelect={setSelectedVeterinarian}
            />
          </div>

          {/* Debug info temporaire */}
          {vetsError && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700">Erreur de chargement des vétérinaires: {vetsError}</p>
            </div>
          )}

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
                    veterinarians={vetsArray}
                    selectedSlot={selectedSlot}
                    onSlotSelect={handleSlotSelect}
                    isExpanded={true}
                    noVeterinarianPreference={!selectedVeterinarian}
                  />
                )}
                
                {/* Autres cartes collapsées - limité à 5 jours */}
                {filteredSlots.slice(1, 5).map((daySlots) => (
                  <DateSlotCard
                    key={daySlots.date}
                    date={daySlots.date}
                    slots={daySlots.slots}
                    veterinarians={vetsArray}
                    selectedSlot={selectedSlot}
                    onSlotSelect={handleSlotSelect}
                    isExpanded={false}
                    noVeterinarianPreference={!selectedVeterinarian}
                  />
                ))}

                {/* Bouton "Voir plus de dates" si nécessaire */}
                {filteredSlots.length > 5 && (
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
                    {vetsArray.length === 0 ? (
                      <>
                        <p className="mb-2 text-sm sm:text-base">Cette clinique n'a pas encore configuré ses vétérinaires.</p>
                        <p className="text-xs sm:text-sm">Veuillez contacter directement la clinique pour prendre rendez-vous.</p>
                      </>
                    ) : selectedVeterinarian ? (
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

          {/* Bouton de confirmation */}
          <div className="flex justify-end mt-8 sm:mt-12">
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
