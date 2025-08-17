
import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppointmentSection } from "./appointment-form/AppointmentSection";
import { ClientSection } from "./appointment-form/ClientSection";
import { AnimalSection } from "./appointment-form/AnimalSection";
import { ConsultationSection } from "./appointment-form/ConsultationSection";
import { useAppointmentForm } from "./appointment-form/useAppointmentForm";
import { usePlanningActions } from "@/hooks/usePlanningActions";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
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
      <DialogContent className={`
        ${isMobile 
          ? 'w-[95vw] h-[95vh] max-w-none max-h-none m-2 p-0 rounded-lg' 
          : 'max-w-6xl w-[95vw] max-h-[95vh] p-0'
        } 
        overflow-hidden flex flex-col
      `}>
        <DialogHeader className={`
          px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b 
          bg-gradient-to-r from-vet-navy/5 to-vet-sage/5 
          flex-shrink-0
        `}>
          <DialogTitle className="text-base sm:text-lg lg:text-xl font-bold text-vet-navy">
            {isEditMode ? 'Modifier le rendez-vous' : 'Créer un nouveau rendez-vous'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-vet-brown">
            {isEditMode 
              ? 'Modifier les informations du rendez-vous et marquer l\'arrivée du client'
              : 'Saisir les informations pour un rendez-vous pris par téléphone ou sur place'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className={`
            flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 space-y-4 sm:space-y-6
            ${isMobile ? 'pb-20' : ''}
          `}>
            {/* Sections en grille responsive */}
            <div className={`
              grid gap-3 sm:gap-4 lg:gap-6
              ${isMobile 
                ? 'grid-cols-1' 
                : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
              }
            `}>
              {/* Section Renez-vous */}
              <div className={`
                bg-blue-50/50 border border-blue-200 rounded-lg p-3 sm:p-4
                ${!isMobile ? 'md:col-span-1' : ''}
              `}>
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
              <div className={`
                bg-green-50/50 border border-green-200 rounded-lg p-3 sm:p-4
                ${!isMobile ? 'md:col-span-1' : ''}
              `}>
                <ClientSection
                  formData={formData}
                  onFieldUpdate={updateField}
                />
              </div>

              {/* Section Animal */}
              <div className={`
                bg-amber-50/50 border border-amber-200 rounded-lg p-3 sm:p-4
                ${!isMobile ? 'md:col-span-1 xl:col-span-1' : ''}
              `}>
                <AnimalSection
                  formData={formData}
                  onFieldUpdate={updateField}
                />
              </div>
            </div>

            {/* Section Consultation - pleine largeur */}
            <div className="bg-purple-50/50 border border-purple-200 rounded-lg p-3 sm:p-4">
              <ConsultationSection
                formData={formData}
                onFieldUpdate={updateField}
              />
            </div>
          </div>

          {/* Boutons d'action - sticky en bas sur mobile */}
          <div className={`
            flex-shrink-0 border-t bg-gray-50/50 p-3 sm:p-4 lg:p-6
            ${isMobile 
              ? 'fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg' 
              : ''
            }
          `}>
            <div className={`
              flex justify-between items-center gap-2 sm:gap-4
              ${isMobile ? 'max-w-[95vw] mx-auto' : ''}
            `}>
              <div className="flex gap-2 sm:gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="text-xs sm:text-sm px-3 sm:px-4 py-2"
                >
                  Annuler
                </Button>
                {isEditMode && (
                  <Button 
                    type="button" 
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeletingBooking}
                    className="text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    {isDeletingBooking ? 'Suppression...' : 'Supprimer'}
                  </Button>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-vet-sage hover:bg-vet-sage/90 text-white text-xs sm:text-sm px-4 sm:px-6 py-2"
              >
                {isSubmitting 
                  ? (isEditMode ? 'Modification...' : 'Création...') 
                  : 'Valider'
                }
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
