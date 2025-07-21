
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TimeSlotCell } from "./TimeSlotCell";
import { generateAllTimeSlots, isTimeSlotOpen, getBookingsForSlot, isFullHour } from "./utils/scheduleUtils";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { useState, useEffect } from "react";

interface DailyCalendarGridProps {
  selectedDate: Date;
  bookings: any[];
  columns: any[];
  daySchedule: any;
  onCreateAppointment: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onAppointmentClick: (appointment: any) => void;
  veterinarians: any[];
}

export const DailyCalendarGrid = ({
  selectedDate,
  bookings,
  columns,
  daySchedule,
  onCreateAppointment,
  onAppointmentClick,
  veterinarians
}: DailyCalendarGridProps) => {
  const { settings } = useClinicSettings();
  const timeSlots = generateAllTimeSlots();
  const [slotBookings, setSlotBookings] = useState<Record<string, any[]>>({});

  // Charger les réservations pour chaque créneau de manière asynchrone
  useEffect(() => {
    const loadSlotBookings = async () => {
      const newSlotBookings: Record<string, any[]> = {};
      
      for (const time of timeSlots) {
        for (const column of columns) {
          const key = `${time}-${column.id}`;
          const bookingsForSlot = await getBookingsForSlot(
            time, 
            column.id, 
            bookings, 
            selectedDate, 
            veterinarians,
            settings
          );
          newSlotBookings[key] = bookingsForSlot;
        }
      }
      
      setSlotBookings(newSlotBookings);
    };

    loadSlotBookings();
  }, [timeSlots, columns, bookings, selectedDate, veterinarians, settings]);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* En-tête des colonnes */}
            <div className={`grid border-b border-vet-blue/20 bg-vet-beige/30`} style={{gridTemplateColumns: `100px repeat(${columns.length}, 1fr)`}}>
              <div className="p-2 font-semibold text-vet-navy text-center border-r border-vet-blue/20 text-sm">
                Horaires
              </div>
              {columns.map((column) => {
                // Compter le total des RDV pour cette colonne pour toute la journée
                const totalBookings = timeSlots.reduce((total, time) => {
                  const key = `${time}-${column.id}`;
                  return total + (slotBookings[key]?.length || 0);
                }, 0);

                return (
                  <div key={column.id} className="p-2 text-center border-l border-vet-blue/20">
                    <div className="font-semibold text-sm text-vet-navy">
                      {column.title}
                    </div>
                    <div className="text-xs text-vet-brown mt-1">
                      {totalBookings} RDV
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grille horaire 8h-19h avec affichage de toutes les heures */}
            <div className="relative">
              {timeSlots.map((time, timeIndex) => {
                const isOpen = isTimeSlotOpen(time, daySchedule);
                const isHourMark = isFullHour(time);
                
                return (
                  <div 
                    key={time} 
                    className={cn(
                      `grid relative`,
                      // Hauteur identique pour tous les créneaux
                      "h-[30px]",
                      // Lignes épaisses sur les heures pleines, fines sur les 15 min intermédiaires
                      isHourMark 
                        ? "border-b-2 border-gray-400" 
                        : "border-b border-gray-200/50",
                      // Fond gris pour les heures fermées
                      !isOpen && "bg-gray-50/30"
                    )} 
                    style={{gridTemplateColumns: `100px repeat(${columns.length}, 1fr)`}}
                  >
                    {/* Colonne horaire - affichage de toutes les heures avec alignement parfait */}
                    <div className={cn(
                      "text-xs text-center font-medium border-r flex items-center justify-center px-1",
                      isOpen 
                        ? "bg-white text-gray-700 border-gray-300" 
                        : "bg-gray-100/80 text-gray-500 border-gray-200/30",
                      // Police et style pour une meilleure lisibilité
                      "text-[11px] font-medium leading-none"
                    )}>
                      {/* Afficher toutes les heures pour un alignement parfait */}
                      <span className="block">{time}</span>
                    </div>
                    
                    {/* Colonnes par vétérinaire et ASV */}
                    {columns.map((column) => {
                      const key = `${time}-${column.id}`;
                      const slotBookingsForCell = slotBookings[key] || [];
                      
                      return (
                        <TimeSlotCell
                          key={`${column.id}-${time}`}
                          time={time}
                          columnId={column.id}
                          bookings={slotBookingsForCell}
                          isOpen={isOpen}
                          canBook={true}
                          onCreateAppointment={onCreateAppointment}
                          onAppointmentClick={onAppointmentClick}
                          selectedDate={selectedDate}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
