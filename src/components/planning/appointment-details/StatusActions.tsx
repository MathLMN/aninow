
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserX } from "lucide-react";

interface StatusActionsProps {
  appointment: any;
  onUpdateStatus: (appointmentId: string, status: string, notes?: string) => Promise<boolean>;
  onClose: () => void;
}

export const StatusActions = ({ appointment, onUpdateStatus, onClose }: StatusActionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState('');
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

  return (
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
              onClick={() => handleStatusUpdate('confirmed')}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Confirmer
            </Button>
          )}
          {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
            <Button
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={isUpdating}
              variant="destructive"
            >
              Annuler
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
    </div>
  );
};
