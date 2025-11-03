
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Plus, Calendar, Stethoscope, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateLocal } from "@/utils/date";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WeeklyCalendarViewProps {
  weekDates: Date[];
  bookings: any[];
  veterinarians: any[];
  filters: any;
  isLoading: boolean;
  onAppointmentClick: (appointment: any) => void;
  onCreateAppointment: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onWeekChange?: (direction: 'prev' | 'next') => void;
}

export const WeeklyCalendarView = ({
  weekDates,
  bookings,
  veterinarians,
  filters,
  isLoading,
  onAppointmentClick,
  onCreateAppointment,
  onWeekChange
}: WeeklyCalendarViewProps) => {
  const [selectedVetId, setSelectedVetId] = useState<string>("all");

  // Heures de consultation (7h à 21h par créneaux de 30min pour meilleure lisibilité)
  const timeSlots = [];
  for (let hour = 7; hour < 21; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  // Vérifier si une date est aujourd'hui
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Calculer la durée d'un RDV
  const getAppointmentDuration = (booking: any) => {
    // Durée par défaut: 30 minutes
    return '30 min';
  };

  // Obtenir le nom du vétérinaire
  const getVeterinarianName = (vetId: string | null) => {
    if (!vetId) return 'Non assigné';
    const vet = veterinarians.find(v => v.id === vetId);
    return vet ? vet.name : 'Vétérinaire inconnu';
  };

  const getBookingsForDateAndVet = (date: Date) => {
    const dateStr = formatDateLocal(date);
    return bookings.filter(booking => {
      // Exclure les créneaux bloqués de la vue semaine
      if (booking.is_blocked || booking.client_name === 'CRÉNEAU BLOQUÉ') {
        return false;
      }
      
      const matchesDate = booking.appointment_date === dateStr;
      
      // Filtre par vétérinaire sélectionné
      const matchesSelectedVet = selectedVetId === 'all' || booking.veterinarian_id === selectedVetId;
      
      const matchesFilters = 
        (filters.status === 'all' || booking.status === filters.status);
      
      return matchesDate && matchesSelectedVet && matchesFilters;
    });
  };

  const getStatusColor = (booking: any) => {
    // Pour les rendez-vous confirmés, utiliser la couleur du type de consultation
    if (booking.status === 'confirmed' && booking.consultation_type_color) {
      return ''; // Style inline sera appliqué
    }
    
    // Couleurs par statut pour les autres cas
    switch (booking.status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-gray-100 text-gray-800 border-gray-300'; // Fallback neutre
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full bg-gradient-to-br from-vet-blue/5 via-white to-vet-sage/5 flex items-center justify-center">
        <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
          <CardContent className="p-8">
            <div className="text-center text-vet-brown">Chargement du planning...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  return (
    <div className="h-full p-4 overflow-hidden flex flex-col">
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 flex-1 flex flex-col overflow-hidden">
        {/* En-tête avec navigation et filtres */}
        <CardHeader className="border-b border-vet-blue/20 bg-vet-beige/30 space-y-4 flex-shrink-0">
          {/* Navigation de semaine */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-vet-sage" />
              <div>
                <h2 className="text-xl font-bold text-vet-navy">
                  Semaine du {weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au {weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </h2>
                <p className="text-sm text-vet-brown">
                  {bookings.filter(b => !b.is_blocked && b.client_name !== 'CRÉNEAU BLOQUÉ').length} rendez-vous cette semaine
                </p>
              </div>
            </div>
            
            {onWeekChange && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onWeekChange('prev')}
                  className="border-vet-blue/30 hover:bg-vet-sage/10"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Semaine précédente
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onWeekChange('next')}
                  className="border-vet-blue/30 hover:bg-vet-sage/10"
                >
                  Semaine suivante
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>

          {/* Filtre par vétérinaire */}
          <div className="flex items-center gap-3">
            <Stethoscope className="h-5 w-5 text-vet-sage" />
            <span className="text-sm font-semibold text-vet-navy">Vue par vétérinaire :</span>
            <Select value={selectedVetId} onValueChange={setSelectedVetId}>
              <SelectTrigger className="w-64 bg-white border-vet-blue/30">
                <SelectValue placeholder="Sélectionner un vétérinaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-semibold">Tous les vétérinaires</span>
                  </div>
                </SelectItem>
                {veterinarians
                  .filter(vet => vet.is_active)
                  .map(vet => (
                    <SelectItem key={vet.id} value={vet.id}>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-vet-sage" />
                        <span>{vet.name}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
          {/* En-tête des colonnes - Sticky */}
          <div className="flex-shrink-0 sticky top-0 z-20 bg-vet-beige/30 border-b border-vet-blue/20">
            <div className="grid grid-cols-8 min-w-[1200px] h-12">
              <div className="p-2 text-vet-brown text-center border-r border-vet-blue/20 flex items-center justify-center">
                <span className="text-xs font-medium">Horaires</span>
              </div>
              {weekDates.map((date, index) => {
                const today = isToday(date);
                const dayBookings = getBookingsForDateAndVet(date);
                return (
                  <div 
                    key={index} 
                    className="p-2 text-center border-l border-vet-blue/20 flex flex-col justify-center"
                  >
                    <div className={`font-semibold text-sm capitalize leading-tight ${today ? 'text-vet-sage' : 'text-vet-navy'}`}>
                      {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </div>
                    <div className="text-xs text-vet-brown mt-1">
                      {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="text-xs text-vet-brown mt-1">
                      {dayBookings.length} RDV
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grille horaire - Scrollable */}
          <ScrollArea className="flex-1">
            <div className="min-w-[1200px]">
              {timeSlots.map((time, timeIndex) => {
                const isFullHour = time.endsWith(':00');
                
                return (
                  <div 
                    key={time} 
                    className="grid grid-cols-8 h-20 border-b border-gray-200/50"
                  >
                    {/* Colonne horaire */}
                    <div className="text-xs text-center font-medium border-r border-vet-blue/20 flex items-center justify-center bg-white text-gray-700">
                      <span className="text-[10px]">{time}</span>
                    </div>
                    
                    {/* Colonnes par jour */}
                    {weekDates.map((date, dayIndex) => {
                      const today = isToday(date);
                      const dayBookings = getBookingsForDateAndVet(date);
                      const timeBookings = dayBookings.filter(booking => 
                        booking.appointment_time === time
                      );

                      return (
                        <div
                          key={`${dayIndex}-${time}`}
                          className="p-1 border-l border-vet-blue/20 relative group bg-white hover:bg-gray-50/50"
                        >
                          {timeBookings.map((booking) => {
                            const hasCustomColor = booking.status === 'confirmed' && booking.consultation_type_color;
                            return (
                              <div
                                key={booking.id}
                                onClick={() => onAppointmentClick(booking)}
                                className={`mb-1 p-2 rounded border-l-4 cursor-pointer hover:shadow-md ${
                                  getStatusColor(booking)
                                }`}
                                style={
                                  hasCustomColor
                                    ? {
                                        backgroundColor: `${booking.consultation_type_color}15`,
                                        borderLeftColor: booking.consultation_type_color
                                      }
                                    : {
                                        borderLeftColor: 'hsl(var(--vet-sage))',
                                        backgroundColor: 'white'
                                      }
                                }
                              >
                                {/* En-tête de la carte */}
                                <div className="flex items-start justify-between mb-1">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-vet-sage flex-shrink-0" />
                                    <span className="text-[10px] font-bold text-vet-navy">
                                      {booking.appointment_time}
                                    </span>
                                  </div>
                                </div>

                                {/* Client */}
                                <div className="flex items-center gap-1 mb-0.5">
                                  <User className="h-3 w-3 text-vet-brown flex-shrink-0" />
                                  <span className="text-[11px] font-semibold text-vet-navy truncate">
                                    {booking.client_name}
                                  </span>
                                </div>

                                {/* Animal */}
                                <div className="flex items-center gap-1 mb-0.5">
                                  <Stethoscope className="h-3 w-3 text-vet-sage flex-shrink-0" />
                                  <span className="text-[10px] text-vet-brown truncate">
                                    {booking.animal_name}
                                  </span>
                                </div>

                                {/* Vétérinaire assigné (si mode "Tous") */}
                                {selectedVetId === 'all' && booking.veterinarian_id && (
                                  <div className="flex items-center gap-1 mb-0.5">
                                    <Stethoscope className="h-3 w-3 text-vet-sage flex-shrink-0" />
                                    <span className="text-[10px] font-medium text-vet-sage truncate">
                                      {getVeterinarianName(booking.veterinarian_id)}
                                    </span>
                                  </div>
                                )}

                                {/* Badge statut si non confirmé */}
                                {booking.status !== 'confirmed' && (
                                  <Badge 
                                    variant="outline" 
                                    className="text-[9px] px-1 py-0 h-3.5 mt-1"
                                  >
                                    {getStatusLabel(booking.status)}
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                          
                          {/* Bouton d'ajout au survol */}
                          {timeBookings.length === 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-50 transition-opacity flex items-center justify-center"
                              onClick={() => onCreateAppointment({
                                date: date.toISOString().split('T')[0],
                                time: time
                              })}
                            >
                              <Plus className="h-4 w-4 text-vet-sage" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
