
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DailyCalendarGrid } from "./DailyCalendarGrid";
import { DailyCalendarHeader } from "./DailyCalendarHeader";
import { PendingBookingsNotification } from "./PendingBookingsNotification";
import { BlockSlotModal } from "./BlockSlotModal";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";

interface DailyCalendarViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  bookings: any[];
  veterinarians: any[];
  onCreateAppointment: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onAppointmentClick: (appointment: any) => void;
  // Nouvelles props pour les actions du planning
  onValidateBooking?: (bookingId: string) => void;
  onCancelBooking?: (bookingId: string) => void;
  onDuplicateBooking?: (booking: any) => void;
  onMoveBooking?: (booking: any) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onBlockSlot?: (timeSlot: { date: string; time: string; veterinarian: string }) => void;
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
  onBlockSlot
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

  const goToToday = () => {
    onDateChange(new Date());
  };

  const handleBlockSlot = (timeSlot: { date: string; time: string; veterinarian: string }) => {
    setBlockSlotData(timeSlot);
    setIsBlockModalOpen(true);
  };

  const handleCloseBlockModal = () => {
    setIsBlockModalOpen(false);
    setBlockSlotData(null);
  };

  // Créer les colonnes pour l'affichage
  const columns = [
    { id: 'asv', title: 'ASV' },
    ...veterinarians
      .filter(vet => vet.is_active)
      .map(vet => ({
        id: vet.id,
        title: vet.name
      }))
  ];

  // Configuration des horaires par défaut (sera remplacée par les données de la clinique)
  const daySchedule = {
    isOpen: true,
    openTime: "08:00",
    closeTime: "19:00"
  };

  const pendingBookings = bookings.filter(booking => booking.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Notification des RDV en attente */}
      {pendingBookings.length > 0 && (
        <PendingBookingsNotification 
          count={pendingBookings.length}
          onViewBookings={() => {
            // Logique pour afficher les RDV en attente
          }}
        />
      )}

      {/* Navigation quotidienne */}
      <Card className="bg-white/90 backdrop-blur-sm border-vet-blue/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDay('prev')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDay('next')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold text-vet-navy">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                </h2>
                <p className="text-sm text-vet-brown">
                  Ouvert {daySchedule.openTime} - {daySchedule.closeTime}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={goToToday}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Aujourd'hui
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* En-tête du planning */}
      <DailyCalendarHeader 
        selectedDate={selectedDate}
        bookings={bookings}
        columns={columns}
      />

      {/* Grille du planning */}
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
