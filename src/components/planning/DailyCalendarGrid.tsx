
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TimeSlotCell } from "./TimeSlotCell";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocation } from "react-router-dom";

interface DailyCalendarGridProps {
  selectedDate: Date;
  bookings: any[];
  columns: Array<{ id: string; title: string }>;
  daySchedule: {
    isOpen: boolean;
    morning: { start: string; end: string };
    afternoon: { start: string; end: string };
  };
  onCreateAppointment: (timeSlot: {
    date: string;
    time: string;
    veterinarian?: string;
  }) => void;
  onAppointmentClick: (appointment: any) => void;
  veterinarians: any[];
  onValidateBooking?: (bookingId: string) => void;
  onCancelBooking?: (bookingId: string) => void;
  onDuplicateBooking?: (booking: any) => void;
  onMoveBooking?: (booking: any) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onBlockSlot?: (timeSlot: {
    date: string;
    time: string;
    veterinarian: string;
  }) => void;
  fixedHeaders?: boolean;
}

// Fonction utilitaire pour générer les créneaux horaires
const generateTimeSlots = (startTime: string, endTime: string) => {
  const slots = [];
  let currentTime = startTime;
  while (currentTime <= endTime) {
    slots.push(currentTime);
    const [hours, minutes] = currentTime.split(':').map(Number);
    let newMinutes = minutes + 30;
    let newHours = hours;
    if (newMinutes >= 60) {
      newHours += 1;
      newMinutes = newMinutes - 60;
    }
    currentTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    if (currentTime === '24:00') break;
  }
  return slots;
};

export const DailyCalendarGrid = ({
  selectedDate,
  bookings,
  columns,
  daySchedule,
  onCreateAppointment,
  onAppointmentClick,
  veterinarians,
  onValidateBooking,
  onCancelBooking,
  onDuplicateBooking,
  onMoveBooking,
  onDeleteBooking,
  onBlockSlot,
  fixedHeaders = false
}: DailyCalendarGridProps) => {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Désactiver les headers fixes sur la page /vet/planning
  const shouldUseFixedHeaders = fixedHeaders && !location.pathname.includes('/vet/planning');

  useEffect(() => {
    // Scroll to top on date change
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [selectedDate]);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30 h-full flex flex-col">
      <CardContent className="p-1 flex-1 min-h-0">
        <div className="h-full flex flex-col">
          {/* Header - toujours mobile sur /vet/planning */}
          <div className="border-b border-vet-blue/20">
            <div className="grid grid-cols-[60px_1fr] gap-0">
              <div className="h-6 bg-vet-blue/5 border-r border-vet-blue/20"></div>
              <div className={`grid grid-cols-${columns.length} gap-0`}>
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className="h-6 px-1 bg-vet-blue/5 border-r border-vet-blue/20 flex items-center justify-center"
                  >
                    <span className="text-[8px] font-medium text-vet-navy truncate">
                      {column.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu scrollable */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto"
          >
            <div className="min-h-full">
              {/* Matin */}
              {daySchedule.isOpen && (
                <div>
                  <div className="sticky left-0 bg-vet-sage/10 border-b border-vet-sage/30 py-0.5">
                    <span className="text-[7px] font-medium text-vet-brown px-2">
                      Matin ({daySchedule.morning.start} - {daySchedule.morning.end})
                    </span>
                  </div>
                  {generateTimeSlots(daySchedule.morning.start, daySchedule.morning.end).map((time) => (
                    <div key={`morning-${time}`} className="grid grid-cols-[60px_1fr] gap-0 border-b border-vet-blue/10">
                      <div className="h-4 bg-vet-blue/5 border-r border-vet-blue/20 flex items-center justify-center">
                        <span className="text-[7px] text-vet-brown">{time}</span>
                      </div>
                      <div className={`grid grid-cols-${columns.length} gap-0`}>
                        {columns.map((column) => (
                          <TimeSlotCell
                            key={`${time}-${column.id}`}
                            time={time}
                            columnId={column.id}
                            selectedDate={selectedDate}
                            bookings={bookings}
                            isOpen={daySchedule.isOpen}
                            canBook={true}
                            onCreateAppointment={onCreateAppointment}
                            onAppointmentClick={onAppointmentClick}
                            onValidateBooking={onValidateBooking}
                            onCancelBooking={onCancelBooking}
                            onDuplicateBooking={onDuplicateBooking}
                            onMoveBooking={onMoveBooking}
                            onDeleteBooking={onDeleteBooking}
                            onBlockSlot={onBlockSlot}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pause déjeuner */}
              <div className="bg-vet-brown/5 border-y border-vet-brown/20 py-0.5">
                <span className="text-[7px] font-medium text-vet-brown px-2">
                  Pause déjeuner (12h00 - 14h00)
                </span>
              </div>

              {/* Après-midi */}
              {daySchedule.isOpen && (
                <div>
                  <div className="sticky left-0 bg-vet-sage/10 border-b border-vet-sage/30 py-0.5">
                    <span className="text-[7px] font-medium text-vet-brown px-2">
                      Après-midi ({daySchedule.afternoon.start} - {daySchedule.afternoon.end})
                    </span>
                  </div>
                  {generateTimeSlots(daySchedule.afternoon.start, daySchedule.afternoon.end).map((time) => (
                    <div key={`afternoon-${time}`} className="grid grid-cols-[60px_1fr] gap-0 border-b border-vet-blue/10">
                      <div className="h-4 bg-vet-blue/5 border-r border-vet-blue/20 flex items-center justify-center">
                        <span className="text-[7px] text-vet-brown">{time}</span>
                      </div>
                      <div className={`grid grid-cols-${columns.length} gap-0`}>
                        {columns.map((column) => (
                          <TimeSlotCell
                            key={`${time}-${column.id}`}
                            time={time}
                            columnId={column.id}
                            selectedDate={selectedDate}
                            bookings={bookings}
                            isOpen={daySchedule.isOpen}
                            canBook={true}
                            onCreateAppointment={onCreateAppointment}
                            onAppointmentClick={onAppointmentClick}
                            onValidateBooking={onValidateBooking}
                            onCancelBooking={onCancelBooking}
                            onDuplicateBooking={onDuplicateBooking}
                            onMoveBooking={onMoveBooking}
                            onDeleteBooking={onDeleteBooking}
                            onBlockSlot={onBlockSlot}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
