import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle, Camera, UserCircle } from "lucide-react";
import { PhotoGallery, PhotoGalleryRef } from "./PhotoGallery";
import { cn } from "@/lib/utils";

interface ConsultationInfoProps {
  appointment: any;
}

export const ConsultationInfo = ({ appointment }: ConsultationInfoProps) => {
  const photoGalleryRef = useRef<PhotoGalleryRef>(null);
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

  const isOnlineBooking = appointment.booking_source === 'online';

  return (
    <div className="space-y-4">
      {/* Vétérinaire assigné */}
      {appointment.veterinarian_id && (
        <div className="space-y-3">
          <h4 className="font-medium text-vet-navy flex items-center">
            <UserCircle className="h-4 w-4 mr-2" />
            Vétérinaire
          </h4>
          <div className="pl-6 space-y-3">
            <div className="text-sm">
              <strong>Assigné à:</strong> <span className="text-vet-brown">{appointment.veterinarian_name || 'Non spécifié'}</span>
            </div>
            
            {/* Note sur la préférence de vétérinaire pour RDV en ligne */}
            {isOnlineBooking && (
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
          </div>
        </div>
      )}

      {/* Motif de consultation */}
      <div className="space-y-3">
        <h4 className="font-medium text-vet-navy flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Motif de consultation
        </h4>
        <div className="text-sm space-y-3 pl-6">
          <div><strong>Type de consultation:</strong> {getConsultationTypeLabel(appointment.consultation_reason)}</div>
          
          {appointment.consultation_reason === 'consultation-convenance' && (
            <div>
              <strong>Prestations demandées:</strong>
              {appointment.convenience_options && appointment.convenience_options.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {getConvenienceOptionsLabels(appointment.convenience_options).map((label: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs bg-vet-beige/20">
                      {label}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="ml-1 text-vet-brown">Aucune prestation spécifiée</span>
              )}
              {appointment.custom_text && (
                <div className="mt-2 text-vet-brown bg-vet-beige/10 p-2 rounded-md">
                  <strong>Détails:</strong> {appointment.custom_text}
                </div>
              )}
            </div>
          )}
          
          {/* Résumé de la consultation par l'IA */}
          {appointment.consultation_reason === 'symptomes-anomalie' && (
            <div>
              <strong>Résumé de la consultation:</strong>
              {appointment.ai_analysis?.analysis_summary ? (
                <p className="mt-1 text-vet-brown bg-blue-50 p-2 rounded-md border border-blue-200">
                  {appointment.ai_analysis.analysis_summary}
                </p>
              ) : (
                <span className="ml-1 text-vet-brown">En attente d'analyse</span>
              )}
            </div>
          )}

          {/* Photos jointes */}
          {appointment.conditional_answers && (() => {
            const photoKeys = Object.keys(appointment.conditional_answers).filter(key => 
              key.includes('photo') && 
              typeof appointment.conditional_answers[key] === 'string' && 
              appointment.conditional_answers[key].length > 0
            );
            if (photoKeys.length > 0) {
              return (
                <div>
                  <strong>Photos jointes:</strong>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => photoGalleryRef.current?.openFirstPhoto()}
                      className="relative bg-vet-sage/10 border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white transition-colors"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Voir les photos jointes
                      <Badge 
                        variant="secondary" 
                        className="ml-2 bg-vet-sage text-white px-2 py-0.5 rounded-full animate-pulse"
                      >
                        {photoKeys.length}
                      </Badge>
                    </Button>
                  </div>
                </div>
              );
            }
            return null;
          })()}

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
        <PhotoGallery ref={photoGalleryRef} conditionalAnswers={appointment.conditional_answers} />
      )}
    </div>
  );
};
