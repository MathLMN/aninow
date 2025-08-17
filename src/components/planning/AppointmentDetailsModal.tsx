
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppointmentInfo } from "./appointment-details/AppointmentInfo";
import { AnimalInfo } from "./appointment-details/AnimalInfo";
import { ConsultationInfo } from "./appointment-details/ConsultationInfo";
import { StatusActions } from "./appointment-details/StatusActions";

interface AppointmentDetailsModalProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (appointmentId: string, status: string, notes?: string) => Promise<boolean>;
}

export const AppointmentDetailsModal = ({
  appointment,
  isOpen,
  onClose,
  onUpdateStatus
}: AppointmentDetailsModalProps) => {
  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-vet-navy">
            Détails du rendez-vous
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur le rendez-vous et gestion du statut
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne gauche */}
          <div className="space-y-6">
            <AppointmentInfo appointment={appointment} />
            <AnimalInfo appointment={appointment} />
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">
            <ConsultationInfo appointment={appointment} />
            <StatusActions 
              appointment={appointment}
              onUpdateStatus={onUpdateStatus}
              onClose={onClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
