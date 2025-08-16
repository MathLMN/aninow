
import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppointmentSection } from "./appointment-form/AppointmentSection";
import { ClientSection } from "./appointment-form/ClientSection";
import { AnimalSection } from "./appointment-form/AnimalSection";
import { ConsultationSection } from "./appointment-form/ConsultationSection";
import { useAppointmentForm } from "./appointment-form/useAppointmentForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlanningActions } from "@/hooks/usePlanningActions";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultData?: any;
  appointmentToEdit?: any;
  veterinarians: any[];
  consultationTypes: any[];
}

export const CreateAppointmentModal = ({
  isOpen,
  onClose,
  defaultData,
  appointmentToEdit,
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
  } = useAppointmentForm(onClose, appointmentToEdit?.id);

  const { deleteBooking, isLoading: isDeletingBooking } = usePlanningActions();

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (appointmentToEdit) {
        console.log('🔄 Modal opened for editing appointment:', appointmentToEdit);
        // Mode édition: pré-remplir avec les données du rendez-vous
        initializeFormData({
          // Données du rendez-vous
          appointmentDate: appointmentToEdit.appointment_date,
          appointmentTime: appointmentToEdit.appointment_time,
          appointmentEndTime: appointmentToEdit.appointment_end_time,
          veterinarianId: appointmentToEdit.veterinarian_id,
          consultationTypeId: appointmentToEdit.consultation_type_id,
          duration: appointmentToEdit.duration_minutes,
          arrival_time: appointmentToEdit.arrival_time,
          
          // Données client
          clientName: appointmentToEdit.client_name,
          clientEmail: appointmentToEdit.client_email,
          clientPhone: appointmentToEdit.client_phone,
          preferredContactMethod: appointmentToEdit.preferred_contact_method,
          clientStatus: appointmentToEdit.client_status,
          
          // Données animal
          animalName: appointmentToEdit.animal_name,
          animalSpecies: appointmentToEdit.animal_species,
          animalBreed: appointmentToEdit.animal_breed,
          animalAge: appointmentToEdit.animal_age,
          animalWeight: appointmentToEdit.animal_weight,
          animalSex: appointmentToEdit.animal_sex,
          animalSterilized: appointmentToEdit.animal_sterilized,
          animalVaccinesUpToDate: appointmentToEdit.animal_vaccines_up_to_date,
          
          // Consultation
          consultationReason: appointmentToEdit.consultation_reason,
          clientComment: appointmentToEdit.client_comment,
        });
      } else if (defaultData) {
        console.log('🔄 Modal opened for creating with default data:', defaultData);
        // Mode création: pré-remplir avec les données du créneau sélectionné
        initializeFormData(defaultData);
      }
    }
  }, [isOpen, defaultData, appointmentToEdit]);

  const onConsultationTypeChange = (consultationTypeId: string) => {
    handleConsultationTypeChange(consultationTypeId, consultationTypes);
  };

  const handleDelete = async () => {
    if (appointmentToEdit?.id) {
      const success = await deleteBooking(appointmentToEdit.id);
      if (success) {
        onClose();
      }
    }
  };

  const isEditMode = !!appointmentToEdit;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b bg-gradient-to-r from-vet-navy/5 to-vet-sage/5 flex-shrink-0">
          <DialogTitle className="text-lg font-bold text-vet-navy">
            {isEditMode ? 'Modifier le rendez-vous' : 'Créer un nouveau rendez-vous'}
          </DialogTitle>
          <DialogDescription className="text-xs text-vet-brown">
            {isEditMode 
              ? 'Modifier les informations du rendez-vous et marquer l\'arrivée du client'
              : 'Saisir les informations pour un rendez-vous pris par téléphone ou sur place'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
          <ScrollArea className="flex-1 px-4 py-3">
            <div className="space-y-4">
              {/* Grille des 3 sections principales */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Section Rendez-vous */}
                <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3">
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
                <div className="bg-green-50/50 border border-green-200 rounded-lg p-3">
                  <ClientSection
                    formData={formData}
                    onFieldUpdate={updateField}
                  />
                </div>

                {/* Section Animal */}
                <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3">
                  <AnimalSection
                    formData={formData}
                    onFieldUpdate={updateField}
                  />
                </div>
              </div>

              {/* Section Consultation - pleine largeur */}
              <div className="bg-purple-50/50 border border-purple-200 rounded-lg p-3">
                <ConsultationSection
                  formData={formData}
                  onFieldUpdate={updateField}
                />
              </div>
            </div>
          </ScrollArea>

          {/* Actions en bas de la fiche */}
          <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50/50 flex-shrink-0">
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose} className="px-4 text-sm">
                Annuler
              </Button>
              {isEditMode && (
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeletingBooking}
                  className="px-4 text-sm"
                >
                  {isDeletingBooking ? 'Suppression...' : 'Supprimer'}
                </Button>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-vet-sage hover:bg-vet-sage/90 text-white px-4 text-sm"
            >
              {isSubmitting 
                ? (isEditMode ? 'Modification...' : 'Création...') 
                : 'Valider'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
