
import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppointmentSection } from "./appointment-form/AppointmentSection";
import { ClientSection } from "./appointment-form/ClientSection";
import { AnimalSection } from "./appointment-form/AnimalSection";
import { ConsultationSection } from "./appointment-form/ConsultationSection";
import { useAppointmentForm } from "./appointment-form/useAppointmentForm";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultData?: any;
  veterinarians: any[];
  consultationTypes: any[];
}

export const CreateAppointmentModal = ({
  isOpen,
  onClose,
  defaultData,
  veterinarians,
  consultationTypes
}: CreateAppointmentModalProps) => {
  const {
    formData,
    isSubmitting,
    updateField,
    handleConsultationTypeChange,
    handleSubmit,
    calculateEndTime,
    initializeFormData
  } = useAppointmentForm(onClose);

  // Initialize form data when modal opens with default data
  useEffect(() => {
    if (isOpen && defaultData) {
      initializeFormData(defaultData);
    }
  }, [isOpen, defaultData]);

  const onConsultationTypeChange = (consultationTypeId: string) => {
    handleConsultationTypeChange(consultationTypeId, consultationTypes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-vet-navy">Créer un nouveau rendez-vous</DialogTitle>
          <DialogDescription>
            Saisir les informations pour un rendez-vous pris par téléphone ou sur place
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AppointmentSection
            formData={formData}
            veterinarians={veterinarians}
            consultationTypes={consultationTypes}
            onFieldUpdate={updateField}
            onConsultationTypeChange={onConsultationTypeChange}
            calculateEndTime={calculateEndTime}
          />

          <ClientSection
            formData={formData}
            onFieldUpdate={updateField}
          />

          <AnimalSection
            formData={formData}
            onFieldUpdate={updateField}
          />

          <ConsultationSection
            formData={formData}
            onFieldUpdate={updateField}
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-vet-sage hover:bg-vet-sage/90 text-white"
            >
              {isSubmitting ? 'Création...' : 'Créer le rendez-vous'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
