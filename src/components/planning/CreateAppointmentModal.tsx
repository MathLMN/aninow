
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClientSection } from "./appointment-form/ClientSection";
import { AnimalSection } from "./appointment-form/AnimalSection";
import { ConsultationSection } from "./appointment-form/ConsultationSection";
import { AppointmentSection } from "./appointment-form/AppointmentSection";
import { useAppointmentForm } from "./appointment-form/useAppointmentForm";
import { useClinicVeterinarians } from "@/hooks/useClinicVeterinarians";

export interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultData?: any;
  appointmentToEdit?: any;
}

export const CreateAppointmentModal = ({
  isOpen,
  onClose,
  defaultData,
  appointmentToEdit
}: CreateAppointmentModalProps) => {
  const { veterinarians } = useClinicVeterinarians();
  
  const {
    formData,
    isSubmitting,
    handleFieldUpdate,
    handleConsultationTypeChange,
    handleTimeChange,
    calculateEndTime,
    handleSubmit
  } = useAppointmentForm(defaultData || appointmentToEdit, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900">
            {appointmentToEdit ? 'Modifier le rendez-vous' : 'Créer un nouveau rendez-vous'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <ClientSection 
                formData={formData}
                onFieldUpdate={handleFieldUpdate}
              />
              
              <AnimalSection 
                formData={formData}
                onFieldUpdate={handleFieldUpdate}
              />
            </div>
            
            <div className="space-y-6">
              <AppointmentSection 
                formData={formData}
                veterinarians={veterinarians}
                onFieldUpdate={handleFieldUpdate}
                onConsultationTypeChange={handleConsultationTypeChange}
                onTimeChange={handleTimeChange}
                calculateEndTime={calculateEndTime}
              />
              
              <ConsultationSection 
                formData={formData}
                onFieldUpdate={handleFieldUpdate}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Enregistrement...' : (appointmentToEdit ? 'Modifier' : 'Créer le rendez-vous')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
