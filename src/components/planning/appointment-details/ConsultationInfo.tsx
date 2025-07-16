
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle } from "lucide-react";

interface ConsultationInfoProps {
  appointment: any;
}

export const ConsultationInfo = ({ appointment }: ConsultationInfoProps) => {
  const getUrgencyColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50';
    if (score >= 6) return 'text-orange-600 bg-orange-50';
    if (score >= 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-4">
      {/* Motif de consultation */}
      <div className="space-y-3">
        <h4 className="font-medium text-vet-navy flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Motif de consultation
        </h4>
        <div className="text-sm space-y-2 pl-6">
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
          {appointment.custom_symptom && (
            <div><strong>Symptôme personnalisé:</strong> {appointment.custom_symptom}</div>
          )}
        </div>
      </div>

      {/* Score d'urgence */}
      {appointment.urgency_score && (
        <div className="space-y-2">
          <h4 className="font-medium text-vet-navy flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Évaluation d'urgence
          </h4>
          <div className="pl-6">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(appointment.urgency_score)}`}>
              Score: {appointment.urgency_score}/10
            </div>
            {appointment.recommended_actions && appointment.recommended_actions.length > 0 && (
              <div className="text-sm mt-2">
                <strong>Actions recommandées:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {appointment.recommended_actions.map((action: string, index: number) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Commentaire client */}
      {appointment.client_comment && (
        <div className="space-y-2">
          <h4 className="font-medium text-vet-navy">Commentaire du client</h4>
          <p className="text-sm bg-vet-beige/20 p-3 rounded-md">
            {appointment.client_comment}
          </p>
        </div>
      )}
    </div>
  );
};
