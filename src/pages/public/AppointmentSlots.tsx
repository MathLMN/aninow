
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { VeterinarianPreference } from "@/components/slots/VeterinarianPreference";
import { useVeterinarianPreference } from "@/hooks/useVeterinarianPreference";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { useBookingSubmission } from "@/hooks/useBookingSubmission";
import { useToast } from "@/hooks/use-toast";

interface TimeSlotGroup {
  period: string;
  slots: string[];
}

interface DateSlot {
  date: string;
  availability: number;
  timeGroups: TimeSlotGroup[];
}

const AppointmentSlots = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [openDate, setOpenDate] = useState<string>("");

  const {
    veterinarians,
    selectedVeterinarian,
    setSelectedVeterinarian,
    isLoading: vetsLoading
  } = useVeterinarianPreference();

  const { availableSlots, isLoading: slotsLoading } = useAvailableSlots();
  const { submitBooking, isSubmitting } = useBookingSubmission();

  // Transformer les créneaux disponibles en format pour l'affichage
  const formatSlotsForDisplay = () => {
    if (!availableSlots.length) return [];

    return availableSlots.map(daySlots => {
      const availableForVet = selectedVeterinarian 
        ? daySlots.slots.filter(slot => 
            slot.veterinarian_id === selectedVeterinarian && slot.available
          )
        : daySlots.slots.filter(slot => slot.available);

      // Grouper par période (matin/après-midi)
      const morningSlots = availableForVet
        .filter(slot => {
          const hour = parseInt(slot.time.split(':')[0]);
          return hour < 14;
        })
        .map(slot => slot.time);

      const afternoonSlots = availableForVet
        .filter(slot => {
          const hour = parseInt(slot.time.split(':')[0]);
          return hour >= 14;
        })
        .map(slot => slot.time);

      const timeGroups: TimeSlotGroup[] = [];
      if (morningSlots.length > 0) {
        timeGroups.push({ period: "Matin", slots: morningSlots });
      }
      if (afternoonSlots.length > 0) {
        timeGroups.push({ period: "Après-midi", slots: afternoonSlots });
      }

      return {
        date: daySlots.date,
        availability: availableForVet.length,
        timeGroups
      };
    }).filter(day => day.availability > 0); // Filtrer les jours sans créneaux
  };

  const displaySlots = formatSlotsForDisplay();

  const handleBooking = async () => {
    if (selectedDate && selectedTime) {
      try {
        // Récupérer les données du formulaire depuis le localStorage
        const formData = JSON.parse(localStorage.getItem('bookingFormData') || '{}');
        
        // Créer la réservation avec le vétérinaire sélectionné
        const bookingData = {
          ...formData,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          veterinarian_id: selectedVeterinarian,
          status: 'pending'
        };

        const result = await submitBooking(bookingData);
        
        if (result.booking && !result.error) {
          // Nettoyer le localStorage
          localStorage.removeItem('bookingFormData');
          navigate('/booking/confirmation');
        }
      } catch (err) {
        console.error('Erreur lors de la création du RDV:', err);
        toast({
          title: "Erreur",
          description: "Impossible de créer le rendez-vous. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    }
  };

  const handleBack = () => {
    navigate('/booking/contact-info');
  };

  const handleDateSelect = (date: string) => {
    if (selectedDate === date) {
      // If clicking the same date, toggle accordion
      setOpenDate(openDate === date ? "" : date);
    } else {
      // If selecting a new date, set it as selected and open
      setSelectedDate(date);
      setOpenDate(date);
      setSelectedTime(""); // Reset time selection
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      dayName: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString('fr-FR', { month: 'long' })
    };
  };

  const getAvailabilityColor = (count: number) => {
    if (count >= 8) return "bg-green-100 text-green-800";
    if (count >= 4) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #EDE3DA 0%, #ffffff 100%)'
    }}>
      <Header />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <ProgressBar value={90} />
          
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-vet-navy mb-2 leading-tight">
              Choisissez votre créneau
            </h1>
            <p className="text-sm sm:text-base text-vet-brown/80 px-2">
              Sélectionnez votre vétérinaire préféré puis la date et l'heure qui vous conviennent
            </p>
          </div>

          {/* Back button */}
          <div className="mb-6">
            <Button variant="ghost" onClick={handleBack} className="text-vet-navy hover:bg-vet-beige/20 p-2 text-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>

          {/* Veterinarian preference selection */}
          <div className="mb-6">
            <VeterinarianPreference
              veterinarians={veterinarians}
              selectedVeterinarian={selectedVeterinarian}
              onVeterinarianSelect={setSelectedVeterinarian}
            />
          </div>

          {/* Loading state */}
          {(slotsLoading || vetsLoading) && (
            <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg mb-6">
              <CardContent className="p-8 text-center">
                <div className="text-vet-brown">
                  <p>Chargement des créneaux disponibles...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No slots available */}
          {!slotsLoading && !vetsLoading && displaySlots.length === 0 && (
            <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg mb-6">
              <CardContent className="p-8 text-center">
                <div className="text-vet-brown">
                  <p className="text-lg font-medium mb-2">Aucun créneau disponible</p>
                  <p>
                    {selectedVeterinarian 
                      ? "Aucun créneau disponible pour le vétérinaire sélectionné. Essayez de changer votre préférence ou contactez la clinique."
                      : "Aucun créneau disponible actuellement. Veuillez contacter la clinique."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Date selection with accordion */}
          {!slotsLoading && !vetsLoading && displaySlots.length > 0 && (
            <Card className="bg-white/95 backdrop-blur-sm border-vet-blue/20 shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-vet-navy">
                  <Calendar className="h-5 w-5 mr-2 text-vet-sage" />
                  Dates disponibles
                  {selectedVeterinarian && (
                    <Badge className="ml-2 bg-vet-sage/10 text-vet-sage">
                      {veterinarians.find(v => v.id === selectedVeterinarian)?.name}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-vet-brown">
                  {selectedVeterinarian 
                    ? "Créneaux disponibles pour le vétérinaire sélectionné"
                    : "Cliquez sur une date pour voir les créneaux disponibles"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {displaySlots.map((dateSlot) => {
                  const { dayName, dayNumber, month } = formatDate(dateSlot.date);
                  const isSelected = selectedDate === dateSlot.date;
                  const isOpen = openDate === dateSlot.date;
                  
                  return (
                    <Collapsible key={dateSlot.date} open={isOpen} onOpenChange={() => handleDateSelect(dateSlot.date)}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`w-full justify-between h-auto p-4 border rounded-lg transition-all ${
                            isSelected 
                              ? "border-vet-sage bg-vet-sage/10 hover:bg-vet-sage/15" 
                              : "border-vet-blue/30 hover:bg-vet-blue/5"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-left">
                              <div className="font-semibold text-vet-navy capitalize">
                                {dayName} {dayNumber} {month}
                              </div>
                              <div className="text-sm text-vet-brown/70">
                                {new Date(dateSlot.date).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                            <Badge className={getAvailabilityColor(dateSlot.availability)}>
                              {dateSlot.availability} créneaux
                            </Badge>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-vet-brown transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="px-4 pb-4">
                        <div className="mt-4 space-y-4">
                          {dateSlot.timeGroups.map((group) => (
                            <div key={group.period}>
                              <h4 className="text-sm font-medium text-vet-navy mb-2 flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-vet-sage" />
                                {group.period}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {group.slots.map((time) => (
                                  <Button
                                    key={time}
                                    variant={selectedTime === time ? "default" : "outline"}
                                    size="sm"
                                    className={`rounded-full px-4 py-2 ${
                                      selectedTime === time
                                        ? "bg-vet-sage hover:bg-vet-sage/90 text-white border-vet-sage"
                                        : "border-vet-blue/30 hover:bg-vet-blue/10 hover:border-vet-sage/50"
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTime(time);
                                    }}
                                  >
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Summary and confirmation */}
          {selectedDate && selectedTime && (
            <Card className="bg-vet-sage/10 backdrop-blur-sm border-vet-sage/30 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-vet-navy mb-1">
                      Votre rendez-vous
                    </h3>
                    <p className="text-vet-brown">
                      {(() => {
                        const { dayName, dayNumber, month } = formatDate(selectedDate);
                        return `${dayName} ${dayNumber} ${month} ${new Date(selectedDate).getFullYear()} à ${selectedTime}`;
                      })()}
                    </p>
                    {selectedVeterinarian && (
                      <p className="text-sm text-vet-brown/80 mt-1">
                        Vétérinaire : {veterinarians.find(v => v.id === selectedVeterinarian)?.name}
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={handleBooking}
                    disabled={isSubmitting}
                    className="bg-vet-sage hover:bg-vet-sage/90 text-white px-8 rounded-full"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Demander le rendez-vous'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppointmentSlots;
