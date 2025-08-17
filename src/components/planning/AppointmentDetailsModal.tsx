
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppointmentInfo } from "./appointment-details/AppointmentInfo";
import { AnimalInfo } from "./appointment-details/AnimalInfo";
import { ConsultationInfo } from "./appointment-details/ConsultationInfo";
import { StatusActions } from "./appointment-details/StatusActions";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        ${isMobile 
          ? 'w-[95vw] h-[95vh] max-w-none max-h-none m-2 p-0 rounded-lg' 
          : 'max-w-5xl w-[95vw] max-h-[90vh] p-0'
        } 
        overflow-hidden flex flex-col
      `}>
        <DialogHeader className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b flex-shrink-0">
          <DialogTitle className="text-base sm:text-lg lg:text-xl text-vet-navy">
            Détails du rendez-vous
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-vet-brown">
            Informations complètes sur le rendez-vous et gestion du statut
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className={`
            grid gap-4 sm:gap-6
            ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}
          `}>
            {/* Colonne gauche */}
            <div className="space-y-4 sm:space-y-6">
              <AppointmentInfo appointment={appointment} />
              <AnimalInfo appointment={appointment} />
            </div>

            {/* Colonne droite */}
            <div className="space-y-4 sm:space-y-6">
              <ConsultationInfo appointment={appointment} />
              <StatusActions 
                appointment={appointment}
                onUpdateStatus={onUpdateStatus}
                onClose={onClose}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
