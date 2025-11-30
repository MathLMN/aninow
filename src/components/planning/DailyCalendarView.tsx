
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
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { useVeterinarianSchedules } from "@/hooks/useVeterinarianSchedules";
import { useVeterinarianAbsences } from "@/hooks/useVeterinarianAbsences";
import { generateColumns } from "./utils/scheduleUtils";
import type { ZoomLevel } from "@/pages/vet/VetPlanning";

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
  onCreateNote?: (timeSlot: {
    date: string;
    time: string;
    veterinarian?: string;
  }) => void;
  onAppointmentClick: (appointment: any) => void;
  onBlockedSlotClick?: (booking: any) => void;
  onValidateBooking?: (bookingId: string) => void;
  onCancelBooking?: (bookingId: string) => void;
  onCopyBooking?: (booking: any) => void;
  onCutBooking?: (booking: any) => void;
  onPasteBooking?: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onBlockSlot?: (timeSlot: {
    date: string;
    time: string;
    veterinarian: string;
  }) => void;
  onUnblockRecurringSlot?: (blockId: string, date: string) => void;
  hasClipboard?: boolean;
  sidebarMode?: boolean;
  mainViewMode?: boolean;
  zoomLevel?: ZoomLevel;
}

export const DailyCalendarView = ({
  selectedDate,
  onDateChange,
  bookings,
  veterinarians,
  onCreateAppointment,
  onCreateNote,
  onAppointmentClick,
  onBlockedSlotClick,
  onValidateBooking,
  onCancelBooking,
  onCopyBooking,
  onCutBooking,
  onPasteBooking,
  onDeleteBooking,
  onBlockSlot,
  onUnblockRecurringSlot,
  hasClipboard = false,
  sidebarMode = false,
  mainViewMode = false,
  zoomLevel = 'normal'
}: DailyCalendarViewProps) => {
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockSlotData, setBlockSlotData] = useState<{
    date: string;
    time: string;
    veterinarian: string;
  } | null>(null);
  
  const { veterinarians: allVeterinarians } = useClinicVeterinarians();
  const { settings } = useClinicSettings();
  const { schedules } = useVeterinarianSchedules();
  const { absences } = useVeterinarianAbsences();

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

  // Créer les colonnes pour l'affichage en utilisant l'ordre personnalisé
  const columns = generateColumns(veterinarians, settings, selectedDate, absences, schedules);

  // Configuration des horaires simplifiée - horaires ouverts de 8h à 19h
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
      <div className="space-y-4">
        <EnhancedDateNavigation 
          selectedDate={selectedDate} 
          onDateChange={onDateChange}
          compact={true}
        />
      </div>
    );
  }

  // Si c'est le mode vue principale, afficher seulement la grille
  if (mainViewMode) {
    return (
      <div className="h-full flex flex-col">
        {/* Grille du planning avec headers fixes */}
        <DailyCalendarGrid 
          selectedDate={selectedDate} 
          bookings={bookings} 
          columns={columns} 
          daySchedule={daySchedule} 
          onCreateAppointment={onCreateAppointment}
          onCreateNote={onCreateNote}
          onAppointmentClick={onAppointmentClick}
          onBlockedSlotClick={onBlockedSlotClick}
          veterinarians={veterinarians} 
          onValidateBooking={onValidateBooking} 
          onCancelBooking={onCancelBooking} 
          onCopyBooking={onCopyBooking}
          onCutBooking={onCutBooking}
          onPasteBooking={onPasteBooking}
          onDeleteBooking={onDeleteBooking} 
          onBlockSlot={handleBlockSlot}
          onUnblockRecurringSlot={onUnblockRecurringSlot}
          hasClipboard={hasClipboard}
          fixedHeaders={true}
          zoomLevel={zoomLevel}
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

  // Mode par défaut (compatibilité)
  return (
    <div className="space-y-6">
      {/* Navigation quotidienne */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-vet-navy">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </h2>
                <p className="text-sm text-vet-brown">
                  Ouvert 8h-12h / 14h-19h
                </p>
              </div>
            </div>

            <EnhancedDateNavigation selectedDate={selectedDate} onDateChange={onDateChange} />
          </div>
        </CardContent>
      </Card>

      {/* Grille du planning */}
      <DailyCalendarGrid 
        selectedDate={selectedDate} 
        bookings={bookings} 
        columns={columns} 
        daySchedule={daySchedule} 
        onCreateAppointment={onCreateAppointment}
        onCreateNote={onCreateNote}
        onAppointmentClick={onAppointmentClick}
        onBlockedSlotClick={onBlockedSlotClick}
        veterinarians={veterinarians} 
        onValidateBooking={onValidateBooking} 
        onCancelBooking={onCancelBooking} 
        onCopyBooking={onCopyBooking}
        onCutBooking={onCutBooking}
        onPasteBooking={onPasteBooking}
        onDeleteBooking={onDeleteBooking} 
        onBlockSlot={handleBlockSlot}
        onUnblockRecurringSlot={onUnblockRecurringSlot}
        hasClipboard={hasClipboard}
        zoomLevel={zoomLevel}
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
