
import { Plus, Ban, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { TimeSlotContextMenu } from "./TimeSlotContextMenu";

interface TimeSlotCellProps {
  time: string;
  columnId: string;
  bookings: any[];
  isOpen: boolean;
  canBook: boolean;
  onCreateAppointment: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onAppointmentClick: (appointment: any) => void;
  onBlockSlot?: (timeSlot: { date: string; time: string; veterinarian: string }) => void;
  selectedDate: Date;
  // Nouvelles props pour les actions du menu contextuel
  onValidateBooking?: (bookingId: string) => void;
  onCancelBooking?: (bookingId: string) => void;
  onDuplicateBooking?: (booking: any) => void;
  onMoveBooking?: (booking: any) => void;
  onDeleteBooking?: (bookingId: string) => void;
  // Nouvelle prop pour indiquer si le vétérinaire est absent
  isVeterinarianAbsent?: boolean;
}

export const TimeSlotCell = ({
  time,
  columnId,
  bookings,
  isOpen,
  canBook,
  onCreateAppointment,
  onAppointmentClick,
  selectedDate,
  onValidateBooking,
  onCancelBooking,
  onDuplicateBooking,
  onMoveBooking,
  onDeleteBooking,
  onBlockSlot,
  isVeterinarianAbsent = false
}: TimeSlotCellProps) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300 border-dashed';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Calculer la hauteur du rendez-vous en fonction de sa durée
  const getAppointmentHeight = (booking: any) => {
    const duration = booking.duration_minutes || 15;
    // Chaque tranche de 15 minutes = 30px de hauteur
    const slotsNeeded = Math.ceil(duration / 15);
    return slotsNeeded * 30;
  };

  const handleCellClick = () => {
    if (bookings.length === 0 && isOpen && !isVeterinarianAbsent) {
      onCreateAppointment({
        date: selectedDate.toISOString().split('T')[0],
        time: time,
        veterinarian: columnId !== 'asv' ? columnId : undefined
      });
    }
  };

  const handleCreateTask = () => {
    // Créer une tâche même sur les créneaux fermés
    onCreateAppointment({
      date: selectedDate.toISOString().split('T')[0],
      time: time,
      veterinarian: columnId !== 'asv' ? columnId : undefined
    });
  };

  const handleQuickBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (columnId === 'asv' || isVeterinarianAbsent) return;

    // Appeler directement la fonction onBlockSlot pour ouvrir la modale
    if (onBlockSlot) {
      onBlockSlot({
        date: selectedDate.toISOString().split('T')[0],
        time: time,
        veterinarian: columnId
      });
    }
  };

  // Déterminer si le créneau est bloqué (par un créneau de blocage)
  const isBlocked = bookings.some(booking => booking.consultation_reason === 'Créneau bloqué' || booking.is_blocked);

  // Styles pour les différents états
  const getCellBackground = () => {
    if (isVeterinarianAbsent) {
      return "bg-gray-300/80";
    }
    if (!isOpen) {
      return "bg-gray-300/80";
    }
    if (isBlocked) {
      return "bg-gray-300/80";
    }
    return "";
  };

  const canInteract = isOpen && !isVeterinarianAbsent && !isBlocked;
  const canCreateTask = !isVeterinarianAbsent && !isBlocked;

  return (
    <TimeSlotContextMenu
      time={time}
      columnId={columnId}
      selectedDate={selectedDate}
      bookings={bookings}
      onCreateAppointment={onCreateAppointment}
      onValidateBooking={onValidateBooking}
      onCancelBooking={onCancelBooking}
      onDuplicateBooking={onDuplicateBooking}
      onMoveBooking={onMoveBooking}
      onDeleteBooking={onDeleteBooking}
      onBlockSlot={onBlockSlot}
      hasBookings={bookings.length > 0}
    >
      <div
        className={cn(
          "border-l border-gray-200/30 relative transition-colors",
          "h-[30px]",
          getCellBackground(),
          canInteract && "cursor-pointer group hover:bg-blue-50/30",
          !canInteract && canCreateTask && "group hover:bg-yellow-50/30"
        )}
        onClick={handleCellClick}
        onMouseEnter={() => (canInteract || canCreateTask) && setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {bookings.map((booking) => (
          <div
            key={booking.id}
            onClick={(e) => {
              e.stopPropagation();
              onAppointmentClick(booking);
            }}
            className={cn(
              "absolute inset-x-0 top-0 p-1 rounded-sm border cursor-pointer hover:shadow-sm transition-shadow text-[10px] leading-tight",
              getStatusColor(booking.status)
            )}
            style={{ 
              height: `${getAppointmentHeight(booking)}px`,
              zIndex: 10
            }}
          >
            <div className="font-medium truncate text-[10px]">
              {booking.client_name}
            </div>
            <div className="truncate text-[9px] opacity-80">
              {booking.animal_name}
            </div>
            {booking.duration_minutes && booking.duration_minutes > 15 && (
              <div className="text-[8px] opacity-70 mt-1">
                {booking.duration_minutes} min
              </div>
            )}
            {booking.status === 'pending' && (
              <div className="text-[8px] opacity-70 font-medium">
                En attente
              </div>
            )}
          </div>
        ))}
        
        {/* Actions au survol pour créneaux ouverts */}
        {bookings.length === 0 && canInteract && showActions && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50/40 transition-opacity z-20">
            <div className="flex items-center space-x-1">
              <button
                onClick={handleCellClick}
                className="p-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                title="Ajouter un rendez-vous"
              >
                <Plus className="h-3 w-3" />
              </button>
              {columnId !== 'asv' && (
                <button
                  onClick={handleQuickBlock}
                  className="p-1 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                  title="Bloquer ce créneau"
                >
                  <Ban className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Actions au survol pour créneaux fermés - création de tâches */}
        {bookings.length === 0 && !canInteract && canCreateTask && showActions && (
          <div className="absolute inset-0 flex items-center justify-center bg-yellow-50/40 transition-opacity z-20">
            <button
              onClick={handleCreateTask}
              className="p-1 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
              title="Créer une tâche / note"
            >
              <FileText className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </TimeSlotContextMenu>
  );
};
