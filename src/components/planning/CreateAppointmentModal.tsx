
import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppointmentSection } from "./appointment-form/AppointmentSection";
import { ClientSection } from "./appointment-form/ClientSection";
import { AnimalSection } from "./appointment-form/AnimalSection";
import { ConsultationSection } from "./appointment-form/ConsultationSection";
import { useAppointmentForm } from "./appointment-form/useAppointmentForm";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    initializeFormData,
    handleTimeChange
  } = useAppointmentForm(onClose);

  // Initialize form data when modal opens with default data
  useEffect(() => {
    if (isOpen && defaultData) {
      console.log('🚀 Modal opened with default data:', defaultData);
      initializeFormData(defaultData);
    }
  }, [isOpen, defaultData]);

  const onConsultationTypeChange = (consultationTypeId: string) => {
    handleConsultationTypeChange(consultationTypeId, consultationTypes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-vet-navy/5 to-vet-sage/5">
          <DialogTitle className="text-xl font-bold text-vet-navy">Créer un nouveau rendez-vous</DialogTitle>
          <DialogDescription className="text-sm text-vet-brown">
            Saisir les informations pour un rendez-vous pris par téléphone ou sur place
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Section Rendez-vous */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4">
                <AppointmentSection
                  formData={formData}
                  veterinarians={veterinarians}
                  consultationTypes={consultationTypes}
                  onFieldUpdate={updateField}
                  onConsultationTypeChange={onConsultationTypeChange}
                  onTimeChange={handleTimeChange}
                  calculateEndTime={calculateEndTime}
                />
              </div>

              {/* Section Client */}
              <div className="bg-green-50/50 border border-green-200 rounded-lg p-4">
                <ClientSection
                  formData={formData}
                  onFieldUpdate={updateField}
                />
              </div>

              {/* Section Animal */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-4">
                <AnimalSection
                  formData={formData}
                  onFieldUpdate={updateField}
                />
              </div>
            </div>

            {/* Section Consultation - pleine largeur */}
            <div className="mt-6 bg-purple-50/50 border border-purple-200 rounded-lg p-4">
              <ConsultationSection
                formData={formData}
                onFieldUpdate={updateField}
              />
            </div>
          </form>
        </ScrollArea>

        {/* Actions en bas */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t bg-gray-50/50">
          <Button type="button" variant="outline" onClick={onClose} className="px-6">
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-vet-sage hover:bg-vet-sage/90 text-white px-6"
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Création...' : 'Créer le rendez-vous'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
