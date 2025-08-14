
import { Plus, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { useToast } from "@/hooks/use-toast";
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
  const [isBlocking, setIsBlocking] = useState(false);
  const { blockTimeSlot } = useAvailableSlots();
  const { toast } = useToast();

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

  const handleQuickBlock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (columnId === 'asv' || isBlocking || isVeterinarianAbsent) return;

    setIsBlocking(true);
    
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      // Calculer l'heure de fin (30 minutes plus tard par défaut)
      const [hours, minutes] = time.split(':').map(Number);
      const endTime = new Date();
      endTime.setHours(hours, minutes + 30);
      const endTimeStr = endTime.toTimeString().slice(0, 5);

      const success = await blockTimeSlot(dateStr, time, endTimeStr, columnId);
      
      if (success) {
        toast({
          title: "Créneau bloqué",
          description: `Créneau de ${time} à ${endTimeStr} bloqué avec succès`,
        });
      }
    } catch (error) {
      console.error('Erreur lors du blocage rapide:', error);
      toast({
        title: "Erreur",
        description: "Impossible de bloquer le créneau",
        variant: "destructive"
      });
    } finally {
      setIsBlocking(false);
    }
  };

  // Déterminer si le créneau est bloqué (par un créneau de blocage)
  const isBlocked = bookings.some(booking => booking.consultation_reason === 'Créneau bloqué' || booking.is_blocked);

  // Styles pour les différents états
  const getCellBackground = () => {
    if (isVeterinarianAbsent) {
      return "bg-gray-300/80"; // Gris plus voyant pour les absences
    }
    if (!isOpen) {
      return "bg-gray-300/80"; // Gris plus voyant pour les heures fermées
    }
    if (isBlocked) {
      return "bg-gray-300/80"; // Gris plus voyant pour les créneaux bloqués
    }
    return ""; // Fond normal
  };

  const canInteract = isOpen && !isVeterinarianAbsent && !isBlocked;

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
          canInteract && "cursor-pointer group hover:bg-blue-50/30"
        )}
        onClick={handleCellClick}
        onMouseEnter={() => canInteract && setShowActions(true)}
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
        
        {/* Actions au survol - visibles uniquement au survol et si interaction possible */}
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
                  disabled={isBlocking}
                  className={cn(
                    "p-1 rounded-full text-white transition-colors",
                    isBlocking 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-red-600 hover:bg-red-700"
                  )}
                  title="Bloquer ce créneau (30 min)"
                >
                  <Ban className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </TimeSlotContextMenu>
  );
};
