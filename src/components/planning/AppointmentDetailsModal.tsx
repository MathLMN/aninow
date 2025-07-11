
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Phone, Mail, PawPrint, FileText, AlertCircle } from "lucide-react";

interface AppointmentDetailsModalProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (appointmentId: string, status: string) => Promise<boolean>;
}

export const AppointmentDetailsModal = ({
  appointment,
  isOpen,
  onClose,
  onUpdateStatus
}: AppointmentDetailsModalProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState('');

  if (!appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    const success = await onUpdateStatus(appointment.id, newStatus);
    if (success) {
      onClose();
    }
    setIsUpdating(false);
  };

  const getUrgencyColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50';
    if (score >= 6) return 'text-orange-600 bg-orange-50';
    if (score >= 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-vet-navy">Détails du rendez-vous</span>
            <Badge className={getStatusColor(appointment.status)}>
              {getStatusLabel(appointment.status)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur le rendez-vous et l'animal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations rendez-vous */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-vet-sage" />
              <span className="text-sm">
                <strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-vet-sage" />
              <span className="text-sm">
                <strong>Heure:</strong> {appointment.appointment_time}
              </span>
            </div>
          </div>

          {/* Informations client */}
          <div className="space-y-3">
            <h3 className="font-semibold text-vet-navy flex items-center">
              <User className="h-4 w-4 mr-2" />
              Informations client
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><strong>Nom:</strong> {appointment.client_name}</div>
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                {appointment.client_phone}
              </div>
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                {appointment.client_email}
              </div>
              <div><strong>Contact préféré:</strong> {appointment.preferred_contact_method}</div>
            </div>
          </div>

          {/* Informations animal */}
          <div className="space-y-3">
            <h3 className="font-semibold text-vet-navy flex items-center">
              <PawPrint className="h-4 w-4 mr-2" />
              Informations animal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><strong>Nom:</strong> {appointment.animal_name}</div>
              <div><strong>Espèce:</strong> {appointment.animal_species}</div>
              {appointment.animal_breed && <div><strong>Race:</strong> {appointment.animal_breed}</div>}
              {appointment.animal_age && <div><strong>Âge:</strong> {appointment.animal_age}</div>}
              {appointment.animal_weight && <div><strong>Poids:</strong> {appointment.animal_weight} kg</div>}
              {appointment.animal_sex && <div><strong>Sexe:</strong> {appointment.animal_sex}</div>}
            </div>
          </div>

          {/* Motif de consultation */}
          <div className="space-y-3">
            <h3 className="font-semibold text-vet-navy flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Motif de consultation
            </h3>
            <div className="text-sm space-y-2">
              <div><strong>Raison:</strong> {appointment.consultation_reason}</div>
              {appointment.selected_symptoms && appointment.selected_symptoms.length > 0 && (
                <div>
                  <strong>Symptômes:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {appointment.selected_symptoms.map((symptom: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {appointment.symptom_duration && (
                <div><strong>Durée des symptômes:</strong> {appointment.symptom_duration}</div>
              )}
            </div>
          </div>

          {/* Score d'urgence */}
          {appointment.urgency_score && (
            <div className="space-y-2">
              <h3 className="font-semibold text-vet-navy flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Évaluation d'urgence
              </h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(appointment.urgency_score)}`}>
                Score: {appointment.urgency_score}/10
              </div>
              {appointment.recommended_actions && appointment.recommended_actions.length > 0 && (
                <div className="text-sm">
                  <strong>Actions recommandées:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {appointment.recommended_actions.map((action: string, index: number) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Commentaire client */}
          {appointment.client_comment && (
            <div className="space-y-2">
              <h3 className="font-semibold text-vet-navy">Commentaire du client</h3>
              <p className="text-sm bg-vet-beige/20 p-3 rounded-md">
                {appointment.client_comment}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-vet-navy">Changer le statut</h3>
              <div className="flex space-x-2">
                {appointment.status !== 'confirmed' && (
                  <Button
                    onClick={() => handleStatusUpdate('confirmed')}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Confirmer
                  </Button>
                )}
                {appointment.status !== 'completed' && (
                  <Button
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={isUpdating}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Marquer terminé
                  </Button>
                )}
                {appointment.status !== 'cancelled' && (
                  <Button
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={isUpdating}
                    variant="destructive"
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
