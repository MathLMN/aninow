
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ConsultationSectionProps {
  formData: any;
  onFieldUpdate: (field: string, value: string) => void;
}

export const ConsultationSection = ({ formData, onFieldUpdate }: ConsultationSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-vet-navy">Motif de consultation</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="consultation_reason">Raison de la consultation *</Label>
          <Input
            id="consultation_reason"
            value={formData.consultation_reason}
            onChange={(e) => onFieldUpdate('consultation_reason', e.target.value)}
            placeholder="ex: Consultation de routine, Problème de peau..."
            required
          />
        </div>
        <div>
          <Label htmlFor="client_comment">Commentaire / Notes</Label>
          <Textarea
            id="client_comment"
            value={formData.client_comment}
            onChange={(e) => onFieldUpdate('client_comment', e.target.value)}
            placeholder="Informations supplémentaires..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
