
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useClinicSettings } from "@/hooks/useClinicSettings";

interface DailyCalendarViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  bookings: any[];
  veterinarians: any[];
  onCreateAppointment: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onAppointmentClick: (appointment: any) => void;
}

export const DailyCalendarView = ({
  selectedDate,
  onDateChange,
  bookings,
  veterinarians,
  onCreateAppointment,
  onAppointmentClick
}: DailyCalendarViewProps) => {
  const { settings } = useClinicSettings();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Générer les créneaux horaires (8h à 19h par 15min)
  const timeSlots = [];
  for (let hour = 8; hour < 19; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  // Créer les colonnes dynamiquement basées sur le nombre de vétérinaires
  const columns = [];
  
  // Ajouter les colonnes vétérinaires
  for (let i = 0; i < settings.veterinarian_count; i++) {
    const vet = veterinarians[i];
    columns.push({
      id: vet?.id || `vet-${i}`,
      title: vet?.name || `Vétérinaire ${i + 1}`,
      type: 'veterinarian'
    });
  }
  
  // Ajouter la colonne ASV si activée
  if (settings.asv_enabled) {
    columns.push({
      id: 'asv',
      title: 'ASV',
      type: 'asv'
    });
  }

  const getBookingsForSlot = (time: string, columnId: string) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return bookings.filter(booking => {
      const matchesDate = booking.appointment_date === dateStr;
      const matchesTime = booking.appointment_time === time;
      
      if (columnId === 'asv') {
        // Pour la colonne ASV, on peut définir une logique spécifique
        return matchesDate && matchesTime && booking.requires_asv;
      } else {
        return matchesDate && matchesTime && booking.veterinarian_id === columnId;
      }
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

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
    onDateChange(newDate);
  };

  return (
    <div className="space-y-4">
      {/* En-tête avec navigation et calendrier */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Navigation journalière */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDay('prev')}
                className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold text-vet-navy">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </h2>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDay('next')}
                className="border-vet-navy text-vet-navy hover:bg-vet-navy hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDateChange(new Date())}
                className="text-vet-blue hover:bg-vet-blue/10"
              >
                Aujourd'hui
              </Button>
            </div>

            {/* Calendrier mensuel */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="border-vet-blue text-vet-blue hover:bg-vet-blue/10"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Calendrier
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      onDateChange(date);
                      setIsCalendarOpen(false);
                    }
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Planning journalier */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* En-tête des colonnes */}
              <div className={`grid border-b border-vet-blue/20 bg-vet-beige/30`} style={{gridTemplateColumns: `120px repeat(${columns.length}, 1fr)`}}>
                <div className="p-4 font-semibold text-vet-navy text-center border-r border-vet-blue/20">
                  Horaires
                </div>
                {columns.map((column, index) => (
                  <div key={column.id} className="p-4 text-center border-l border-vet-blue/20">
                    <div className={`font-semibold ${column.type === 'asv' ? 'text-vet-sage' : 'text-vet-navy'}`}>
                      {column.title}
                    </div>
                    <div className="text-xs text-vet-brown mt-1">
                      {getBookingsForSlot('', column.id).length} RDV
                    </div>
                  </div>
                ))}
              </div>

              {/* Grille horaire */}
              <div className="relative">
                {timeSlots.map((time, timeIndex) => (
                  <div key={time} className={`grid border-b border-vet-blue/10 min-h-[50px] ${timeIndex % 4 === 0 ? 'border-vet-blue/20' : ''}`} style={{gridTemplateColumns: `120px repeat(${columns.length}, 1fr)`}}>
                    {/* Colonne horaire */}
                    <div className="p-2 text-sm text-vet-brown text-center font-medium bg-vet-beige/10 border-r border-vet-blue/20 flex items-center justify-center">
                      {time}
                    </div>
                    
                    {/* Colonnes par vétérinaire/ASV */}
                    {columns.map((column) => {
                      const slotBookings = getBookingsForSlot(time, column.id);
                      
                      return (
                        <div
                          key={`${column.id}-${time}`}
                          className="p-1 border-l border-vet-blue/10 relative group hover:bg-vet-sage/5 transition-colors cursor-pointer"
                          onClick={() => onCreateAppointment({
                            date: selectedDate.toISOString().split('T')[0],
                            time: time,
                            veterinarian: column.type === 'veterinarian' ? column.id : undefined
                          })}
                        >
                          {slotBookings.map((booking) => (
                            <div
                              key={booking.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAppointmentClick(booking);
                              }}
                              className={`mb-1 p-2 rounded-md border cursor-pointer hover:shadow-md transition-shadow text-xs ${getStatusColor(booking.status)}`}
                            >
                              <div className="font-medium truncate">
                                {booking.client_name}
                              </div>
                              <div className="truncate">
                                {booking.animal_name}
                              </div>
                            </div>
                          ))}
                          
                          {/* Bouton d'ajout au survol */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-vet-sage/10 hover:bg-vet-sage/20">
                            <Plus className="h-4 w-4 text-vet-sage" />
                          </div>
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
    </div>
  );
};
