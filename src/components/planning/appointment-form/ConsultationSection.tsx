import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Camera } from "lucide-react";
import { PhotoGallery, PhotoGalleryRef } from "../appointment-details/PhotoGallery";

interface ConsultationSectionProps {
  formData: any;
  onFieldUpdate: (field: string, value: string) => void;
  conditionalAnswers?: any;
}

export const ConsultationSection = ({ formData, onFieldUpdate, conditionalAnswers }: ConsultationSectionProps) => {
  const photoGalleryRef = useRef<PhotoGalleryRef>(null);
  
  // Détecter les photos dans conditional_answers
  const photoKeys = conditionalAnswers ? Object.keys(conditionalAnswers).filter((key) => 
    key.startsWith('photo_') && conditionalAnswers[key] && typeof conditionalAnswers[key] === 'string'
  ) : [];
  const hasPhotos = photoKeys.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center mb-2">
        <Stethoscope className="h-4 w-4 mr-1 text-purple-600" />
        <h3 className="font-semibold text-purple-900 text-sm">Motif de consultation</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="consultationReason" className="text-xs font-medium text-gray-700">Résumé de la demande *</Label>
          <Textarea
            id="consultationReason"
            value={formData.consultationReason}
            onChange={(e) => onFieldUpdate('consultationReason', e.target.value)}
            placeholder="Le résumé des réponses du client apparaîtra ici..."
            required
            rows={4}
            className="text-xs resize-none bg-muted/30"
          />
          
          {/* Bouton pour voir les photos jointes */}
          {hasPhotos && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => photoGalleryRef.current?.openFirstPhoto()}
              className="relative bg-vet-sage/10 border-vet-sage text-vet-sage hover:bg-vet-sage hover:text-white transition-colors w-full"
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
          )}
        </div>
        <div>
          <Label htmlFor="clientComment" className="text-xs font-medium text-gray-700">Commentaire / Notes</Label>
          <Textarea
            id="clientComment"
            value={formData.clientComment || ''}
            onChange={(e) => onFieldUpdate('clientComment', e.target.value)}
            placeholder="Informations supplémentaires..."
            rows={2}
            className="text-xs resize-none"
          />
        </div>
      </div>
      
      {/* Galerie de photos - invisible jusqu'au clic */}
      {conditionalAnswers && (
        <PhotoGallery ref={photoGalleryRef} conditionalAnswers={conditionalAnswers} />
      )}
    </div>
  );
};
