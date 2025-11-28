
import React, { useState } from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Check, X, Copy, Scissors, Clipboard, Trash2, Clock, User, Calendar, Unlock } from "lucide-react";
import { formatDateLocal } from '@/utils/date';

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
  onUnblockRecurringForDay?: (blockId: string, date: string) => void;
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
  onUnblockRecurringForDay,
  hasBookings,
  hasClipboard = false
}: TimeSlotContextMenuProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<any>(null);

  const dateStr = formatDateLocal(selectedDate);
  const pendingBookings = bookings.filter(b => b.status === 'pending' && !b.is_blocked);
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' && !b.is_blocked);
  const blockedBookings = bookings.filter(b => b.is_blocked || b.recurring_block_id || b.booking_source === 'blocked');
  const recurringBlockedBooking = blockedBookings.find(b => b.recurring_block_id);
  
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

  const handleDeleteClick = (booking: any) => {
    setBookingToDelete(booking);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (bookingToDelete && onDeleteBooking) {
      onDeleteBooking(bookingToDelete.id);
    }
    setShowDeleteConfirm(false);
    setBookingToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setBookingToDelete(null);
  };

  return (
    <>
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
                    onClick={() => handleDeleteClick(booking)} 
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

          {/* Actions pour les créneaux bloqués */}
          {blockedBookings.length > 0 && (
            <>
              {recurringBlockedBooking && onUnblockRecurringForDay && (
                <ContextMenuItem
                  onClick={() => {
                    onUnblockRecurringForDay(
                      recurringBlockedBooking.recurring_block_id,
                      dateStr
                    );
                  }}
                  className="text-orange-600 flex items-center gap-2"
                >
                  <Unlock className="h-4 w-4" />
                  Débloquer ce jour uniquement
                </ContextMenuItem>
              )}
              <ContextMenuItem
                onClick={() => {
                  const booking = blockedBookings[0];
                  handleDeleteClick(booking);
                }}
                className="text-red-600 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer le blocage
              </ContextMenuItem>
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

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement ce rendez-vous ?
              {bookingToDelete && (
                <>
                  <br />
                  <strong>Client :</strong> {bookingToDelete.client_name}
                  <br />
                  <strong>Animal :</strong> {bookingToDelete.animal_name}
                  <br />
                  <strong>Date :</strong> {bookingToDelete.appointment_date} à {bookingToDelete.appointment_time}
                  <br />
                  <br />
                  Cette action est irréversible.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
