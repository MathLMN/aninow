
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Plus, Calendar, Stethoscope } from "lucide-react";
import { formatDateLocal } from "@/utils/date";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WeeklyCalendarViewProps {
  weekDates: Date[];
  bookings: any[];
  veterinarians: any[];
  filters: any;
  isLoading: boolean;
  onAppointmentClick: (appointment: any) => void;
  onCreateAppointment: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
}

export const WeeklyCalendarView = ({
  weekDates,
  bookings,
  veterinarians,
  filters,
  isLoading,
  onAppointmentClick,
  onCreateAppointment
}: WeeklyCalendarViewProps) => {
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

  const getBookingsForDateAndVet = (date: Date, veterinarianId?: string) => {
    const dateStr = formatDateLocal(date);
    return bookings.filter(booking => {
      const matchesDate = booking.appointment_date === dateStr;
      const matchesVet = !veterinarianId || booking.veterinarian_id === veterinarianId;
      const matchesFilters = 
        (filters.veterinarian === 'all' || booking.veterinarian_id === filters.veterinarian) &&
        (filters.status === 'all' || booking.status === filters.status);
      return matchesDate && matchesVet && matchesFilters;
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
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-8">
          <div className="text-center text-vet-brown">Chargement du planning...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white backdrop-blur-sm border-vet-blue/20 shadow-lg">
      <CardContent className="p-0">
        <div className="overflow-hidden">
          {/* En-tête des colonnes - Sticky */}
          <div className="sticky top-0 z-20 bg-white border-b-2 border-vet-blue/30 shadow-sm">
            <div className="grid grid-cols-8 min-w-[1200px]">
              <div className="p-4 font-bold text-vet-navy text-center border-r border-vet-blue/20 bg-vet-beige/40">
                <Clock className="h-5 w-5 mx-auto mb-1 text-vet-sage" />
                <span className="text-sm">Horaires</span>
              </div>
              {weekDates.map((date, index) => {
                const today = isToday(date);
                const dayBookings = getBookingsForDateAndVet(date);
                return (
                  <div 
                    key={index} 
                    className={`p-3 text-center border-l border-vet-blue/20 transition-all duration-200 ${
                      today 
                        ? 'bg-vet-sage/20 border-l-4 border-l-vet-sage shadow-inner' 
                        : 'bg-vet-beige/20'
                    }`}
                  >
                    <div className={`font-bold ${today ? 'text-vet-sage' : 'text-vet-navy'}`}>
                      {date.toLocaleDateString('fr-FR', { weekday: 'long' })}
                    </div>
                    <div className="text-sm text-vet-brown font-medium mt-1">
                      {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                    </div>
                    <Badge 
                      variant={today ? "default" : "outline"} 
                      className={`mt-2 ${today ? 'bg-vet-sage text-white' : 'border-vet-blue/40'}`}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      {dayBookings.length} RDV
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grille horaire - Scrollable */}
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="min-w-[1200px]">
              {timeSlots.map((time, timeIndex) => {
                const isFullHour = time.endsWith(':00');
                const isAlternateRow = Math.floor(timeIndex / 2) % 2 === 0;
                
                return (
                  <div 
                    key={time} 
                    className={`grid grid-cols-8 border-b transition-colors ${
                      isFullHour ? 'border-vet-blue/30 min-h-[90px]' : 'border-vet-blue/10 min-h-[80px]'
                    } ${isAlternateRow ? 'bg-white' : 'bg-vet-beige/5'}`}
                  >
                    {/* Colonne horaire */}
                    <div className={`p-3 text-center border-r border-vet-blue/20 flex items-center justify-center ${
                      isFullHour ? 'bg-vet-beige/30 font-bold text-vet-navy' : 'bg-vet-beige/10 text-vet-brown'
                    }`}>
                      <span className={isFullHour ? 'text-base' : 'text-sm'}>{time}</span>
                    </div>
                    
                    {/* Colonnes par jour */}
                    {weekDates.map((date, dayIndex) => {
                      const today = isToday(date);
                      const dayBookings = getBookingsForDateAndVet(date);
                      const timeBookings = dayBookings.filter(booking => 
                        booking.appointment_time === time || 
                        (booking.appointment_time && booking.appointment_time.startsWith(time.split(':')[0]))
                      );

                      return (
                        <div
                          key={`${dayIndex}-${time}`}
                          className={`p-2 border-l relative group transition-all duration-200 ${
                            today ? 'border-l-vet-sage/30 bg-vet-sage/5' : 'border-l-vet-blue/10'
                          } hover:bg-vet-sage/10`}
                        >
                          {timeBookings.map((booking) => {
                            const hasCustomColor = booking.status === 'confirmed' && booking.consultation_type_color;
                            return (
                              <div
                                key={booking.id}
                                onClick={() => onAppointmentClick(booking)}
                                className={`mb-2 p-3 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] animate-fade-in ${
                                  getStatusColor(booking)
                                }`}
                                style={
                                  hasCustomColor
                                    ? {
                                        backgroundColor: `${booking.consultation_type_color}15`,
                                        borderLeftColor: booking.consultation_type_color,
                                        boxShadow: `0 2px 8px ${booking.consultation_type_color}20`
                                      }
                                    : {
                                        borderLeftColor: 'hsl(var(--vet-sage))'
                                      }
                                }
                              >
                                {/* En-tête de la carte */}
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-vet-sage flex-shrink-0" />
                                    <span className="text-xs font-bold text-vet-navy">
                                      {booking.appointment_time}
                                    </span>
                                  </div>
                                  <Badge 
                                    variant="secondary" 
                                    className="text-[10px] px-1.5 py-0 h-5"
                                  >
                                    {getAppointmentDuration(booking)}
                                  </Badge>
                                </div>

                                {/* Client */}
                                <div className="flex items-center gap-1.5 mb-1">
                                  <User className="h-3.5 w-3.5 text-vet-brown flex-shrink-0" />
                                  <span className="text-sm font-semibold text-vet-navy truncate">
                                    {booking.client_name}
                                  </span>
                                </div>

                                {/* Animal */}
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <Stethoscope className="h-3.5 w-3.5 text-vet-sage flex-shrink-0" />
                                  <span className="text-xs text-vet-brown truncate">
                                    {booking.animal_name} • {booking.animal_species}
                                  </span>
                                </div>

                                {/* Motif */}
                                <div className="text-xs text-vet-brown/80 truncate italic border-t border-vet-blue/10 pt-1.5 mt-1.5">
                                  {booking.consultation_reason}
                                </div>

                                {/* Badge statut si non confirmé */}
                                {booking.status !== 'confirmed' && (
                                  <Badge 
                                    variant="outline" 
                                    className="text-[10px] px-1.5 py-0 h-4 mt-2"
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
                              className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center bg-vet-sage/5 hover:bg-vet-sage/15 border-2 border-dashed border-transparent group-hover:border-vet-sage/30"
                              onClick={() => onCreateAppointment({
                                date: date.toISOString().split('T')[0],
                                time: time
                              })}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <Plus className="h-5 w-5 text-vet-sage" />
                                <span className="text-xs text-vet-sage font-medium">Ajouter</span>
                              </div>
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
        </div>
      </CardContent>
    </Card>
  );
};
