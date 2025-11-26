import { AlertTriangle, Phone } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UrgencyAlertProps {
  urgencyScore: number;
  priorityLevel: string;
  clinicPhone?: string;
}

export const UrgencyAlert = ({ urgencyScore, priorityLevel, clinicPhone }: UrgencyAlertProps) => {
  // Afficher uniquement si urgence critique
  const shouldShow = priorityLevel === 'critical';
  
  if (!shouldShow) return null;

  return (
    <Alert className="border-red-500 bg-red-50 mb-6">
      <AlertTriangle className="h-5 w-5 text-red-600" />
      <AlertTitle className="text-red-900 font-semibold">
        Urgence critique détectée
      </AlertTitle>
      <AlertDescription className="text-red-800 space-y-3">
        <p>
          Notre équipe fera de son mieux pour prioriser votre demande de rendez-vous. En cas d'évolution des symptômes ou d'aggravation, contactez-nous immédiatement{clinicPhone ? ` au ${clinicPhone}` : ''}.
        </p>
        <div className="pt-2 border-t border-red-200">
          <p className="font-medium mb-2">Urgences vitales nécessitant un contact immédiat :</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Détresse respiratoire sévère (halètement intense, gencives bleues)</li>
            <li>Animal inconscient ou amorphe (ne réagit plus aux stimuli)</li>
            <li>Convulsions ou tremblements incontrôlables</li>
            <li>Hémorragie importante ou traumatisme grave</li>
            <li>Intoxication suspectée (ingestion de produits toxiques)</li>
            <li>Abdomen gonflé et douloureux (dilatation-torsion de l'estomac)</li>
          </ul>
        </div>
        {clinicPhone && (
          <p className="flex items-center gap-2 font-semibold pt-2">
            <Phone className="h-4 w-4" />
            Téléphone d'urgence : {clinicPhone}
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
};
