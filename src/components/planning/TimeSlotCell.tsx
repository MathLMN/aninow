import { Plus, Ban, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { TimeSlotContextMenu } from "./TimeSlotContextMenu";
import { formatDateLocal } from "@/utils/date";

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
  // Nouvelles props pour gérer l'affichage des blocages
  isFirstBlockedSlot?: boolean;
  blockedSlotsCount?: number;
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
  isVeterinarianAbsent = false,
  isFirstBlockedSlot = false,
  blockedSlotsCount = 1
}: TimeSlotCellProps) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string, isBlockedSlot: boolean = false) => {
    if (isBlockedSlot) {
      return 'bg-gray-400 text-gray-800 border-gray-500';
    }
    
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300 border-dashed';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Calculer la hauteur du rendez-vous en fonction de sa durée - ajustée pour la nouvelle hauteur
  const getAppointmentHeight = (booking: any) => {
    const duration = booking.duration_minutes || 15;
    // Chaque tranche de 15 minutes = 20px de hauteur (ajusté)
    const slotsNeeded = Math.ceil(duration / 15);
    return slotsNeeded * 20;
  };

  const handleCellClick = () => {
    if (bookings.length === 0 && isOpen && !isVeterinarianAbsent && !isBlocked) {
      onCreateAppointment({
        date: formatDateLocal(selectedDate),
        time: time,
        veterinarian: columnId !== 'asv' ? columnId : undefined
      });
    }
  };

  const handleCreateTask = () => {
    // Créer une tâche même sur les créneaux fermés
    onCreateAppointment({
      date: formatDateLocal(selectedDate),
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
        date: formatDateLocal(selectedDate),
        time: time,
        veterinarian: columnId
      });
    }
  };

  // Déterminer si le créneau est bloqué - améliorer la détection
  const isBlocked = bookings.some(booking => 
    booking.consultation_reason === 'Créneau bloqué' || 
    booking.is_blocked || 
    booking.client_name === 'CRÉNEAU BLOQUÉ' ||
    booking.recurring_block_id // Nouveau critère pour les blocages récurrents
  );

  // Récupérer les informations du blocage récurrent s'il y en a un
  const recurringBlock = bookings.find(booking => booking.recurring_block_id);

  // Styles pour les différents états
  const getCellBackground = () => {
    if (isVeterinarianAbsent) {
      return "bg-gray-300/80";
    }
    if (!isOpen) {
      return "bg-gray-300/80";
    }
    if (isBlocked) {
      return "bg-gray-400/60"; // Plus visible pour les blocages
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
          "h-5", // Hauteur harmonisée avec la grille
          getCellBackground(),
          canInteract && "cursor-pointer group hover:bg-blue-50/30",
          !canInteract && canCreateTask && "group hover:bg-yellow-50/30"
        )}
        onClick={handleCellClick}
        onMouseEnter={() => (canInteract || canCreateTask) && setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Affichage spécial pour les créneaux bloqués récurrents - hauteur ajustée */}
        {isBlocked && recurringBlock && isFirstBlockedSlot && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-gray-400/60 text-gray-800 text-[9px] font-medium z-10"
            style={{ 
              height: `${blockedSlotsCount * 20}px`,
              minHeight: '20px'
            }}
          >
            <div className="text-center px-1">
              <div className="truncate">BLOQUÉ</div>
              <div className="truncate text-[8px] opacity-80">
                {recurringBlock.recurring_block_title}
              </div>
            </div>
          </div>
        )}

        {/* Affichage des rendez-vous normaux - taille de police ajustée */}
        {bookings.filter(booking => !booking.is_blocked && !booking.recurring_block_id).map((booking) => (
          <div
            key={booking.id}
            onClick={(e) => {
              e.stopPropagation();
              onAppointmentClick(booking);
            }}
            className={cn(
              "absolute inset-x-0 top-0 p-1 rounded-sm border transition-shadow text-[9px] leading-tight cursor-pointer hover:shadow-sm",
              getStatusColor(booking.status, false)
            )}
            style={{ 
              height: `${getAppointmentHeight(booking)}px`,
              zIndex: 10
            }}
          >
            {/* Indicateur d'arrivée - Point rouge en haut à droite */}
            {booking.arrival_time && (
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white z-20" title={`Client arrivé à ${booking.arrival_time}`}></div>
            )}
            
            <div className="font-medium truncate text-[9px]">
              {booking.client_name}
            </div>
            <div className="truncate text-[8px] opacity-80">
              {booking.animal_name}
            </div>
            {booking.duration_minutes && booking.duration_minutes > 15 && (
              <div className="text-[7px] opacity-70 mt-1">
                {booking.duration_minutes} min
              </div>
            )}
            {booking.status === 'pending' && (
              <div className="text-[7px] opacity-70 font-medium">
                En attente
              </div>
            )}
          </div>
        ))}
        
        {/* Actions au survol pour créneaux ouverts - taille des icônes ajustée */}
        {bookings.length === 0 && canInteract && showActions && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50/40 transition-opacity z-20">
            <div className="flex items-center space-x-1">
              <button
                onClick={handleCellClick}
                className="p-0.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                title="Ajouter un rendez-vous"
              >
                <Plus className="h-2.5 w-2.5" />
              </button>
              {columnId !== 'asv' && (
                <button
                  onClick={handleQuickBlock}
                  className="p-0.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                  title="Bloquer ce créneau"
                >
                  <Ban className="h-2.5 w-2.5" />
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
              className="p-0.5 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
              title="Créer une tâche / note"
            >
              <FileText className="h-2.5 w-2.5" />
            </button>
          </div>
        )}
      </div>
    </TimeSlotContextMenu>
  );
};
