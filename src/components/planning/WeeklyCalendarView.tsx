
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
    <div className="h-full bg-gradient-to-br from-vet-blue/5 via-white to-vet-sage/5 p-4 overflow-hidden flex flex-col">
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 shadow-lg flex-1 flex flex-col overflow-hidden">
        {/* En-tête avec navigation et filtres */}
        <CardHeader className="border-b border-vet-blue/20 bg-gradient-to-r from-vet-beige/30 to-vet-sage/10 space-y-4 flex-shrink-0">
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
          <div className="flex-shrink-0 sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b-2 border-vet-blue/30 shadow-sm">
            <div className="grid grid-cols-8 min-w-[1200px]">
              <div className="p-4 font-bold text-vet-navy text-center border-r border-vet-blue/20 bg-gradient-to-br from-vet-beige/40 to-vet-sage/20">
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
                        ? 'bg-gradient-to-br from-vet-sage/30 to-vet-sage/10 border-l-4 border-l-vet-sage' 
                        : 'bg-gradient-to-br from-vet-beige/20 to-white'
                    }`}
                  >
                    <div className={`font-bold capitalize ${today ? 'text-vet-sage' : 'text-vet-navy'}`}>
                      {date.toLocaleDateString('fr-FR', { weekday: 'long' })}
                    </div>
                    <div className="text-sm text-vet-brown font-medium mt-1">
                      {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                    </div>
                    <Badge 
                      variant={today ? "default" : "outline"} 
                      className={`mt-2 ${today ? 'bg-vet-sage text-white hover:bg-vet-sage/90' : 'border-vet-blue/40 bg-white'}`}
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
          <ScrollArea className="flex-1">
            <div className="min-w-[1200px]">
              {timeSlots.map((time, timeIndex) => {
                const isFullHour = time.endsWith(':00');
                const isAlternateRow = Math.floor(timeIndex / 2) % 2 === 0;
                
                return (
                  <div 
                    key={time} 
                    className={`grid grid-cols-8 border-b transition-colors ${
                      isFullHour ? 'border-vet-blue/30 min-h-[90px]' : 'border-vet-blue/10 min-h-[80px]'
                    } ${isAlternateRow ? 'bg-white' : 'bg-gradient-to-r from-vet-beige/5 to-transparent'}`}
                  >
                    {/* Colonne horaire */}
                    <div className={`p-3 text-center border-r border-vet-blue/20 flex items-center justify-center ${
                      isFullHour ? 'bg-gradient-to-br from-vet-beige/30 to-vet-sage/10 font-bold text-vet-navy' : 'bg-vet-beige/5 text-vet-brown'
                    }`}>
                      <span className={isFullHour ? 'text-base' : 'text-sm'}>{time}</span>
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
                          className={`p-2 border-l relative group transition-all duration-200 ${
                            today ? 'border-l-vet-sage/30 bg-gradient-to-br from-vet-sage/5 to-transparent' : 'border-l-vet-blue/10'
                          } hover:bg-gradient-to-br hover:from-vet-sage/10 hover:to-transparent`}
                        >
                          {timeBookings.map((booking) => {
                            const hasCustomColor = booking.status === 'confirmed' && booking.consultation_type_color;
                            return (
                              <div
                                key={booking.id}
                                onClick={() => onAppointmentClick(booking)}
                                className={`mb-2 p-3 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] animate-fade-in backdrop-blur-sm ${
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
                                        borderLeftColor: 'hsl(var(--vet-sage))',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
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

                                {/* Vétérinaire assigné (si mode "Tous") */}
                                {selectedVetId === 'all' && booking.veterinarian_id && (
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <Stethoscope className="h-3.5 w-3.5 text-vet-sage flex-shrink-0" />
                                    <span className="text-xs font-medium text-vet-sage truncate">
                                      {getVeterinarianName(booking.veterinarian_id)}
                                    </span>
                                  </div>
                                )}

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
                              className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center bg-gradient-to-br from-vet-sage/5 to-vet-sage/10 hover:from-vet-sage/15 hover:to-vet-sage/20 border-2 border-dashed border-transparent group-hover:border-vet-sage/30 rounded-lg"
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
        </CardContent>
      </Card>
    </div>
  );
};
