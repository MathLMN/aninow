
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle } from "lucide-react";
import { PhotoGallery } from "./PhotoGallery";

interface ConsultationInfoProps {
  appointment: any;
}

export const ConsultationInfo = ({ appointment }: ConsultationInfoProps) => {
  const getUrgencyLevel = (score: number) => {
    if (score >= 7) {
      return {
        label: 'Urgence élevée',
        color: 'bg-red-500 text-white border-red-500'
      };
    }
    if (score >= 4) {
      return {
        label: 'Urgence modérée',
        color: 'bg-orange-500 text-white border-orange-500'
      };
    }
    return {
      label: 'Non urgent',
      color: 'bg-green-500 text-white border-green-500'
    };
  };

  const getConsultationTypeLabel = (reason: string) => {
    switch (reason) {
      case 'symptomes-anomalie':
        return 'Symptômes ou anomalie';
      case 'consultation-convenance':
        return 'Consultation de convenance';
      default:
        return reason;
    }
  };

  const getConvenienceOptionsLabels = (options: string[]) => {
    const labels: Record<string, string> = {
      'vaccination': 'Vaccination',
      'sterilisation': 'Stérilisation',
      'detartrage': 'Détartrage',
      'bilan-sante': 'Bilan de santé',
      'identification': 'Identification (puce/tatouage)',
      'vermifugation': 'Vermifugation',
      'antiparasitaire': 'Traitement antiparasitaire',
      'autre': 'Autre'
    };
    return options.map(opt => labels[opt] || opt);
  };

  return (
    <div className="space-y-4">
      {/* Motif de consultation */}
      <div className="space-y-3">
        <h4 className="font-medium text-vet-navy flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Motif de consultation
        </h4>
        <div className="text-sm space-y-3 pl-6">
          <div><strong>Type de consultation:</strong> {getConsultationTypeLabel(appointment.consultation_reason)}</div>
          
          {/* Résumé de la consultation par l'IA */}
          <div>
            <strong>Résumé de la consultation:</strong>
            {appointment.consultation_reason === 'consultation-convenance' ? (
              // Pour les consultations de convenance, afficher les options sélectionnées
              appointment.convenience_options && appointment.convenience_options.length > 0 ? (
                <div className="mt-1">
                  <div className="flex flex-wrap gap-1">
                    {getConvenienceOptionsLabels(appointment.convenience_options).map((label: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs bg-vet-beige/20">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <span className="ml-1 text-vet-brown">Consultation de convenance</span>
              )
            ) : (
              // Pour les consultations avec symptômes, afficher le résumé IA
              appointment.ai_analysis?.analysis_summary ? (
                <p className="mt-1 text-vet-brown bg-blue-50 p-2 rounded-md border border-blue-200">
                  {appointment.ai_analysis.analysis_summary}
                </p>
              ) : (
                <span className="ml-1 text-vet-brown">En attente d'analyse</span>
              )
            )}
          </div>

          {appointment.selected_symptoms && appointment.selected_symptoms.length > 0 && (
            <div>
              <strong>Symptômes sélectionnés:</strong>
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

      {/* Niveau d'urgence simplifié (3 niveaux) */}
      {appointment.urgency_score && appointment.consultation_reason !== 'consultation-convenance' && (
        <div className="space-y-2">
          <h4 className="font-medium text-vet-navy flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Niveau d'urgence
          </h4>
          <div className="pl-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getUrgencyLevel(appointment.urgency_score).color}`}>
              {getUrgencyLevel(appointment.urgency_score).label}
            </div>
            {appointment.recommended_actions && appointment.recommended_actions.length > 0 && (
              <div className="text-sm mt-3">
                <strong>Actions recommandées:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1 text-vet-brown">
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

      {/* Galerie de photos */}
      {appointment.conditional_answers && (
        <PhotoGallery conditionalAnswers={appointment.conditional_answers} />
      )}
    </div>
  );
};
