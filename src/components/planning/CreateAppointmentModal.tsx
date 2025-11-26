
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, AlertCircle, TrendingUp, UserX, CheckCircle, XCircle, Trash2, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppointmentSection } from "./appointment-form/AppointmentSection";
import { ClientSection } from "./appointment-form/ClientSection";
import { AnimalSection } from "./appointment-form/AnimalSection";
import { ConsultationSection } from "./appointment-form/ConsultationSection";
import { useAppointmentForm } from "./appointment-form/useAppointmentForm";
import { usePlanningActions } from "@/hooks/usePlanningActions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    handleSubmitWithConfirmation,
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCreateConfirmDialog, setShowCreateConfirmDialog] = useState(false);
  const [showUrgencyFeedback, setShowUrgencyFeedback] = useState(false);
  const [urgencyFeedbackCorrect, setUrgencyFeedbackCorrect] = useState<boolean | null>(null);
  const [suggestedUrgency, setSuggestedUrgency] = useState<'critical' | 'moderate' | 'low' | ''>('');
  const [feedbackReason, setFeedbackReason] = useState('');
  const [existingFeedback, setExistingFeedback] = useState<any>(null);

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
        
        // Charger le feedback existant si disponible
        if (appointmentToEdit.urgency_feedback) {
          setExistingFeedback(appointmentToEdit.urgency_feedback);
        } else {
          setExistingFeedback(null);
        }
      } else if (defaultData) {
        console.log('🔄 Modal opened for creating with default data:', defaultData);
        // Mode création: pré-remplir avec les données du créneau sélectionné
        initializeFormData(defaultData);
        setExistingFeedback(null);
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
      label: 'Urgence critique'
    };
    if (score >= 5) return {
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: AlertCircle,
      label: 'Urgence modérée'
    };
    return {
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: TrendingUp,
      label: 'Urgence faible'
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

  // Handle confirm click - opens dialog for online bookings
  const handleConfirmClick = () => {
    // Vérifier les champs obligatoires avant d'ouvrir le popup
    if (!validateRequiredFields()) {
      toast({
        title: "Champs obligatoires manquants",
        description: "Veuillez remplir tous les champs obligatoires (marqués avec *) avant de confirmer le rendez-vous.",
        variant: "destructive",
        duration: 5000
      });
      return;
    }
    
    // Ouvrir le popup de confirmation
    setShowConfirmDialog(true);
  };

  // Handle confirm confirmation - actually confirms the appointment
  const handleConfirmConfirmation = async () => {
    if (appointmentToEdit?.id) {
      // Si on confirme le RDV et qu'il y a des changements, sauvegarder d'abord les modifications
      if (hasChanges()) {
        console.log('💾 Saving changes before confirming...');
        // Créer un faux événement pour handleSubmit
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
        await handleSubmit(fakeEvent);
      }
      
      // Ensuite mettre à jour le statut
      const success = await updateBookingStatus(appointmentToEdit.id, 'confirmed');
      if (success) {
        setShowConfirmDialog(false);
        onClose();
        if (onRefreshPlanning) {
          onRefreshPlanning();
        }
      }
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmDialog(false);
  };

  // Handle status update for other statuses (not confirmed)
  const handleStatusUpdate = async (newStatus: string) => {
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

  // Handle create click - opens dialog for manual bookings
  const handleCreateClick = () => {
    // Vérifier les champs obligatoires avant d'ouvrir le popup
    if (!validateRequiredFields()) {
      toast({
        title: "Champs obligatoires manquants",
        description: "Veuillez remplir tous les champs obligatoires (marqués avec *) avant de créer le rendez-vous.",
        variant: "destructive",
        duration: 5000
      });
      return;
    }
    
    // Ouvrir le popup de confirmation
    setShowCreateConfirmDialog(true);
  };

  // Handle create confirmation - actually creates the appointment
  const handleConfirmCreate = async () => {
    const success = await handleSubmitWithConfirmation();
    if (success) {
      setShowCreateConfirmDialog(false);
      if (onRefreshPlanning) {
        onRefreshPlanning();
      }
    }
  };

  const handleCancelCreate = () => {
    setShowCreateConfirmDialog(false);
  };

  // Handle urgency feedback
  const handleSubmitUrgencyFeedback = async () => {
    if (urgencyFeedbackCorrect === null) {
      toast({
        title: "Sélection requise",
        description: "Veuillez indiquer si l'évaluation de l'urgence est correcte.",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    if (urgencyFeedbackCorrect === false && !suggestedUrgency) {
      toast({
        title: "Niveau manquant",
        description: "Veuillez sélectionner le niveau d'urgence qui aurait été plus adapté.",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    if (!appointmentToEdit?.id || !appointmentToEdit?.clinic_id) {
      toast({
        title: "Erreur",
        description: "Informations du rendez-vous manquantes",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    try {
      const urgencyScoreValue = appointmentToEdit.urgency_score || 0;
      let originalLevel = 'low';
      if (urgencyScoreValue >= 8) originalLevel = 'critical';
      else if (urgencyScoreValue >= 5) originalLevel = 'moderate';

      const feedbackData = {
        is_correct: urgencyFeedbackCorrect,
        suggested_level: urgencyFeedbackCorrect ? null : suggestedUrgency,
        feedback_reason: urgencyFeedbackCorrect ? null : feedbackReason,
        submitted_at: new Date().toISOString()
      };

      // 1. Insérer dans urgency_feedbacks
      const { error: insertError } = await supabase
        .from('urgency_feedbacks')
        .insert({
          booking_id: appointmentToEdit.id,
          clinic_id: appointmentToEdit.clinic_id,
          original_score: urgencyScoreValue,
          original_level: originalLevel,
          is_correct: urgencyFeedbackCorrect,
          suggested_level: urgencyFeedbackCorrect ? null : suggestedUrgency,
          feedback_reason: urgencyFeedbackCorrect ? null : feedbackReason,
        });

      if (insertError) throw insertError;

      // 2. Mettre à jour le champ urgency_feedback sur bookings
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ urgency_feedback: feedbackData })
        .eq('id', appointmentToEdit.id);

      if (updateError) throw updateError;

      setExistingFeedback(feedbackData);
      toast({
        title: "Feedback enregistré",
        description: "Merci pour votre retour, cela nous aide à améliorer l'évaluation automatique.",
        duration: 3000
      });

      // Reset et fermer
      setShowUrgencyFeedback(false);
      setUrgencyFeedbackCorrect(null);
      setSuggestedUrgency('');
      setFeedbackReason('');
      
      // Refresh planning
      if (onRefreshPlanning) {
        onRefreshPlanning();
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du feedback:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le feedback. Veuillez réessayer.",
        variant: "destructive",
        duration: 3000
      });
    }
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
            {/* Indicateur d'urgence pour les RDV en ligne - Cliquable */}
            {isEditMode && isOnlineBooking && urgencyConfig && UrgencyIcon && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUrgencyFeedback(true)}
                  className={cn(
                    "px-4 py-2.5 text-xs font-bold border-2 flex items-center gap-2 flex-shrink-0 transition-all hover:scale-105 hover:shadow-lg",
                    urgencyConfig.color,
                    "hover:bg-opacity-90",
                    urgencyScore >= 8 && "animate-pulse shadow-lg"
                  )}
                >
                  <UrgencyIcon className="h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-semibold uppercase tracking-wide opacity-90">
                      {urgencyConfig.label}
                    </span>
                    <span className="text-base font-extrabold">
                      {urgencyScore}/10
                    </span>
                  </div>
                </Button>
                {existingFeedback && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Feedback donné ✓
                  </Badge>
                )}
              </div>
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
                      onClick={handleConfirmClick}
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
                type="button"
                onClick={handleCreateClick}
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

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer le rendez-vous</AlertDialogTitle>
              <AlertDialogDescription>
                Confirmez-vous ce rendez-vous en ligne ? Un email de confirmation sera automatiquement envoyé au client.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelConfirmation} disabled={isDeletingBooking}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmConfirmation}
                disabled={isDeletingBooking}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Valider la confirmation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showCreateConfirmDialog} onOpenChange={setShowCreateConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Créer le rendez-vous</AlertDialogTitle>
              <AlertDialogDescription>
                Créer ce rendez-vous ? 
                {formData.clientEmail && (
                  <span className="block mt-2 font-semibold">
                    Un email de confirmation sera automatiquement envoyé au client à l'adresse : {formData.clientEmail}
                  </span>
                )}
                {!formData.clientEmail && (
                  <span className="block mt-2 text-muted-foreground">
                    Aucun email ne sera envoyé (adresse email non renseignée)
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelCreate} disabled={isSubmitting}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmCreate}
                disabled={isSubmitting}
                className="bg-vet-sage hover:bg-vet-sage/90 text-white"
              >
                Valider la création
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog de feedback sur l'évaluation d'urgence */}
        <AlertDialog open={showUrgencyFeedback} onOpenChange={setShowUrgencyFeedback}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-vet-navy">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Évaluation de l'urgence
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Votre retour nous aide à améliorer la précision de l'évaluation automatique de l'urgence.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-6 py-4">
              {/* Affichage du score actuel */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-vet-navy mb-1">Évaluation actuelle:</p>
                    <div className="flex items-center gap-2">
                      {urgencyConfig && UrgencyIcon && (
                        <>
                          <UrgencyIcon className="h-5 w-5" />
                          <span className="text-lg font-bold">{urgencyConfig.label}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-4xl font-extrabold text-vet-sage">
                    {urgencyScore}/10
                  </div>
                </div>
              </div>

              {/* Question principale */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-vet-navy">
                  L'urgence est-elle bien évaluée ?
                </Label>
                <RadioGroup
                  value={urgencyFeedbackCorrect === null ? "" : urgencyFeedbackCorrect ? "yes" : "no"}
                  onValueChange={(value) => {
                    setUrgencyFeedbackCorrect(value === "yes");
                    if (value === "yes") {
                      setSuggestedUrgency('');
                      setFeedbackReason('');
                    }
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2 bg-green-50 border-2 border-green-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-green-100 transition-colors flex-1">
                    <RadioGroupItem value="yes" id="correct-yes" />
                    <Label htmlFor="correct-yes" className="cursor-pointer flex items-center gap-2 flex-1">
                      <ThumbsUp className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-700">Oui, c'est correct</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-50 border-2 border-red-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-red-100 transition-colors flex-1">
                    <RadioGroupItem value="no" id="correct-no" />
                    <Label htmlFor="correct-no" className="cursor-pointer flex items-center gap-2 flex-1">
                      <ThumbsDown className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-red-700">Non, ce n'est pas correct</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Si incorrect: choisir le bon niveau */}
              {urgencyFeedbackCorrect === false && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <Label className="text-base font-semibold text-vet-navy">
                    Quel niveau d'urgence aurait été plus adapté ?
                  </Label>
                  <RadioGroup
                    value={suggestedUrgency}
                    onValueChange={(value) => setSuggestedUrgency(value as 'critical' | 'moderate' | 'low')}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2 bg-red-50 border-2 border-red-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-red-100 transition-colors">
                      <RadioGroupItem value="critical" id="urgency-critical" />
                      <Label htmlFor="urgency-critical" className="cursor-pointer flex items-center gap-2 flex-1">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-semibold text-red-700">Urgence critique (≥8/10)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-orange-50 border-2 border-orange-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-orange-100 transition-colors">
                      <RadioGroupItem value="moderate" id="urgency-moderate" />
                      <Label htmlFor="urgency-moderate" className="cursor-pointer flex items-center gap-2 flex-1">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <span className="font-semibold text-orange-700">Urgence modérée (5-7/10)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-50 border-2 border-green-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-green-100 transition-colors">
                      <RadioGroupItem value="low" id="urgency-low" />
                      <Label htmlFor="urgency-low" className="cursor-pointer flex items-center gap-2 flex-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-700">Urgence faible (&lt;5/10)</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Raison */}
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="feedback-reason" className="text-sm font-medium text-vet-navy">
                      Pourquoi ? (optionnel)
                    </Label>
                    <Textarea
                      id="feedback-reason"
                      value={feedbackReason}
                      onChange={(e) => setFeedbackReason(e.target.value)}
                      placeholder="Ex: Le symptôme était plus grave que prévu, ou au contraire moins urgent..."
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowUrgencyFeedback(false);
                  setUrgencyFeedbackCorrect(null);
                  setSuggestedUrgency('');
                  setFeedbackReason('');
                }}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmitUrgencyFeedback}
                className="bg-vet-sage hover:bg-vet-sage/90 text-white"
              >
                Envoyer le feedback
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};
