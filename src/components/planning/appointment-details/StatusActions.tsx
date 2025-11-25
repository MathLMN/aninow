
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserX, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface StatusActionsProps {
  appointment: any;
  onUpdateStatus: (appointmentId: string, status: string, notes?: string) => Promise<boolean>;
  onDeleteBooking: (bookingId: string) => Promise<boolean>;
  onClose: () => void;
}

export const StatusActions = ({ appointment, onUpdateStatus, onDeleteBooking, onClose }: StatusActionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    
    try {
      const success = await onUpdateStatus(appointment.id, newStatus, notes);
      if (success) {
        toast({
          title: "Statut mis à jour",
          description: `Le rendez-vous a été marqué comme ${getStatusLabel(newStatus)}`,
        });
        onClose();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le statut",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'en attente';
      case 'confirmed': return 'confirmé';
      case 'cancelled': return 'annulé';
      case 'completed': return 'terminé';
      case 'no-show': return 'absent';
      default: return status;
    }
  };

  const isAppointmentPassed = () => {
    if (!appointment.appointment_date || !appointment.appointment_time) return false;
    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    return appointmentDateTime < new Date();
  };

  const canMarkNoShow = () => {
    return isAppointmentPassed() && 
           (appointment.status === 'confirmed' || appointment.status === 'pending');
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsUpdating(true);
    try {
      const success = await onDeleteBooking(appointment.id);
      if (success) {
        onClose();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmConfirmation = async () => {
    setShowConfirmDialog(false);
    await handleStatusUpdate('confirmed');
  };

  const handleCancelConfirmation = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
    <div className="space-y-4">
      <div className="space-y-3">
        <Label htmlFor="notes">Notes (optionnel)</Label>
        <Textarea
          id="notes"
          placeholder="Ajouter des notes sur ce rendez-vous..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-vet-navy">Actions disponibles</h4>
        <div className="flex flex-wrap gap-2">
          {appointment.status !== 'confirmed' && (
            <Button
              onClick={handleConfirmClick}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Confirmer
            </Button>
          )}
          {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
            <Button
              onClick={handleDeleteClick}
              disabled={isUpdating}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Annuler le RDV
            </Button>
          )}
          {canMarkNoShow() && (
            <Button
              onClick={() => handleStatusUpdate('no-show')}
              disabled={isUpdating}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <UserX className="h-4 w-4 mr-2" />
              Marquer absent
            </Button>
          )}
          {appointment.status === 'cancelled' && (
            <Button
              onClick={() => handleStatusUpdate('pending')}
              disabled={isUpdating}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Remettre en attente
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose} disabled={isUpdating}>
          Fermer
        </Button>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement ce rendez-vous ? 
              Cette action est irréversible et le rendez-vous sera supprimé du planning.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete} disabled={isUpdating}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={isUpdating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer le rendez-vous</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmez-vous ce rendez-vous en ligne ? Un email de confirmation sera automatiquement envoyé au client.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelConfirmation} disabled={isUpdating}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmConfirmation}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Valider la confirmation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </>
  );
};
