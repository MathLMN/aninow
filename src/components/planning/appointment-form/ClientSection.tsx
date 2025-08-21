
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
            value={formData.client_status}
            onValueChange={(value) => onFieldUpdate('client_status', value)}
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
          <Label htmlFor="client_name" className="text-xs font-medium text-gray-700">Nom complet *</Label>
          <Input
            id="client_name"
            type="text"
            placeholder="Nom et prénom"
            value={formData.client_name}
            onChange={(e) => onFieldUpdate('client_name', e.target.value)}
            required
            className="h-7 text-xs"
          />
        </div>

        <div>
          <Label htmlFor="client_phone" className="text-xs font-medium text-gray-700">Téléphone</Label>
          <Input
            id="client_phone"
            type="tel"
            placeholder="06 12 34 56 78"
            value={formData.client_phone}
            onChange={(e) => onFieldUpdate('client_phone', e.target.value)}
            className="h-7 text-xs"
          />
        </div>

        <div>
          <Label htmlFor="client_email" className="text-xs font-medium text-gray-700">Email</Label>
          <Input
            id="client_email"
            type="email"
            placeholder="client@email.com"
            value={formData.client_email}
            onChange={(e) => onFieldUpdate('client_email', e.target.value)}
            className="h-7 text-xs"
          />
        </div>

        <div>
          <Label htmlFor="preferred_contact_method" className="text-xs font-medium text-gray-700">Contact préféré</Label>
          <Select value={formData.preferred_contact_method} onValueChange={(value) => onFieldUpdate('preferred_contact_method', value)}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">Téléphone</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
