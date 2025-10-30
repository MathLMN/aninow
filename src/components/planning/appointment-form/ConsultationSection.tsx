
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope } from "lucide-react";

interface ConsultationSectionProps {
  formData: any;
  onFieldUpdate: (field: string, value: string) => void;
}

export const ConsultationSection = ({ formData, onFieldUpdate }: ConsultationSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center mb-2">
        <Stethoscope className="h-4 w-4 mr-1 text-purple-600" />
        <h3 className="font-semibold text-purple-900 text-sm">Motif de consultation</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="consultationReason" className="text-xs font-medium text-gray-700">Résumé de la demande (généré automatiquement) *</Label>
          <Textarea
            id="consultationReason"
            value={formData.consultationReason}
            onChange={(e) => onFieldUpdate('consultationReason', e.target.value)}
            placeholder="Le résumé des réponses du client apparaîtra ici..."
            required
            rows={4}
            className="text-xs resize-none bg-muted/30"
          />
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
    </div>
  );
};
