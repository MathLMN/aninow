
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
  onCopyBooking?: (booking: any) => void;
  onCutBooking?: (booking: any) => void;
  onPasteBooking?: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onDeleteBooking?: (bookingId: string) => void;
  // Nouvelle prop pour indiquer si le vétérinaire est absent
  isVeterinarianAbsent?: boolean;
  // Nouvelles props pour gérer l'affichage des blocages
  isFirstBlockedSlot?: boolean;
  blockedSlotsCount?: number;
  // Nouvelles props pour les types de consultation
  consultationTypes?: any[];
  hasClipboard?: boolean;
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
  onCopyBooking,
  onCutBooking,
  onPasteBooking,
  onDeleteBooking,
  onBlockSlot,
  isVeterinarianAbsent = false,
  isFirstBlockedSlot = false,
  blockedSlotsCount = 1,
  consultationTypes = [],
  hasClipboard = false
}: TimeSlotCellProps) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (booking: any) => {
    // Gérer les blocages
    if (booking.is_blocked || booking.recurring_block_id || booking.booking_source === 'blocked') {
      return 'bg-gray-400 text-gray-800 border-gray-500';
    }

    // Couleur basée sur le type de consultation
    if (booking.consultation_type_id && consultationTypes.length > 0) {
      const consultationType = consultationTypes.find(ct => ct.id === booking.consultation_type_id);
      if (consultationType?.color) {
        return `border-2 text-white` + ' ' + getBgColorClass(consultationType.color);
      }
    }
    
    // Couleurs par défaut basées sur le statut - amélioration pour les rendez-vous en attente
    switch (booking.status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-500 border-2 border-dashed shadow-sm';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getBgColorClass = (color: string) => {
    // Convertir la couleur hex en classe Tailwind appropriée
    const colorMap: Record<string, string> = {
      '#3B82F6': 'bg-blue-500',
      '#10B981': 'bg-green-500',
      '#F59E0B': 'bg-yellow-500',
      '#EF4444': 'bg-red-500',
      '#8B5CF6': 'bg-purple-500',
      '#F97316': 'bg-orange-500',
      '#06B6D4': 'bg-cyan-500',
      '#84CC16': 'bg-lime-500',
    };
    return colorMap[color] || 'bg-blue-500';
  };

  // Calculer la hauteur du rendez-vous en fonction de sa durée
  const getAppointmentHeight = (booking: any) => {
    const duration = booking.duration_minutes || 15;
    // Chaque tranche de 15 minutes = 20px de hauteur
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

  // Déterminer si le créneau est bloqué
  const isBlocked = bookings.some(booking => 
    booking.consultation_reason === 'Créneau bloqué' || 
    booking.is_blocked || 
    booking.client_name === 'CRÉNEAU BLOQUÉ' ||
    booking.recurring_block_id ||
    booking.booking_source === 'blocked'
  );

  // Récupérer les informations du blocage
  const blockingBooking = bookings.find(booking => 
    booking.is_blocked || 
    booking.recurring_block_id ||
    booking.booking_source === 'blocked'
  );

  // Styles pour les différents états
  const getCellBackground = () => {
    if (isVeterinarianAbsent) {
      return "bg-gray-300/80";
    }
    if (!isOpen) {
      return "bg-gray-300/80";
    }
    if (isBlocked && !isFirstBlockedSlot) {
      return "bg-gray-400/60"; // Pour les créneaux bloqués non-premiers
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
      onCopyBooking={onCopyBooking}
      onCutBooking={onCutBooking}
      onPasteBooking={onPasteBooking}
      onDeleteBooking={onDeleteBooking}
      onBlockSlot={onBlockSlot}
      hasBookings={bookings.length > 0}
      hasClipboard={hasClipboard}
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
        {/* Affichage spécial pour les créneaux bloqués */}
        {isBlocked && isFirstBlockedSlot && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-gray-400/60 text-gray-800 text-[9px] font-medium z-10"
            style={{ 
              height: `${blockedSlotsCount * 20}px`,
              minHeight: '20px'
            }}
          >
            <div className="text-center px-1">
              <div className="truncate font-semibold">BLOQUÉ</div>
              {blockingBooking?.recurring_block_title && (
                <div className="truncate text-[8px] opacity-80">
                  {blockingBooking.recurring_block_title}
                </div>
              )}
              {blockingBooking?.consultation_reason && blockingBooking.consultation_reason !== 'Créneau bloqué' && (
                <div className="truncate text-[8px] opacity-80">
                  {blockingBooking.consultation_reason}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Affichage des rendez-vous normaux */}
        {bookings.filter(booking => 
          !booking.is_blocked && 
          !booking.recurring_block_id && 
          booking.booking_source !== 'blocked'
        ).map((booking) => (
          <div
            key={booking.id}
            onClick={(e) => {
              e.stopPropagation();
              onAppointmentClick(booking);
            }}
            className={cn(
              "absolute inset-x-0 top-0 p-0.5 rounded-sm border transition-shadow text-[9px] leading-tight cursor-pointer hover:shadow-sm overflow-hidden",
              getStatusColor(booking)
            )}
            style={{ 
              height: `${getAppointmentHeight(booking)}px`,
              zIndex: 10
            }}
          >
            {/* Indicateur d'arrivée - Point rouge positionné à l'intérieur du cadre */}
            {booking.arrival_time && (
              <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white shadow-sm z-20" title={`Client arrivé à ${booking.arrival_time}`}></div>
            )}
            
            {/* Affichage optimisé pour les rendez-vous en attente */}
            {booking.status === 'pending' ? (
              <div className="h-full flex flex-col justify-center overflow-hidden">
                <div className="font-semibold truncate text-[8px] leading-tight">
                  {booking.client_name}
                </div>
                <div className="truncate text-[7px] opacity-90 leading-tight">
                  {booking.animal_name}
                </div>
                <div className="text-[6px] opacity-70 font-medium text-center mt-0.5">
                  À VALIDER
                </div>
              </div>
            ) : (
              <>
                {/* 1. Nom complet du client */}
                <div className="font-medium truncate text-[9px]">
                  {booking.client_name}
                </div>
                
                {/* 2. Nom de l'animal */}
                <div className="truncate text-[8px] opacity-90 font-medium">
                  {booking.animal_name}
                </div>
                
                {/* 3. Motif du RDV */}
                <div className="truncate text-[8px] opacity-80">
                  {booking.consultation_reason}
                </div>
                
                {/* 4. Durée du RDV */}
                {booking.duration_minutes && (
                  <div className="text-[7px] opacity-70 mt-0.5 font-medium">
                    {booking.duration_minutes} min
                  </div>
                )}
              </>
            )}
            
            {/* Indicateur de source de réservation */}
            <div className="text-[6px] opacity-60 absolute bottom-0 right-0">
              {booking.booking_source === 'online' ? '🌐' : 
               booking.booking_source === 'manual' ? '✏️' : ''}
            </div>
          </div>
        ))}
        
        {/* Actions au survol pour créneaux ouverts */}
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
