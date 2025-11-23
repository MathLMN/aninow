
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Mail, AlertTriangle, AlertCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentInfoProps {
  appointment: any;
}

export const AppointmentInfo = ({ appointment }: AppointmentInfoProps) => {
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

  const isOnlineBooking = appointment.booking_source === 'online';
  const urgencyConfig = appointment.urgency_score ? getUrgencyConfig(appointment.urgency_score) : null;
  const UrgencyIcon = urgencyConfig?.icon;

  return (
    <div className="space-y-4">
      {/* En-tête avec statut et urgence */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <h3 className="text-lg font-semibold text-vet-navy">Informations du rendez-vous</h3>
        <div className="flex items-center gap-2">
          {isOnlineBooking && urgencyConfig && UrgencyIcon && (
            <Badge className={cn(
              "px-3 py-1.5 text-xs font-bold border-2 flex items-center gap-1.5",
              urgencyConfig.color,
              appointment.urgency_score >= 8 && "animate-pulse"
            )}>
              <UrgencyIcon className="h-3.5 w-3.5" />
              {urgencyConfig.label} ({appointment.urgency_score}/10)
            </Badge>
          )}
          <Badge className={getStatusColor(appointment.status)}>
            {getStatusLabel(appointment.status)}
          </Badge>
        </div>
      </div>

      {/* Détails de l'analyse d'urgence pour les RDV en ligne */}
      {isOnlineBooking && appointment.ai_analysis?.analysis_summary && (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="text-sm text-blue-900">
            <span className="font-semibold">Analyse AI:</span> {appointment.ai_analysis.analysis_summary}
          </div>
        </div>
      )}

      {/* Informations de base */}
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

      {/* Note sur la préférence de vétérinaire pour RDV en ligne */}
      {isOnlineBooking && appointment.veterinarian_id && (
        <div className={cn(
          "p-3 rounded-lg border",
          appointment.veterinarian_preference_selected
            ? "bg-green-50 border-green-200"
            : "bg-blue-50 border-blue-200"
        )}>
          <div className="text-sm">
            {appointment.veterinarian_preference_selected ? (
              <span className="text-green-900">
                ✓ <strong>Vétérinaire choisi par le client</strong> - Le client a spécifiquement sélectionné ce vétérinaire
              </span>
            ) : (
              <span className="text-blue-900">
                ℹ️ <strong>Vétérinaire attribué automatiquement</strong> - Le client n'avait pas de préférence, ce vétérinaire a été assigné par le système
              </span>
            )}
          </div>
        </div>
      )}

      {/* Informations client */}
      <div className="space-y-2">
        <h4 className="font-medium text-vet-navy flex items-center">
          <User className="h-4 w-4 mr-2" />
          Client
        </h4>
        <div className="grid grid-cols-1 gap-2 text-sm pl-6">
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
    </div>
  );
};
