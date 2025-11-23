
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, TrendingUp, UserX, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppointmentSection } from "./appointment-form/AppointmentSection";
import { ClientSection } from "./appointment-form/ClientSection";
import { AnimalSection } from "./appointment-form/AnimalSection";
import { ConsultationSection } from "./appointment-form/ConsultationSection";
import { useAppointmentForm } from "./appointment-form/useAppointmentForm";
import { usePlanningActions } from "@/hooks/usePlanningActions";
import { useToast } from "@/hooks/use-toast";

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

  const {
    formData,
    isSubmitting,
    validationErrors,
    updateField,
    handleConsultationTypesChange,
    handleSubmit,
    calculateEndTime,
    initializeFormData,
    handleTimeChange,
    handleMarkArrival,
    hasChanges,
    validateRequiredFields
  } = useAppointmentForm(onClose, appointmentToEdit?.id);

  const { updateBookingStatus, moveAppointment, deleteBooking, isLoading: isDeletingBooking } = usePlanningActions();
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
          consultation_reason: appointmentToEdit.consultation_reason,
          consultationReason: appointmentToEdit.consultation_reason,
          ai_analysis: appointmentToEdit.ai_analysis,
          clientComment: appointmentToEdit.client_comment,
        });
      } else if (defaultData) {
        console.log('🔄 Modal opened for creating with default data:', defaultData);
        // Mode création: pré-remplir avec les données du créneau sélectionné
        initializeFormData(defaultData);
      }
    }
  }, [isOpen, defaultData, appointmentToEdit]);

  const onConsultationTypesChangeWrapper = (consultationTypeIds: string[]) => {
    handleConsultationTypesChange(consultationTypeIds, consultationTypes);
  };


  const isEditMode = !!appointmentToEdit;
  const isOnlineBooking = appointmentToEdit?.booking_source === 'online';
  const urgencyScore = appointmentToEdit?.urgency_score;

  const getUrgencyConfig = (score: number) => {
    if (score >= 8) return {
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: AlertTriangle,
      label: 'URGENCE ÉLEVÉE'
    };
    if (score >= 6) return {
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: AlertCircle,
      label: 'Urgence modérée'
    };
    if (score >= 4) return {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: TrendingUp,
      label: 'Priorité moyenne'
    };
    return {
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: TrendingUp,
      label: 'Priorité faible'
    };
  };

  const urgencyConfig = urgencyScore ? getUrgencyConfig(urgencyScore) : null;
  const UrgencyIcon = urgencyConfig?.icon;

  // Check if appointment has passed
  const isAppointmentPassed = () => {
    if (!appointmentToEdit?.appointment_date || !appointmentToEdit?.appointment_time) return false;
    const appointmentDateTime = new Date(`${appointmentToEdit.appointment_date}T${appointmentToEdit.appointment_time}`);
    return appointmentDateTime < new Date();
  };

  // Check if we can mark as no-show
  const canMarkNoShow = () => {
    return isAppointmentPassed() && 
           appointmentToEdit?.status && 
           (appointmentToEdit.status === 'confirmed' || appointmentToEdit.status === 'pending');
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus: string) => {
    // Vérifier les champs obligatoires avant de confirmer
    if (newStatus === 'confirmed' && !validateRequiredFields()) {
      toast({
        title: "Champs obligatoires manquants",
        description: "Veuillez remplir tous les champs obligatoires (marqués avec *) avant de confirmer le rendez-vous.",
        variant: "destructive",
        duration: 5000
      });
      return;
    }
    
    if (appointmentToEdit?.id) {
      const success = await updateBookingStatus(appointmentToEdit.id, newStatus);
      if (success) {
        onClose();
        if (onRefreshPlanning) {
          onRefreshPlanning();
        }
      }
    }
  };

  // Handle delete appointment
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (appointmentToEdit?.id) {
      const success = await deleteBooking(appointmentToEdit.id);
      if (success) {
        setShowDeleteConfirm(false);
        onClose();
        if (onAppointmentDeleted) {
          onAppointmentDeleted();
        }
        if (onRefreshPlanning) {
          onRefreshPlanning();
        }
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Handle save changes in edit mode
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier les champs obligatoires avant d'enregistrer
    if (!validateRequiredFields()) {
      toast({
        title: "Champs obligatoires manquants",
        description: "Veuillez remplir tous les champs obligatoires (marqués avec *) avant d'enregistrer.",
        variant: "destructive",
        duration: 5000
      });
      return;
    }
    
    if (!appointmentToEdit?.id) return;
    
    // Vérifier si la date ou l'heure ont changé
    const dateChanged = formData.appointmentDate !== appointmentToEdit.appointment_date;
    const timeChanged = formData.appointmentTime !== appointmentToEdit.appointment_time;
    const vetChanged = formData.veterinarianId !== appointmentToEdit.veterinarian_id;
    
    if (dateChanged || timeChanged) {
      // Si la date ou l'heure ont changé, utiliser moveAppointment
      const success = await moveAppointment(
        appointmentToEdit.id, 
        formData.appointmentDate, 
        formData.appointmentTime,
        vetChanged ? formData.veterinarianId : undefined
      );
      if (success) {
        onClose();
        if (onRefreshPlanning) {
          onRefreshPlanning();
        }
      }
    } else {
      // Sinon, utiliser la soumission normale pour mettre à jour les autres champs
      await handleSubmit(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 py-2 border-b bg-gradient-to-r from-vet-navy/5 to-vet-sage/5 flex-shrink-0">
          <div className="flex items-start gap-3 mr-8">
            <div className="flex-1">
              <DialogTitle className="text-base font-bold text-vet-navy">
                {isEditMode ? 'Modifier le rendez-vous' : 'Créer un nouveau rendez-vous'}
              </DialogTitle>
              <DialogDescription className="text-xs text-vet-brown">
                {isEditMode 
                  ? 'Modifier les informations du rendez-vous et marquer l\'arrivée du client'
                  : 'Saisir les informations pour un rendez-vous pris par téléphone ou sur place'
                }
              </DialogDescription>
            </div>
            {/* Indicateur d'urgence pour les RDV en ligne */}
            {isEditMode && isOnlineBooking && urgencyConfig && UrgencyIcon && (
              <Badge className={cn(
                "px-3 py-1.5 text-xs font-bold border-2 flex items-center gap-1.5 flex-shrink-0",
                urgencyConfig.color,
                urgencyScore >= 8 && "animate-pulse"
              )}>
                <UrgencyIcon className="h-3.5 w-3.5" />
                {urgencyConfig.label} ({urgencyScore}/10)
              </Badge>
            )}
          </div>
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
                  validationErrors={validationErrors}
                  onFieldUpdate={updateField}
                  onConsultationTypesChange={onConsultationTypesChangeWrapper}
                  onTimeChange={handleTimeChange}
                  calculateEndTime={calculateEndTime}
                  onMarkArrival={handleMarkArrival}
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

            {/* Mention de préférence vétérinaire - seulement pour RDV en ligne */}
            {isEditMode && isOnlineBooking && appointmentToEdit.veterinarian_id && (
              <div className={cn(
                "p-2 rounded-lg border text-xs",
                appointmentToEdit.veterinarian_preference_selected
                  ? "bg-green-50 border-green-200 text-green-900"
                  : "bg-blue-50 border-blue-200 text-blue-900"
              )}>
                {appointmentToEdit.veterinarian_preference_selected ? (
                  <span className="flex items-start gap-1.5">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Vétérinaire choisi par le client</strong> - Le client a spécifiquement sélectionné ce vétérinaire</span>
                  </span>
                ) : (
                  <span className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">ℹ️</span>
                    <span><strong>Vétérinaire attribué automatiquement</strong> - Le client n'avait pas de préférence</span>
                  </span>
                )}
              </div>
            )}

            {/* Section Consultation - pleine largeur très compacte */}
            <div className="bg-purple-50/50 border border-purple-200 rounded-md p-2">
              <ConsultationSection
                formData={formData}
                onFieldUpdate={updateField}
                conditionalAnswers={appointmentToEdit?.conditional_answers}
              />
            </div>
          </div>

          {/* Boutons d'action - fixés en bas avec moins d'espacement */}
          <div className="flex justify-between items-center border-t bg-gray-50/50 px-3 py-2 flex-shrink-0">
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="px-3 py-1 text-xs h-8">
                Fermer
              </Button>
              {isEditMode && (
                <>
                  {/* Actions de statut */}
                  {appointmentToEdit.status !== 'confirmed' && (
                    <Button
                      type="button"
                      onClick={() => handleStatusUpdate('confirmed')}
                      disabled={isDeletingBooking || !validateRequiredFields()}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs h-8 disabled:opacity-50"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Confirmer
                    </Button>
                  )}
                  {canMarkNoShow() && (
                    <Button
                      type="button"
                      onClick={() => handleStatusUpdate('no-show')}
                      disabled={isDeletingBooking}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 text-xs h-8"
                    >
                      <UserX className="h-3 w-3 mr-1" />
                      Marquer absent
                    </Button>
                  )}
                  {appointmentToEdit.status !== 'cancelled' && appointmentToEdit.status !== 'completed' && (
                    <Button
                      type="button"
                      onClick={handleDeleteClick}
                      disabled={isDeletingBooking}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs h-8"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Annuler RDV
                    </Button>
                  )}
                </>
              )}
            </div>
            
            {/* Bouton d'action principal */}
            {isEditMode ? (
              <Button 
                type="button"
                onClick={handleSaveChanges}
                disabled={isSubmitting || !hasChanges() || !validateRequiredFields()}
                className="bg-vet-sage hover:bg-vet-sage/90 text-white px-3 py-1 text-xs h-8 disabled:opacity-50"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isSubmitting || !validateRequiredFields()}
                className="bg-vet-sage hover:bg-vet-sage/90 text-white px-3 py-1 text-xs h-8 disabled:opacity-50"
              >
                {isSubmitting ? 'Création...' : 'Créer le rendez-vous'}
              </Button>
            )}
          </div>
        </form>

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
              <AlertDialogCancel onClick={handleCancelDelete} disabled={isDeletingBooking}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmDelete}
                disabled={isDeletingBooking}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer définitivement
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};
