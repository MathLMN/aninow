import { AlertTriangle, Phone } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UrgencyAlertProps {
  urgencyScore: number;
  priorityLevel: string;
  clinicPhone?: string;
}

export const UrgencyAlert = ({ urgencyScore, priorityLevel, clinicPhone }: UrgencyAlertProps) => {
  // Afficher uniquement si urgence élevée
  const shouldShow = urgencyScore >= 7 || priorityLevel === 'critical' || priorityLevel === 'high';
  
  if (!shouldShow) return null;

  return (
    <Alert className="border-orange-500 bg-orange-50 mb-6">
      <AlertTriangle className="h-5 w-5 text-orange-600" />
      <AlertTitle className="text-orange-900 font-semibold">
        Situation nécessitant une attention
      </AlertTitle>
      <AlertDescription className="text-orange-800 space-y-3">
        <p>
          Votre situation nécessite une prise en charge rapide. Notre équipe vous contactera dans les plus brefs délais.
        </p>
        {clinicPhone && (
          <p className="flex items-center gap-2 font-medium">
            <Phone className="h-4 w-4" />
            En cas d'urgence vitale, contactez-nous immédiatement au {clinicPhone}
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
};
