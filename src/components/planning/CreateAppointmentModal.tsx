
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AppointmentSection } from "./appointment-form/AppointmentSection";
import { ClientSection } from "./appointment-form/ClientSection";
import { AnimalSection } from "./appointment-form/AnimalSection";
import { ConsultationSection } from "./appointment-form/ConsultationSection";
import { useAppointmentForm } from "./appointment-form/useAppointmentForm";
import { usePlanningActions } from "@/hooks/usePlanningActions";

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultData?: any;
  appointmentToEdit?: any;
  veterinarians: any[];
  consultationTypes: any[];
  onAppointmentDeleted?: () => void;
  onRefreshPlanning?: () => void; // Nouvelle prop pour déclencher le rafraîchissement
}

export const CreateAppointmentModal = ({
  isOpen,
  onClose,
  defaultData,
  appointmentToEdit,
  veterinarians,
  consultationTypes,
  onAppointmentDeleted,
  onRefreshPlanning
}: CreateAppointmentModalProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
          booking_source: appointmentToEdit.booking_source,
          
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
      console.log('🗑️ Starting deletion process for appointment:', appointmentToEdit.id);
      const success = await deleteBooking(appointmentToEdit.id);
      if (success) {
        console.log('✅ Appointment deleted successfully');
        setShowDeleteConfirm(false);
        onClose(); // Fermer le modal
        
        // Déclencher le rafraîchissement du planning
        if (onAppointmentDeleted) {
          console.log('📱 Calling onAppointmentDeleted callback');
          onAppointmentDeleted();
        }
        
        if (onRefreshPlanning) {
          console.log('🔄 Triggering planning refresh');
          onRefreshPlanning();
        }
      } else {
        console.error('❌ Failed to delete appointment');
        // Ne pas fermer le modal en cas d'erreur
      }
    }
  };

  const isEditMode = !!appointmentToEdit;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 py-2 border-b bg-gradient-to-r from-vet-navy/5 to-vet-sage/5 flex-shrink-0">
          <DialogTitle className="text-base font-bold text-vet-navy">
            {isEditMode ? 'Modifier le rendez-vous' : 'Créer un nouveau rendez-vous'}
          </DialogTitle>
          <DialogDescription className="text-xs text-vet-brown">
            {isEditMode 
              ? 'Modifier les informations du rendez-vous et marquer l\'arrivée du client'
              : 'Saisir les informations pour un rendez-vous pris par téléphone ou sur place'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <div className="px-3 py-2 space-y-2 flex-1 overflow-y-auto">
            {/* Grille des 3 sections principales - très compacte */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              {/* Section Rendez-vous */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-md p-2">
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
              <div className="bg-green-50/50 border border-green-200 rounded-md p-2">
                <ClientSection
                  formData={formData}
                  onFieldUpdate={updateField}
                />
              </div>

              {/* Section Animal */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-md p-2">
                <AnimalSection
                  formData={formData}
                  onFieldUpdate={updateField}
                />
              </div>
            </div>

            {/* Section Consultation - pleine largeur très compacte */}
            <div className="bg-purple-50/50 border border-purple-200 rounded-md p-2">
              <ConsultationSection
                formData={formData}
                onFieldUpdate={updateField}
              />
            </div>
          </div>

          {/* Boutons d'action - fixés en bas avec moins d'espacement */}
          <div className="flex justify-between items-center border-t bg-gray-50/50 px-3 py-2 flex-shrink-0">
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose} className="px-3 py-1 text-xs h-8">
                Annuler
              </Button>
              {isEditMode && (
                <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      type="button" 
                      variant="destructive"
                      disabled={isDeletingBooking}
                      className="px-3 py-1 text-xs h-8"
                    >
                      {isDeletingBooking ? 'Suppression...' : 'Supprimer'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer définitivement ce rendez-vous ?
                        <br />
                        <strong>Client :</strong> {appointmentToEdit?.client_name}
                        <br />
                        <strong>Animal :</strong> {appointmentToEdit?.animal_name}
                        <br />
                        <strong>Date :</strong> {appointmentToEdit?.appointment_date} à {appointmentToEdit?.appointment_time}
                        <br />
                        <br />
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel 
                        className="text-xs h-8"
                        disabled={isDeletingBooking}
                      >
                        Annuler
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        disabled={isDeletingBooking}
                        className="bg-red-600 hover:bg-red-700 text-xs h-8"
                      >
                        {isDeletingBooking ? 'Suppression...' : 'Supprimer définitivement'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-vet-sage hover:bg-vet-sage/90 text-white px-3 py-1 text-xs h-8"
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
