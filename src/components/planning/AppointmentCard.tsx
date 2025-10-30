
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User, PawPrint, AlertTriangle, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentCardProps {
  appointment: any;
  onClick: () => void;
  className?: string;
}

export const AppointmentCard = ({ appointment, onClick, className }: AppointmentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (score: number) => {
    if (score >= 8) return 'text-red-600';
    if (score >= 6) return 'text-orange-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getUrgencyBadgeColor = (score: number) => {
    if (score >= 8) return 'bg-red-100 text-red-800 border-red-300';
    if (score >= 6) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const getUrgencyLabel = (score: number) => {
    if (score >= 8) return 'URGENT';
    if (score >= 6) return 'Élevé';
    if (score >= 4) return 'Moyen';
    return 'Faible';
  };

  const getUrgencyIcon = (score: number) => {
    if (score >= 8) return AlertTriangle;
    if (score >= 6) return AlertCircle;
    return TrendingUp;
  };

  const UrgencyIcon = appointment.urgency_score ? getUrgencyIcon(appointment.urgency_score) : TrendingUp;
  const isOnlineBooking = appointment.booking_source === 'online';

  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-md transition-all duration-200 border-l-4",
        getStatusColor(appointment.status),
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Badge d'urgence visible pour les RDV en ligne */}
          {isOnlineBooking && appointment.urgency_score && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs font-semibold border-2 flex items-center gap-1 w-fit",
                getUrgencyBadgeColor(appointment.urgency_score)
              )}
            >
              <UrgencyIcon className="h-3 w-3" />
              {getUrgencyLabel(appointment.urgency_score)} ({appointment.urgency_score}/10)
            </Badge>
          )}

          {/* En-tête avec heure */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-vet-sage" />
              <span className="font-medium text-sm">{appointment.appointment_time}</span>
            </div>
            {!isOnlineBooking && appointment.urgency_score && (
              <div className={cn(
                "flex items-center space-x-1 text-xs",
                getUrgencyColor(appointment.urgency_score)
              )}>
                <UrgencyIcon className="h-3 w-3" />
                <span>{appointment.urgency_score}/10</span>
              </div>
            )}
          </div>

          {/* Informations client */}
          <div className="flex items-center space-x-2">
            <User className="h-3 w-3 text-vet-brown" />
            <span className="text-sm font-medium text-vet-navy truncate">
              {appointment.client_name}
            </span>
          </div>

          {/* Informations animal */}
          <div className="flex items-center space-x-2">
            <PawPrint className="h-3 w-3 text-vet-brown" />
            <span className="text-xs text-vet-brown truncate">
              {appointment.animal_name} ({appointment.animal_species})
            </span>
          </div>

          {/* Motif */}
          <div className="text-xs text-vet-brown/80 truncate">
            {appointment.consultation_reason === 'consultation-convenance' ? 'Consultation de convenance' :
             appointment.consultation_reason === 'symptomes-anomalie' ? 'Symptômes/Anomalie' :
             appointment.consultation_reason === 'urgence' ? 'Urgence' : appointment.consultation_reason}
          </div>

          {/* Badge de statut */}
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-xs">
              {appointment.status === 'pending' ? 'En attente' :
               appointment.status === 'confirmed' ? 'Confirmé' :
               appointment.status === 'cancelled' ? 'Annulé' :
               appointment.status === 'completed' ? 'Terminé' : appointment.status}
            </Badge>
            {appointment.selected_symptoms && appointment.selected_symptoms.length > 0 && (
              <span className="text-xs text-vet-brown/60">
                {appointment.selected_symptoms.length} symptôme{appointment.selected_symptoms.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
