import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DailyCalendarGrid } from "./DailyCalendarGrid";
import { BlockSlotModal } from "./BlockSlotModal";
import { EnhancedDateNavigation } from "./EnhancedDateNavigation";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";

interface DailyCalendarViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  bookings: any[];
  veterinarians: any[];
  onCreateAppointment: (timeSlot: {
    date: string;
    time: string;
    veterinarian?: string;
  }) => void;
  onAppointmentClick: (appointment: any) => void;
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
  sidebarMode?: boolean;
  mainViewMode?: boolean;
}

export const DailyCalendarView = ({
  selectedDate,
  onDateChange,
  bookings,
  veterinarians,
  onCreateAppointment,
  onAppointmentClick,
  onValidateBooking,
  onCancelBooking,
  onDuplicateBooking,
  onMoveBooking,
  onDeleteBooking,
  onBlockSlot,
  sidebarMode = false,
  mainViewMode = false
}: DailyCalendarViewProps) => {
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockSlotData, setBlockSlotData] = useState<{
    date: string;
    time: string;
    veterinarian: string;
  } | null>(null);
  
  const { veterinarians: allVeterinarians } = useClinicVeterinarians();

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
    onDateChange(newDate);
  };

  const handleBlockSlot = (timeSlot: {
    date: string;
    time: string;
    veterinarian: string;
  }) => {
    setBlockSlotData(timeSlot);
    setIsBlockModalOpen(true);
  };

  const handleCloseBlockModal = () => {
    setIsBlockModalOpen(false);
    setBlockSlotData(null);
  };

  const columns = [{
    id: 'asv',
    title: 'ASV'
  }, ...veterinarians.filter(vet => vet.is_active).map(vet => ({
    id: vet.id,
    title: vet.name
  }))];

  const daySchedule = {
    isOpen: true,
    morning: {
      start: "08:00",
      end: "12:00"
    },
    afternoon: {
      start: "14:00",
      end: "19:00"
    }
  };

  // Si c'est le mode sidebar, afficher seulement le calendrier
  if (sidebarMode) {
    return (
      <div className="space-y-3">
        <EnhancedDateNavigation 
          selectedDate={selectedDate} 
          onDateChange={onDateChange}
          compact={true}
        />
      </div>
    );
  }

  // Si c'est le mode vue principale, afficher la grille pleine largeur
  if (mainViewMode) {
    return (
      <div className="h-full w-full flex flex-col">
        {/* Grille du planning - pleine largeur et hauteur */}
        <DailyCalendarGrid 
          selectedDate={selectedDate} 
          bookings={bookings} 
          columns={columns} 
          daySchedule={daySchedule} 
          onCreateAppointment={onCreateAppointment} 
          onAppointmentClick={onAppointmentClick} 
          veterinarians={veterinarians} 
          onValidateBooking={onValidateBooking} 
          onCancelBooking={onCancelBooking} 
          onDuplicateBooking={onDuplicateBooking} 
          onMoveBooking={onMoveBooking} 
          onDeleteBooking={onDeleteBooking} 
          onBlockSlot={handleBlockSlot}
          fixedHeaders={true}
        />

        {/* Modale de blocage de créneau */}
        {blockSlotData && (
          <BlockSlotModal
            isOpen={isBlockModalOpen}
            onClose={handleCloseBlockModal}
            defaultDate={blockSlotData.date}
            defaultTime={blockSlotData.time}
            defaultVeterinarian={blockSlotData.veterinarian}
            veterinarians={allVeterinarians || []}
          />
        )}
      </div>
    );
  }

  // Mode par défaut (compatibilité) - pleine largeur
  return (
    <div className="w-full space-y-4">
      {/* Navigation quotidienne - pleine largeur */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <h2 className="text-lg sm:text-xl font-semibold text-vet-navy">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </h2>
                <p className="text-xs sm:text-sm text-vet-brown">
                  Ouvert 8h-12h / 14h-19h
                </p>
              </div>
            </div>

            <EnhancedDateNavigation selectedDate={selectedDate} onDateChange={onDateChange} />
          </div>
        </CardContent>
      </Card>

      {/* Grille du planning - pleine largeur */}
      <DailyCalendarGrid 
        selectedDate={selectedDate} 
        bookings={bookings} 
        columns={columns} 
        daySchedule={daySchedule} 
        onCreateAppointment={onCreateAppointment} 
        onAppointmentClick={onAppointmentClick} 
        veterinarians={veterinarians} 
        onValidateBooking={onValidateBooking} 
        onCancelBooking={onCancelBooking} 
        onDuplicateBooking={onDuplicateBooking} 
        onMoveBooking={onMoveBooking} 
        onDeleteBooking={onDeleteBooking} 
        onBlockSlot={handleBlockSlot} 
      />

      {/* Modale de blocage de créneau */}
      {blockSlotData && (
        <BlockSlotModal
          isOpen={isBlockModalOpen}
          onClose={handleCloseBlockModal}
          defaultDate={blockSlotData.date}
          defaultTime={blockSlotData.time}
          defaultVeterinarian={blockSlotData.veterinarian}
          veterinarians={allVeterinarians || []}
        />
      )}
    </div>
  );
};
