
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
    <div className="space-y-3">
      <div className="flex items-center mb-3">
        <Stethoscope className="h-5 w-5 mr-2 text-purple-600" />
        <h3 className="font-semibold text-purple-900 text-lg">Motif de consultation</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="consultationReason" className="text-xs font-medium text-gray-700">Raison de la consultation *</Label>
          <Input
            id="consultationReason"
            value={formData.consultationReason}
            onChange={(e) => onFieldUpdate('consultationReason', e.target.value)}
            placeholder="ex: Consultation de routine, Problème de peau..."
            required
            className="h-9 text-sm"
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
            className="text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
};
