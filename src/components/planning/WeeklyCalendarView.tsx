import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Plus } from "lucide-react";
import { formatDateLocal } from "@/utils/date";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  // Heures de consultation adaptées au mobile
  const timeSlots = [];
  const startHour = 7;
  const endHour = 21;
  const interval = isMobile ? 30 : 15; // 30min sur mobile, 15min sur desktop
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
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
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 w-full">
        <CardContent className="p-4 sm:p-8">
          <div className="text-center text-vet-brown text-sm sm:text-base">Chargement du planning...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 w-full h-full">
      <CardContent className="p-0 h-full">
        <div className="h-full w-full overflow-auto">
          <div className="min-w-full" style={{ minWidth: isMobile ? '800px' : 'auto' }}>
            {/* En-tête des colonnes - pleine largeur */}
            <div className="grid grid-cols-8 border-b border-vet-blue/20 bg-vet-beige/30 sticky top-0 z-10">
              <div className="p-2 sm:p-4 font-semibold text-vet-navy text-center text-xs sm:text-sm border-r border-vet-blue/20">
                {isMobile ? 'H.' : 'Horaires'}
              </div>
              {weekDates.map((date, index) => (
                <div key={index} className="p-2 sm:p-4 text-center border-l border-vet-blue/20 min-w-0">
                  <div className="font-semibold text-vet-navy text-xs sm:text-sm truncate">
                    {date.toLocaleDateString('fr-FR', { weekday: isMobile ? 'short' : 'short' })}
                  </div>
                  <div className="text-xs text-vet-brown truncate">
                    {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                  <div className="text-xs text-vet-brown mt-1">
                    {getBookingsForDateAndVet(date).length} RDV
                  </div>
                </div>
              ))}
            </div>

            {/* Grille horaire - pleine largeur */}
            <div className="relative">
              {timeSlots.map((time, timeIndex) => (
                <div key={time} className={`grid grid-cols-8 border-b border-vet-blue/10 min-h-[40px] sm:min-h-[60px] ${timeIndex % (isMobile ? 2 : 4) === 0 ? 'border-vet-blue/20' : ''}`}>
                  {/* Colonne horaire */}
                  <div className="p-1 sm:p-2 text-xs sm:text-sm text-vet-brown text-center font-medium bg-vet-beige/10 border-r border-vet-blue/20 flex items-center justify-center">
                    {time}
                  </div>
                  
                  {/* Colonnes par jour - répartition équitable */}
                  {weekDates.map((date, dayIndex) => {
                    const dayBookings = getBookingsForDateAndVet(date);
                    const timeBookings = dayBookings.filter(booking => 
                      booking.appointment_time === time
                    );

                    return (
                      <div
                        key={`${dayIndex}-${time}`}
                        className="p-1 border-l border-vet-blue/10 relative group hover:bg-vet-sage/5 transition-colors min-w-0 flex-1"
                      >
                        {timeBookings.map((booking, bookingIndex) => (
                          <div
                            key={booking.id}
                            onClick={() => onAppointmentClick(booking)}
                            className={`mb-1 p-1 sm:p-2 rounded-md border cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(booking.status)} min-w-0`}
                          >
                            <div className="text-xs font-medium truncate">
                              {booking.client_name}
                            </div>
                            <div className="text-xs truncate">
                              {booking.animal_name} - {booking.animal_species}
                            </div>
                            {!isMobile && (
                              <div className="text-xs opacity-75 truncate">
                                {booking.consultation_reason}
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {/* Bouton d'ajout au survol */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-vet-sage/10 hover:bg-vet-sage/20"
                          onClick={() => onCreateAppointment({
                            date: date.toISOString().split('T')[0],
                            time: time
                          })}
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-vet-sage" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
