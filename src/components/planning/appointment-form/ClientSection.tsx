
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Users } from "lucide-react";

interface ClientSectionProps {
  formData: any;
  onFieldUpdate: (field: string, value: string | number) => void;
}

export const ClientSection = ({ formData, onFieldUpdate }: ClientSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center mb-2">
        <Users className="h-4 w-4 mr-1 text-green-600" />
        <h3 className="font-semibold text-green-900 text-sm">Client</h3>
      </div>
      
      <div className="space-y-2">
        <div>
          <Label className="text-xs font-medium text-gray-700">Statut *</Label>
          <RadioGroup
            value={formData.clientStatus}
            onValueChange={(value) => onFieldUpdate('clientStatus', value)}
            className="flex gap-3 mt-1"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="existing" id="existing" className="h-3 w-3" />
              <Label htmlFor="existing" className="text-xs">Déjà client</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="new" id="new" className="h-3 w-3" />
              <Label htmlFor="new" className="text-xs">Nouveau</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="clientName" className="text-xs font-medium text-gray-700">Nom complet *</Label>
          <Input
            id="clientName"
            type="text"
            placeholder="Nom et prénom"
            value={formData.clientName}
            onChange={(e) => onFieldUpdate('clientName', e.target.value)}
            required
            className="h-7 text-xs"
          />
        </div>

        <div>
          <Label htmlFor="clientPhone" className="text-xs font-medium text-gray-700">Téléphone *</Label>
          <Input
            id="clientPhone"
            type="tel"
            placeholder="06 12 34 56 78"
            value={formData.clientPhone}
            onChange={(e) => onFieldUpdate('clientPhone', e.target.value)}
            required
            className="h-7 text-xs"
          />
        </div>

        <div>
          <Label htmlFor="clientEmail" className="text-xs font-medium text-gray-700">Email</Label>
          <Input
            id="clientEmail"
            type="email"
            placeholder="client@email.com"
            value={formData.clientEmail}
            onChange={(e) => onFieldUpdate('clientEmail', e.target.value)}
            className="h-7 text-xs"
          />
        </div>
      </div>
    </div>
  );
};
