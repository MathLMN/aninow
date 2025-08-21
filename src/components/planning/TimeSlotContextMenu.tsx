
import React from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";
import { Plus, Check, X, Copy, Scissors, Clipboard, Trash2, Clock, User, Calendar } from "lucide-react";

interface TimeSlotContextMenuProps {
  children: React.ReactNode;
  time: string;
  columnId: string;
  selectedDate: Date;
  bookings: any[];
  onCreateAppointment: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onValidateBooking?: (bookingId: string) => void;
  onCancelBooking?: (bookingId: string) => void;
  onCopyBooking?: (booking: any) => void;
  onCutBooking?: (booking: any) => void;
  onPasteBooking?: (timeSlot: { date: string; time: string; veterinarian?: string }) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onBlockSlot?: (timeSlot: { date: string; time: string; veterinarian: string }) => void;
  hasBookings: boolean;
  hasClipboard?: boolean;
}

export const TimeSlotContextMenu = ({
  children,
  time,
  columnId,
  selectedDate,
  bookings,
  onCreateAppointment,
  onValidateBooking,
  onCancelBooking,
  onCopyBooking,
  onCutBooking,
  onPasteBooking,
  onDeleteBooking,
  onBlockSlot,
  hasBookings,
  hasClipboard = false
}: TimeSlotContextMenuProps) => {
  const dateStr = selectedDate.toISOString().split('T')[0];
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  
  const handleCreateAppointment = () => {
    onCreateAppointment({
      date: dateStr,
      time: time,
      veterinarian: columnId !== 'asv' ? columnId : undefined
    });
  };

  const handleBlockSlot = () => {
    if (columnId !== 'asv' && onBlockSlot) {
      onBlockSlot({
        date: dateStr,
        time: time,
        veterinarian: columnId
      });
    }
  };

  const handlePasteBooking = () => {
    if (onPasteBooking) {
      onPasteBooking({
        date: dateStr,
        time: time,
        veterinarian: columnId !== 'asv' ? columnId : undefined
      });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {/* Actions de création */}
        {!hasBookings && (
          <>
            <ContextMenuItem onClick={handleCreateAppointment} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Créer un rendez-vous
            </ContextMenuItem>
            {hasClipboard && (
              <ContextMenuItem onClick={handlePasteBooking} className="flex items-center gap-2">
                <Clipboard className="h-4 w-4" />
                Coller le rendez-vous
              </ContextMenuItem>
            )}
            {columnId !== 'asv' && (
              <ContextMenuItem onClick={handleBlockSlot} className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Bloquer ce créneau
              </ContextMenuItem>
            )}
            <ContextMenuSeparator />
          </>
        )}

        {/* Actions pour les RDV en attente */}
        {pendingBookings.length > 0 && (
          <>
            {pendingBookings.map((booking) => (
              <div key={booking.id}>
                <ContextMenuItem 
                  onClick={() => onValidateBooking?.(booking.id)} 
                  className="flex items-center gap-2 text-green-600"
                >
                  <Check className="h-4 w-4" />
                  Valider - {booking.client_name}
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => onCancelBooking?.(booking.id)} 
                  className="flex items-center gap-2 text-red-600"
                >
                  <X className="h-4 w-4" />
                  Annuler - {booking.client_name}
                </ContextMenuItem>
              </div>
            ))}
            <ContextMenuSeparator />
          </>
        )}

        {/* Actions pour les RDV confirmés */}
        {confirmedBookings.length > 0 && (
          <>
            {confirmedBookings.map((booking) => (
              <div key={booking.id}>
                <ContextMenuItem 
                  onClick={() => onCopyBooking?.(booking)} 
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copier - {booking.client_name}
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => onCutBooking?.(booking)} 
                  className="flex items-center gap-2"
                >
                  <Scissors className="h-4 w-4" />
                  Couper - {booking.client_name}
                </ContextMenuItem>
                <ContextMenuItem 
                  onClick={() => onDeleteBooking?.(booking.id)} 
                  className="flex items-center gap-2 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer - {booking.client_name}
                </ContextMenuItem>
              </div>
            ))}
            <ContextMenuSeparator />
          </>
        )}

        {/* Informations contextuelles */}
        <div className="px-2 py-1 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            {selectedDate.toLocaleDateString('fr-FR')}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-3 w-3" />
            {time}
          </div>
          {columnId !== 'asv' && (
            <div className="flex items-center gap-2 mt-1">
              <User className="h-3 w-3" />
              Vétérinaire
            </div>
          )}
        </div>
      </ContextMenuContent>
    </ContextMenu>
  );
};
